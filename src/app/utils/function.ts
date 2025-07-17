
import {
  AddressLookupTableAccount,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";

export const getSimulationUnits = async (
  connection: Connection,
  instructions: TransactionInstruction[],
  payer: PublicKey,
  addressLookupTableAccounts: AddressLookupTableAccount[] = [],
  priorityLevel = "Low"
): Promise<{
  status: number;
  data: [number, number | undefined];
  message: any;
}> => {
  try {
    const testInstructions = [
      ComputeBudgetProgram.setComputeUnitLimit({ units: 1_400_000 }),
      ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1000 }),
      ...instructions,
    ];

    const msg = new TransactionMessage({
      payerKey: payer,
      recentBlockhash: PublicKey.default.toString(),
      instructions: testInstructions,
    });
    const testVersionedTxn = new VersionedTransaction(
      addressLookupTableAccounts.length
        ? msg.compileToV0Message(addressLookupTableAccounts)
        : msg.compileToV0Message()
    );

    const [priorityFeesRes, simulation] = await Promise.all([
      fetch(connection.rpcEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "1",
          method: "getPriorityFeeEstimate",
          params: [
            {
              transaction: bs58.encode(testVersionedTxn.serialize()), // Pass the serialized transaction in Base58
              options: { priorityLevel },
            },
          ],
        }),
      }).then((x) => x.json()),
      connection.simulateTransaction(testVersionedTxn, {
        replaceRecentBlockhash: true,
        sigVerify: false,
      }),
    ]);

    if (simulation.value.err) {
      return {
        status: 400,
        data: [0, undefined],
        message: simulation.value.logs,
      };
    }

    const priorityFees = 100000;
    // const priorityFees = priorityFeesRes.result.priorityFeeEstimate;

    return {
      status: 200,
      data: [priorityFees, simulation.value.unitsConsumed],
      message: "",
    };
  } catch (error: any) {
    console.error("Error in getSimulationUnits:", error.logs);
    return { status: 400, data: [0, undefined], message: error.logs };
  }
};
