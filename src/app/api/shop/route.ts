import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { updateShop } from "@/lib/action/update";

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

  if (data.action === "update") {
    const updateShopRes = await updateShop(session.user.id, data);

    if (updateShopRes.statusCode !== 200) {
      return NextResponse.json(
        { error: "Failed to update shop info" },
        { status: updateShopRes.statusCode }
      );
    }

    return NextResponse.json(
      {
        name: data.shopName,
        receivingWallet: data.receivingWallet,
      },
      { status: 200 }
    );
  }
};
