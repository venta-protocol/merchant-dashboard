"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MerchantDashboard } from "./merchant-dashboard";
import PrivyWrapper from "@/lib/context/privy-wrapper";

interface DashboardSectionsProps {
  mpcWallet: string;
  balance: number;
  shopName: string;
  shopEmail: string;
  receivingWallet: string;
}

export function DashboardSections({
  mpcWallet,
  balance,
  shopName,
  shopEmail,
  receivingWallet,
}: DashboardSectionsProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Merchant Information</CardTitle>
        </CardHeader>
        <CardContent>
          <MerchantDashboard.InformationSection
            mpcWallet={mpcWallet}
            shopEmail={shopEmail}
            shopName={shopName}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Merchant Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <PrivyWrapper>
            <MerchantDashboard.BalanceSection
              balance={balance}
              receivingWallet={receivingWallet}
            />
          </PrivyWrapper>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loyalty & Rewards Program</CardTitle>
        </CardHeader>
        <CardContent>
          <MerchantDashboard.ProgramSection />
        </CardContent>
      </Card>
    </>
  );
}
