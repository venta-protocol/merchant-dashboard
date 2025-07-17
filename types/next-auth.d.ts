import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      mpcWallet: string;
      receivingWallet: string;
      country: string;
      seed: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    id: string;
    email: string;
    name: string;
    mpcWallet: string;
    receivingWallet: string;
    country: string;
    seed: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    mpcWallet: string;
    receivingWallet: string;
    country: string;
    seed: string;
  }
}
