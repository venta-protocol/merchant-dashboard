import NextAuth, { NextAuthConfig } from "next-auth";
import EmailProvider from "next-auth/providers/nodemailer";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { fetchLoginData } from "@/lib/http-db";
import {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASSWORD,
  EMAIL_FROM,
} from "@/lib/config";

const generateVerificationToken = () => {
  const token = Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
  return token.toString();
};

export const authConfig = {
  providers: [
    EmailProvider({
      server: {
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASSWORD,
        },
      },
      from: EMAIL_FROM,
      maxAge: 5 * 60,
      generateVerificationToken,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
      },
      authorize: async (credentials: any) => {
        const userEmail =
          typeof credentials.email === "string"
            ? credentials.email
            : credentials.email?.email;
        console.log(`============ ${userEmail} SIGN IN ============`);

        if (!userEmail) return null;

        const shopData = await fetchLoginData(userEmail);
        if (shopData) return shopData;

        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  adapter: DrizzleAdapter(db) as any,
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async session({ session, token }: any) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.mpcWallet = token.mpcWallet as string;
      session.user.receivingWallet = token.receivingWallet as string;
      session.user.country = token.country as string;

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
      }
      if (user?.name) {
        token.name = user.name;
      }
      if (user?.mpcWallet) {
        token.mpcWallet = user.mpcWallet;
      }
      if (user?.email) {
        token.email = user.email;
      }
      if (user?.receivingWallet) {
        token.receivingWallet = user.receivingWallet;
      }
      if (user?.country) {
        token.country = user.country;
      }

      if (trigger === "update") {
        let data = { ...token };

        if (session.user && session.user.receivingWallet) {
          data = { ...data, receivingWallet: session.user.receivingWallet };
        }

        if (session.user && session.user.name) {
          data = { ...data, name: session.user.name };
        }

        return data;
      }

      return token;
    },

    authorized({ auth, request: { nextUrl } }: any) {
      const isLoggedIn = !!auth?.user;
      const paths = ["/"]; // Protecting the home page

      const isProtected = paths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );
      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL("/login", nextUrl.origin); // Redirecting to /login
        redirectUrl.searchParams.append("callbackUrl", nextUrl.href);
        return Response.redirect(redirectUrl);
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signOut, unstable_update } =
  NextAuth(authConfig);
