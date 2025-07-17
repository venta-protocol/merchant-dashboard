"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { UserMenu } from "./user-menu";
import { SessionProvider } from "next-auth/react";

export function UserMenuWrapper() {
  return (
    <SessionProvider>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={{
          loginMethods: ["email", "wallet"],
          appearance: {
            theme: "light",
            accentColor: "#000000",
          },
        }}
      >
        <UserMenu />
      </PrivyProvider>
    </SessionProvider>
  );
}
