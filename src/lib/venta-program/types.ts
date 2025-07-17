import { IdlAccounts, ProgramAccount } from "@coral-xyz/anchor";
import { Perq } from "./idl/types/perq";

export type Global = IdlAccounts<Perq>["global"];
export type Partner = IdlAccounts<Perq>["partner"];
export type Partners = ProgramAccount<Partner>[];
export type Deal = IdlAccounts<Perq>["deal"];
export type Deals = ProgramAccount<Deal>[];
export type CreditReceipt = IdlAccounts<Perq>["creditReceipt"];
export type CreditReceipts = ProgramAccount<CreditReceipt>[];