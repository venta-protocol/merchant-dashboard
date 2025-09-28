"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendBackendRequest } from "@/lib/utils.client";
import { Endpoint, HttpMethod } from "@/lib/utils.client";
import { useSignAndSendTransaction } from "@/lib/context/useSignAndSendTransaction";
import { Connection } from "@solana/web3.js";
import { endpoint } from "@/lib/config";
import { useRouter } from "next/navigation";

interface InformationSectionProps {
  mpcWallet: string;
  shopName: string;
  shopEmail: string;
}

interface BalanceSectionProps {
  balance: number;
  receivingWallet: string;
}

interface ProgramSectionProps {}

export const MerchantDashboard = {
  InformationSection: ({
    mpcWallet,
    shopEmail,
    shopName,
  }: InformationSectionProps) => {
    return (
      <div className="space-y-2">
        <div>
          <p className="text-sm text-muted-foreground">Shop Name</p>
          <p className="font-medium">{shopName}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{shopEmail}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Wallet Address</p>
          <p className="font-medium break-all">{mpcWallet}</p>
        </div>
      </div>
    );
  },

  BalanceSection: ({ balance, receivingWallet }: BalanceSectionProps) => {
    const { signAndSendTransaction } = useSignAndSendTransaction();
    const [isTransferring, setIsTransferring] = useState(false);
    const router = useRouter();
    const handleWithdraw = async () => {
      try {
        setIsTransferring(true);
        // Send PUT request to /api/merchant
        const response = await sendBackendRequest(
          Endpoint.MERCHANT,
          HttpMethod.PUT,
          {
            action: "withdraw",
          }
        );

        // Display error message from response if response is not ok
        const data = await response.json();
        if (!response.ok) {
          toast.error(data.error);
          setIsTransferring(false);
          return;
        }

        try {
          const { signature } = await signAndSendTransaction(data.base64, {
            buttonText: `Withdraw ${balance} USD`,
            description: "Send transfer request",
          });
          const connection = new Connection(endpoint, "processed");
          const { blockhash, lastValidBlockHeight } =
            await connection.getLatestBlockhash();
          const confirmation = await connection.confirmTransaction(
            { signature, blockhash, lastValidBlockHeight },
            "processed"
          );

          if (confirmation && !confirmation.value?.err) {
            await sendBackendRequest(Endpoint.MERCHANT, HttpMethod.PUT, {
              action: "refresh",
            });
            toast.success(`Successfully withdraw ${balance} USD`);
          } else {
            toast.error("Transaction failed, please try agian");
          }
        } catch (error: unknown) {
          console.error("Error transferring balance:", error);
        } finally {
          setIsTransferring(false);
        }
        router.refresh();
      } catch (error) {
        console.error("Error transferring balance:", error);
        setIsTransferring(false);
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">${balance}</p>
            <p className="text-sm text-muted-foreground">
              Available for transfer
            </p>
          </div>
          <Button onClick={handleWithdraw} loading={isTransferring}>
            Transfer to Wallet
          </Button>
        </div>
        <div className="text-sm">
          <p className="font-medium">Receiving Wallet:</p>
          <p className="text-muted-foreground break-all">{receivingWallet}</p>
        </div>
      </div>
    );
  },

  ProgramSection: ({}: ProgramSectionProps) => {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Coming soon...</p>
        </div>
      </div>
    );
  },
};
