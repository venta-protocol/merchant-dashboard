export enum HttpMethod {
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  GET = "GET",
}
export enum Endpoint {
  PRODUCT = "product",
  DEPARTMENT = "department",
  SHOP = "shop",
  TEAM = "team",
  DISCOUNT = "discount",
  MERCHANT = "merchant",
  EMBER = "ember",
  UPLOADER = "uploader",
  ORDER = "order",
  CASHIER = "cashier",
  LOGIN = "login",
  STRIPE_CONNECT = "integration/stripe-connect",
  BULK_CREDIT = "extension/bulk-credit",
}

export type IPartnerData = {
  id: string;
  email: string;
  partnerName: string;
  walletAddress: string;
  website?: string;
  contactPhone?: string;
  apiKey: string;
  shops: {
    id: string;
    name: string;
    email: string;
    mpcWallet: string;
    country: string;
    createdAt: string;
  }[];
};
export type IShopData = {
  id: string;
  email: string;
  name: string;
  mpcWallet: string;
  country: string;
  balance: number;
  receivingWallet: string;
};

export enum MerchantStatus {
  Found = "Found",
  Fetching = "Fetching",
  Loading = "Loading",
  NotFound = "NotFound",
  ServerError = "ServerError",
}

// ====================================== ACTION
export enum MerchantAction {
  RegisterMerchant = "RegisterMerchant",
  RequestWithdrawPin = "RequestWithdrawPin",
  RequestUpdatePin = "RequestUpdatePin",
  RequestUpdate = "RequestUpdate",
  MakePayment = "MakePayment",
  Withdraw = "Withdraw",
  Transfer = "Transfer",
  ToggleLoyalty = "ToggleLoyalty",
  UpdateMerchantSettings = "UpdateMerchantSettings",
  Test = "Test",
}
