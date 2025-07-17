import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import { PRIVY_SECRET_KEY, PRIVY_APP_ID } from "@/lib/config";
import { verifyAccessTokenByEmail } from "@/lib/action/update/shop";

export const PUT = async (req: NextRequest, res: NextResponse) => {
  const idToken = req.headers.get("authorization");

  if (!idToken) {
    return NextResponse.json({ error: "Invalid request" }, { status: 500 });
  }
  const privyClient = new PrivyClient(PRIVY_APP_ID!, PRIVY_SECRET_KEY!);

  const [data, verifiedClaims] = await Promise.all([
    req.json(),
    privyClient.verifyAuthToken(idToken),
  ]);
  if (!data || !verifiedClaims.userId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 500 });
  }
  const user = await privyClient.getUserById(verifiedClaims.userId);
  if (!user.email) {
    return NextResponse.json({ error: "Invalid request" }, { status: 500 });
  }

  console.log("reqData", user.email.address);
  const verifyResponse = await verifyAccessTokenByEmail(user.email.address);
  console.log("verifyResponse", verifyResponse);
  if (verifyResponse.statusCode >= 400) {
    return NextResponse.json(
      { message: verifyResponse.message },
      { status: 400 }
    );
  } else {
    return NextResponse.json(
      { message: verifyResponse.message },
      { status: 200 }
    );
  }
};
