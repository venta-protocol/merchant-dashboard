import { redirect } from "next/navigation";
import { IShopData } from "@/lib/types.client";
import AccessDeny from "@/components/access-deny";
import { auth } from "@/app/auth";
import { DashboardSections } from "@/components/dashboard-sections";
import { UserMenuWrapper } from "@/components/user-menu-wrapper";
import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { SupportedSplTokens } from "@/lib/constants";
import { endpoint } from "@/lib/config";
import { getCachedShopData, setCachedShopData } from "@/lib/cache/shop-data";

async function fetchShopDataFromAPIs(session: any): Promise<IShopData> {
  console.log("Fetching fresh shop data from APIs...");

  const connection = new Connection(endpoint, "processed");
  const allBalances = await Promise.all(
    SupportedSplTokens.map(async (token) => {
      const mpcWalletAta = getAssociatedTokenAddressSync(
        new PublicKey(token.mint),
        new PublicKey(session.user.mpcWallet!),
        false,
        new PublicKey(token.tokenProgram)
      );
      const { value } = await connection
        .getTokenAccountBalance(mpcWalletAta)
        .catch((e) => {
          return {
            value: { amount: "-1" },
          };
        });
      if (Number(value.amount) > 0) {
        return Number(value.amount) / 10 ** token.decimal;
      } else {
        return null;
      }
    })
  ).then((x) => x.filter((y) => y !== null));
  const totalBalance = allBalances
    .reduce((acc, curr) => acc + curr, 0)
    .toFixed(2);

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    mpcWallet: session.user.mpcWallet,
    country: session.user.country ?? "",
    balance: Number(totalBalance),
    receivingWallet: session.user.receivingWallet,
  };
}

async function getShopInfo(): Promise<IShopData | null> {
  const session = await auth();
  console.log(session?.user);
  if (
    !session ||
    !session.user ||
    !session.user.id ||
    !session.user.email ||
    !session.user.name ||
    !session.user.mpcWallet
  ) {
    redirect("/login?callbackUrl=/");
  }

  // Try to get cached data first (10-minute TTL)
  const cachedData = await getCachedShopData(session.user.id);
  if (cachedData) {
    return cachedData;
  }

  // Cache miss - fetch fresh data from APIs
  const freshData = await fetchShopDataFromAPIs(session);

  // Cache the fresh data for 10 minutes
  await setCachedShopData(session.user.id, freshData);

  return freshData;
}

export default async function Dashboard() {
  const shop = await getShopInfo();

  if (!shop) {
    return <AccessDeny />;
  }

  return (
    <main className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Merchant Dashboard</h1>
        <UserMenuWrapper />
      </div>
      <DashboardSections
        mpcWallet={shop.mpcWallet}
        balance={shop.balance}
        shopName={shop.name}
        shopEmail={shop.email}
        receivingWallet={shop.receivingWallet}
      />
    </main>
  );
}
