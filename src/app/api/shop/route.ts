import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { backend_path } from "@/lib/config";
import {
  invalidateCachedShopData,
  refreshCachedShopData,
} from "@/lib/cache/shop-data";

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
    const updateRes = await fetch(
      `${backend_path}/v1/admin/shop-profile/${session.user.id}`,
      {
        method: "PUT",
        headers: {
          "x-admin-key": process.env.ADMIN_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.shopName,
          receivingWallet: data.receivingWallet,
        }),
      }
    );

    const { data: updateData, success } = await updateRes.json();
    if (!updateRes.ok || !success) {
      return NextResponse.json(
        { error: "Failed to update partner info" },
        { status: 500 }
      );
    }

    // Invalidate cache after successful update
    await refreshCachedShopData(session.user.id, updateData);

    return NextResponse.json(
      {
        name: data.shopName,
        receivingWallet: data.receivingWallet,
      },
      { status: 200 }
    );
  }
};
