import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { PublicKey } from "@solana/web3.js";
import VentaSDKService from "@/lib/venta-program/venta-service";
import { invalidateCachedShopData } from "@/lib/cache/shop-data";

export const PUT = async (req: NextRequest, res: NextResponse) => {
  const [session, data] = await Promise.all([auth(), req.json()]);

  console.log("session", session?.user);
  if (
    !session ||
    !session.user ||
    !session.user.id ||
    !session.user.mpcWallet ||
    !session.user.receivingWallet ||
    !data.action
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 500 });
  }

  switch (data.action) {
    case "withdraw":
      // 1. Create withdraw from privy wallet to receiving wallet
      const { mpcWallet, receivingWallet } = session.user;

      if (mpcWallet === receivingWallet) {
        return NextResponse.json(
          { error: "MPC wallet and receiving wallet cannot be the same" },
          { status: 400 }
        );
      }

      const service = VentaSDKService.getService();
      const { base64, signature, status, error } =
        await service.getWithdrawalTx(
          new PublicKey(mpcWallet),
          new PublicKey(receivingWallet)
        );

      if (status === 204 || status === 400) {
        return NextResponse.json({ error }, { status: 400 });
      } else if (status === 500) {
        return NextResponse.json({ error }, { status: 500 });
      }

      return NextResponse.json(
        {
          message: "Withdrawal transaction created successfully",
          base64,
          signature,
        },
        { status: 200 }
      );

    case "refresh":
      try {
        await invalidateCachedShopData(session.user.id);
        return NextResponse.json({ success: true }, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
      }

    default:
      break;
  }
};
