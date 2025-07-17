import { db, eq } from "@/lib/db";
import { shops } from "@/lib/db/schema";
import { getShopForVerification } from "@/lib/http-db";

export const verifyAccessTokenByEmail = async (
  email: string
): Promise<{
  statusCode: number;
  message: null | {
    shopId: string;
  };
}> => {
  try {
    const startTimeVerify = Date.now();
    const data = await getShopForVerification(email);
    if (!data) {
      return {
        statusCode: 400,
        message: null,
      };
    }

    if (!data.verified) {
      return {
        statusCode: 400,
        message: null,
      };
    }
    const endTimeVerify = Date.now();
    const durationVerify = endTimeVerify - startTimeVerify;
    console.log("Verify Duration (ms):", durationVerify);
    return {
      statusCode: 200,
      message: data,
    };
  } catch (error) {
    console.error("Error verifying access token:", error);
    return {
      statusCode: 500,
      message: null,
    };
  }
};

export const updateShop = async (
  shopId: string,
  shopInfo: { shopName: string; receivingWallet: string }
): Promise<{ statusCode: number }> => {
  try {
    const txs = [];

    const newShopData = {};
    if (shopInfo.receivingWallet) {
      Object.assign(newShopData, { receivingWallet: shopInfo.receivingWallet });
    }

    if (shopInfo.shopName) {
      Object.assign(newShopData, { name: shopInfo.shopName });
    }

    txs.push(db.update(shops).set(newShopData).where(eq(shops.id, shopId)));
    await Promise.all(txs);
  } catch (error) {
    console.error("Error updating shop info:", error);
    return { statusCode: 500 };
  }
  return { statusCode: 200 };
};
