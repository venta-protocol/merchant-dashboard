import { camelCase } from "lodash";
import {
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
} from "./config";

const supabaseServiceKey = SUPABASE_SERVICE_ROLE_KEY;
const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

export const keysToCamel = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj.map((v) => keysToCamel(v));
  } else if (obj !== null && typeof obj === "object") {
    return Object.entries(obj).reduce((acc, [key, val]) => {
      acc[camelCase(key)] = keysToCamel(val);
      return acc;
    }, {} as Record<string, unknown>);
  }
  return obj;
};

export async function fetchLoginData(email: string) {
  const query =
    `${supabaseUrl}/rest/v1/shops` +
    `?email=eq.${email}&is_active=eq.true` +
    `&select=*`;

  const response = await fetch(query, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseServiceKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Failed to fetch login data:", error);
    return null;
  }

  const data = await response.json();
  const [shopData] = keysToCamel(data) as [
    {
      id: string;
      name: string;
      email: string;
      mpcWallet: string;
      receivingWallet: string;
      country: string;
      seed: string;
      isActive: boolean;
    }
  ];
  if (
    !shopData ||
    !shopData.id ||
    !shopData.name ||
    !shopData.email ||
    !shopData.mpcWallet ||
    !shopData.receivingWallet ||
    !shopData.isActive
  ) {
    return null;
  }

  return {
    id: shopData.id,
    email: shopData.email,
    name: shopData.name,
    mpcWallet: shopData.mpcWallet,
    receivingWallet: shopData.receivingWallet,
    country: shopData.country,
    seed: shopData.seed,
    isActive: shopData.isActive,
  };
}

export const getShopDetails = async (shopId: string) => {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/shops?id=eq.${shopId}&select=id,name,email,mpc_wallet,country,receiving_wallet`,
    {
      headers: {
        apikey: supabaseServiceKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Failed to fetch shop details:", errorText);
    throw new Error("Shop details fetch failed");
  }

  const [shopData] = keysToCamel(await res.json()) as [
    {
      id: string;
      name: string;
      email: string;
      mpcWallet: string;
      country: string;
      receivingWallet: string;
    }
  ];
  return shopData;
};

export const getShopForVerification = async (email: string) => {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/shops?email=eq.${email}&select=id,verified&limit=1`,
    {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Failed to fetch shop for verification:", errorText);
    throw new Error("Shop fetch failed");
  }

  const [data] = await res.json();
  return data
    ? {
        shopId: data.id,
        verified: data.verified,
      }
    : null;
};
