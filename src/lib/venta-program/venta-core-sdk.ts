// import { BN, Wallet, AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
// import { PublicKey, Connection, TransactionInstruction } from "@solana/web3.js";
// import { Ember } from "./idl/types/ember";
// import emberIDL from "./idl/idl/ember.json";
// import {
//   TOKEN_PROGRAM_ID,
//   getAssociatedTokenAddressSync,
// } from "@solana/spl-token";
// import {
//   Global,
//   Merchant,
//   Customer,
//   Merchants,
//   Customers,
//   Tier,
// } from "./types";

// export class VentaCoreSDK {
//   public connection: Connection;
//   public managerAuthority: Wallet;
//   public provider: AnchorProvider;
//   public emberProgram: Program<Ember>;
//   public globalConfig: Global | undefined;
//   public emberMerchants: Merchants = [];
//   public emberCustomers: Customers = [];

//   constructor(connection: Connection, wallet: Wallet) {
//     this.provider = new AnchorProvider(connection, wallet, {
//       commitment: "confirmed",
//     });
//     this.managerAuthority = wallet;
//     this.connection = connection;

//     // Initialize the program
//     this.emberProgram = new Program(
//       emberIDL as Idl,
//       this.provider
//     ) as unknown as Program<Ember>;
//   }

//   // Initialize SDK data
//   async initialize(): Promise<void> {
//     try {
//       // Load global config
//       const [globalConfigPDA] = this.getGlobalConfigPDA();
//       const globalConfig = await this.emberProgram.account.global.fetch(
//         globalConfigPDA
//       );

//       // Assign results to class properties
//       this.globalConfig = globalConfig;
//     } catch (error: any) {
//       console.error("Error during initialization:", error);
//       throw new Error(`Failed to initialize VentaCoreSDK: ${error.message}`);
//     }
//   }

//   // Static factory method that creates and initializes the SDK
//   static async initialize(
//     connection: Connection,
//     wallet: Wallet
//   ): Promise<VentaCoreSDK> {
//     const sdk = new VentaCoreSDK(connection, wallet);
//     await sdk.initialize();
//     return sdk;
//   }
//   // Refresh method to update data
//   async refresh(): Promise<void> {
//     await this.initialize();
//   }

//   // ================= CORE PROGRAM PDA =================
//   // PDA derivation helpers
//   getGlobalConfigPDA(): [PublicKey, number] {
//     return PublicKey.findProgramAddressSync(
//       [Buffer.from("global")],
//       this.emberProgram.programId
//     );
//   }

//   getEmberMerchantPDA(seed: PublicKey): [PublicKey, number] {
//     return PublicKey.findProgramAddressSync(
//       [Buffer.from("merchant"), seed.toBuffer()],
//       this.emberProgram.programId
//     );
//   }

//   getEmberCustomerPDA(
//     customerWallet: PublicKey,
//     emberMerchantAccount: PublicKey
//   ): [PublicKey, number] {
//     return PublicKey.findProgramAddressSync(
//       [
//         Buffer.from("customer"),
//         customerWallet.toBuffer(),
//         emberMerchantAccount.toBuffer(),
//       ],
//       this.emberProgram.programId
//     );
//   }

//   // ================= EMBER PROGRAM Data Fetching =================
//   // Account data fetching methods
//   async getGlobalConfig(): Promise<Global> {
//     const [globalConfig] = this.getGlobalConfigPDA();
//     const globalConfigData = await this.emberProgram.account.global.fetch(
//       globalConfig
//     );
//     this.globalConfig = globalConfigData;
//     return globalConfigData;
//   }

//   async getMerchantAccount(seed: PublicKey): Promise<Merchant> {
//     const [merchantAccount] = this.getEmberMerchantPDA(seed);
//     return this.emberProgram.account.merchant.fetch(merchantAccount);
//   }

//   async getMerchantAccountBySeed(seed: PublicKey): Promise<{
//     merchantData: Merchant;
//     customersData: Customers;
//     key: PublicKey;
//   } | null> {
//     const [merchantAccount] = this.getEmberMerchantPDA(seed);

//     const merchantData = await this.emberProgram.account.merchant.fetch(
//       merchantAccount
//     );
//     const customersData = await this.getAllCustomersByMerchant(merchantAccount);
//     return {
//       merchantData,
//       customersData,
//       key: merchantAccount,
//     };
//   }

//   async getEmberCustomer(
//     customerWallet: PublicKey,
//     emberMerchantAccount: PublicKey
//   ): Promise<Customer> {
//     const [customerAccount] = this.getEmberCustomerPDA(
//       customerWallet,
//       emberMerchantAccount
//     );
//     return this.emberProgram.account.customer.fetch(customerAccount);
//   }
//   async getAllCustomersByMerchant(
//     emberMerchantAccount: PublicKey
//   ): Promise<Customers> {
//     const filter = [
//       {
//         memcmp: {
//           offset: 8 + 32, //prepend for anchor's discriminator
//           bytes: emberMerchantAccount.toBase58(),
//         },
//       },
//     ];
//     return this.emberProgram.account.customer.all(filter);
//   }
//   async getAllCustomersByOwner(customerWallet: PublicKey): Promise<Customers> {
//     const filter = [
//       {
//         memcmp: {
//           offset: 8, //prepend for anchor's discriminator
//           bytes: customerWallet.toBase58(),
//         },
//       },
//     ];
//     return this.emberProgram.account.customer.all(filter);
//   }

//   // ================= EMBER PROGRAM Instructions =================

//   initMerchantIx(
//     authority: PublicKey,
//     seed: PublicKey,
//     rewardExpiryDurationDays: number,
//     volumeRollingDurationDays: number,
//     tiers: Tier[]
//   ): Promise<TransactionInstruction> {
//     if (!this.globalConfig) {
//       throw new Error("Global config not found");
//     }

//     const [merchant] = this.getEmberMerchantPDA(seed);

//     return this.emberProgram.methods
//       .initMerchant(
//         seed,
//         rewardExpiryDurationDays,
//         volumeRollingDurationDays,
//         tiers
//       )
//       .accountsPartial({
//         payer: this.managerAuthority.publicKey,
//         authority,
//         merchant,
//       })
//       .instruction();
//   }

//   updateMerchantIx(
//     authority: PublicKey,
//     seed: PublicKey,
//     newAuthority: PublicKey | null,
//     rewardExpiryDurationDays: number | null,
//     volumeRollingDurationDays: number | null,
//     tiers: Tier[]
//   ): Promise<TransactionInstruction> {
//     if (!this.globalConfig) {
//       throw new Error("Global config not found");
//     }

//     const [merchant] = this.getEmberMerchantPDA(seed);

//     return this.emberProgram.methods
//       .updateMerchant(
//         newAuthority,
//         rewardExpiryDurationDays,
//         volumeRollingDurationDays,
//         null,
//         tiers
//       )
//       .accountsPartial({
//         authority,
//         merchant,
//       })
//       .instruction();
//   }

//   async closeMerchantIx(
//     authority: PublicKey,
//     merchantSeed: PublicKey
//   ): Promise<TransactionInstruction> {
//     const [global] = this.getGlobalConfigPDA();
//     const [merchant] = this.getEmberMerchantPDA(merchantSeed);

//     let treasury: PublicKey;
//     if (this.globalConfig) {
//       treasury = this.globalConfig.treasury;
//     } else {
//       // TODO: Cache this
//       treasury = (await this.getGlobalConfig()).treasury;
//     }
//     return this.emberProgram.methods
//       .closeMerchant()
//       .accountsPartial({
//         feeReceiver: treasury,
//         authority,
//         global,
//         merchant,
//       })
//       .instruction();
//   }

//   // TODO: Cache custoemr for quick lookup
//   initCustomerIx(
//     buyer: PublicKey,
//     seed: PublicKey
//   ): Promise<TransactionInstruction> {
//     if (!this.globalConfig) {
//       throw new Error("Global config not found");
//     }

//     const [merchant] = this.getEmberMerchantPDA(seed);
//     const [customer] = this.getEmberCustomerPDA(buyer, merchant);

//     return this.emberProgram.methods
//       .initCustomer()
//       .accountsPartial({
//         payer: this.managerAuthority.publicKey,
//         authority: buyer,
//         merchant,
//         customer,
//       })
//       .instruction();
//   }
//   updateCustomerIx(
//     buyer: PublicKey,
//     shopWallet: PublicKey,
//     seed: PublicKey,
//     totalVolume: BN,
//     pendingReward: BN,
//     volumeEpochDay: number,
//     blacklistStatus: boolean
//   ): Promise<TransactionInstruction> {
//     if (!this.globalConfig) {
//       throw new Error("Global config not found");
//     }

//     const [merchant] = this.getEmberMerchantPDA(seed);
//     const [customer] = this.getEmberCustomerPDA(buyer, merchant);

//     return this.emberProgram.methods
//       .updateCustomer(
//         totalVolume,
//         pendingReward,
//         volumeEpochDay,
//         blacklistStatus
//       )
//       .accountsPartial({
//         authority: shopWallet,
//         merchant,
//         customer,
//       })
//       .instruction();
//   }

//   async makePaymentIx(
//     merchantSeed: PublicKey,
//     mint: PublicKey,
//     shopWallet: PublicKey,
//     buyer: PublicKey,
//     buyerAta: PublicKey,
//     amount: BN,
//     totalFees: BN = new BN(0),
//     tokenProgramId = TOKEN_PROGRAM_ID
//   ): Promise<TransactionInstruction> {
//     if (!this.globalConfig) {
//       console.log("Global config not found");
//       await this.initialize();
//       if (!this.globalConfig) {
//         throw new Error("Global config not found");
//       }
//     }

//     const [global] = this.getGlobalConfigPDA();

//     const [merchant] = this.getEmberMerchantPDA(merchantSeed);
//     const [customer] = this.getEmberCustomerPDA(buyer, merchant);

//     const shopWalletAta = getAssociatedTokenAddressSync(mint, shopWallet);
//     const treasuryAta = getAssociatedTokenAddressSync(
//       mint,
//       this.globalConfig.treasury
//     );

//     return this.emberProgram.methods
//       .makePayment(amount, totalFees)
//       .accountsPartial({
//         global,
//         merchant,
//         customer,
//         mint,
//         buyer,
//         buyerAta,
//         shopWalletAta,
//         treasuryAta,
//         tokenProgram: tokenProgramId,
//       })
//       .instruction();
//   }

//   // Just execute makePayment
//   // - calculate fee from global
//   // - Then either transfer all to shopWallet, or discount by reducing pending reward

//   // End goal:
//   // - Modular payment flow > Extension can handle custom logic
//   // - Close program and update next time since no funds are hold custody
// }

import { BN, Wallet, AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import {
  PublicKey,
  Connection,
  TransactionInstruction,
  SystemProgram,
} from "@solana/web3.js";
// import { Ember } from "./idl/types/ember";
// import emberIDL from "./idl/idl/ember.json";
import { Perq } from "./idl/types/perq";
import perqIDL from "./idl/idl/perq.json";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { IdlAccounts, ProgramAccount } from "@coral-xyz/anchor";

export type Global = IdlAccounts<Perq>["global"];
export type Partner = IdlAccounts<Perq>["partner"];
export type Partners = ProgramAccount<Partner>[];
export type Deal = IdlAccounts<Perq>["deal"];
export type Deals = ProgramAccount<Deal>[];
export type CreditReceipt = IdlAccounts<Perq>["creditReceipt"];
export type CreditReceipts = ProgramAccount<CreditReceipt>[];

export class VentaCoreSDK {
  public connection: Connection;
  public admin: Wallet;
  public provider: AnchorProvider;
  // public bmberProgram: Program<Ember>;
  public perqProgram: Program<Perq>;
  public globalConfig: Global | undefined;
  public perqPartners: Partners = [];
  public perqDeals: Deals = [];
  public perqCreditReceipts: CreditReceipts = [];

  constructor(connection: Connection, wallet: Wallet) {
    this.provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    this.admin = wallet;
    this.connection = connection;

    // Initialize the program
    this.perqProgram = new Program(
      perqIDL as Idl,
      this.provider
    ) as unknown as Program<Perq>;
  }

  // Initialize SDK data
  async initialize(): Promise<void> {
    try {
      // Load global config
      const [globalConfigPDA] = this.getGlobalConfigPDA();
      const globalConfig = await this.perqProgram.account.global.fetch(
        globalConfigPDA
      );

      // Assign results to class properties
      this.globalConfig = globalConfig;
    } catch (error: any) {
      console.error("Error during initialization:", error);
      throw new Error(`Failed to initialize VentaCoreSDK: ${error.message}`);
    }
  }

  // Static factory method that creates and initializes the SDK
  static async initialize(
    connection: Connection,
    wallet: Wallet
  ): Promise<VentaCoreSDK> {
    const sdk = new VentaCoreSDK(connection, wallet);
    await sdk.initialize();
    return sdk;
  }
  // Refresh method to update data
  async refresh(): Promise<void> {
    await this.initialize();
  }

  // ================= CORE PROGRAM PDA =================
  // PDA derivation helpers
  getGlobalConfigPDA(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("global")],
      this.perqProgram.programId
    );
  }

  getPartnerPDA(owner: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("partner"), owner.toBuffer()],
      this.perqProgram.programId
    );
  }

  getDealPDA(merchant: PublicKey, nonce: number): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("deal"),
        merchant.toBuffer(),
        new BN(nonce).toArrayLike(Buffer, "le", 2),
      ],
      this.perqProgram.programId
    );
  }

  getCreditReceiptPDA(
    advertiser: PublicKey,
    deal: PublicKey,
    timestamp: BN
  ): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("credit_receipt"),
        advertiser.toBuffer(),
        deal.toBuffer(),
        timestamp.toArrayLike(Buffer, "le", 8),
      ],
      this.perqProgram.programId
    );
  }

  // ================= PERQ PROGRAM Data Fetching =================
  // Account data fetching methods
  async getGlobalConfig(): Promise<Global> {
    const [globalConfig] = this.getGlobalConfigPDA();
    const globalConfigData = await this.perqProgram.account.global.fetch(
      globalConfig
    );
    this.globalConfig = globalConfigData;
    return globalConfigData;
  }

  async getPartnerAccount(owner: PublicKey): Promise<Partner> {
    const [partnerAccount] = this.getPartnerPDA(owner);
    return this.perqProgram.account.partner.fetch(partnerAccount);
  }

  async getDealAccount(merchant: PublicKey, nonce: number): Promise<Deal> {
    const [dealAccount] = this.getDealPDA(merchant, nonce);
    return this.perqProgram.account.deal.fetch(dealAccount);
  }

  async getCreditReceiptAccount(
    advertiser: PublicKey,
    deal: PublicKey,
    timestamp: BN
  ): Promise<CreditReceipt> {
    const [creditReceiptAccount] = this.getCreditReceiptPDA(
      advertiser,
      deal,
      timestamp
    );
    return this.perqProgram.account.creditReceipt.fetch(creditReceiptAccount);
  }

  async getAllDealsByMerchant(merchant: PublicKey): Promise<Deals> {
    const filter = [
      {
        memcmp: {
          offset: 8, // Discriminator
          bytes: merchant.toBase58(),
        },
      },
    ];
    return this.perqProgram.account.deal.all(filter);
  }

  async getAllCreditReceiptsByAdvertiser(
    advertiser: PublicKey
  ): Promise<CreditReceipts> {
    const filter = [
      {
        memcmp: {
          offset: 8, // Discriminator
          bytes: advertiser.toBase58(),
        },
      },
    ];
    return this.perqProgram.account.creditReceipt.all(filter);
  }

  // ================= PERQ PROGRAM Instructions =================

  // initOrUpdateGlobalIx(
  //   treasury: PublicKey | null,
  //   whitelistedTokens: PublicKey[] | null,
  //   approvers: PublicKey[] | null,
  //   swapFeeBps: number | null,
  //   purchaseFeeBps: number | null,
  //   txFeeBps: number | null,
  //   state: { normal: {} } | null
  // ): Promise<TransactionInstruction> {
  //   const [global] = this.getGlobalConfigPDA();

  //   return this.perqProgram.methods
  //     .initOrUpdateGlobal(
  //       treasury,
  //       whitelistedTokens,
  //       approvers,
  //       swapFeeBps,
  //       purchaseFeeBps,
  //       txFeeBps,
  //       state
  //     )
  //     .accountsPartial({
  //       payer: this.admin.publicKey,
  //       authority: this.admin.publicKey,
  //       global,
  //       systemProgram: SystemProgram.programId,
  //     })
  //     .instruction();
  // }

  initOrUpdatePartnerIx(
    owner: PublicKey,
    approvalAuthority: PublicKey | null,
    treasury: PublicKey | null,
    role: { merchant: {} } | { advertiser: {} } | { both: {} } | null,
    isFrozen: boolean | null
  ): Promise<TransactionInstruction> {
    const [global] = this.getGlobalConfigPDA();
    const [partner] = this.getPartnerPDA(owner);

    return this.perqProgram.methods
      .initOrUpdatePartner(approvalAuthority, treasury, role, isFrozen)
      .accountsPartial({
        global,
        payer: this.admin.publicKey,
        owner,
        partner,
        approvalAuthority: this.admin.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .instruction();
  }

  createDealIx(
    merchant: PublicKey,
    nonce: number,
    price: BN,
    creditFaceValue: BN,
    validityDays: number,
    isTradable: boolean,
    isPremium: boolean
  ): {
    ix: Promise<TransactionInstruction>;
    accountData: { partner: PublicKey; deal: PublicKey; programId: PublicKey };
  } {
    const [global] = this.getGlobalConfigPDA();
    const [merchantPartner] = this.getPartnerPDA(merchant);
    const [deal] = this.getDealPDA(merchant, nonce);

    return {
      ix: this.perqProgram.methods
        .createDeal(
          nonce,
          price,
          creditFaceValue,
          validityDays,
          isTradable,
          isPremium
        )
        .accountsPartial({
          global,
          deal,
          merchant: merchantPartner,
          authority: merchant,
          payer: this.admin.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .instruction(),
      accountData: {
        partner: merchantPartner,
        deal,
        programId: this.perqProgram.programId,
      },
    };
  }

  buyDealIx(
    advertiser: PublicKey,
    merchant: PublicKey,
    deal: PublicKey,
    mint: PublicKey,
    timestamp: BN
  ): Promise<TransactionInstruction> {
    const [global] = this.getGlobalConfigPDA();
    const [advertiserPartner] = this.getPartnerPDA(advertiser);
    const [merchantPartner] = this.getPartnerPDA(merchant);
    const [creditReceipt] = this.getCreditReceiptPDA(
      advertiserPartner,
      deal,
      timestamp
    );

    const advertiserAta = getAssociatedTokenAddressSync(mint, advertiser);
    const merchantAta = getAssociatedTokenAddressSync(mint, merchant);
    const treasuryAta = getAssociatedTokenAddressSync(
      mint,
      this.globalConfig!.treasury
    );

    return this.perqProgram.methods
      .buyDeal(timestamp)
      .accountsPartial({
        global,
        treasuryAta,
        advertiser: advertiserPartner,
        merchant: merchantPartner,
        deal,
        creditReceipt,
        mint,
        advertiserAuthority: advertiser,
        advertiserAta,
        merchantAta,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .instruction();
  }

  async redeemCreditIx(
    transferAmount: BN,
    creditDeducted: BN,
    buyer: PublicKey,
    advertiserWallet: PublicKey, // GAu
    merchantWallet: PublicKey, // 7tY
    deal: PublicKey, // J7X
    paymentMint: {
      mint: PublicKey;
      uri: string;
      symbol: string;
      decimal: number;
      tokenProgram: PublicKey;
    },
    timestamp: BN
  ): Promise<TransactionInstruction> {
    const [advertiserPartner] = this.getPartnerPDA(advertiserWallet);
    const [merchantPartner] = this.getPartnerPDA(merchantWallet);
    const [creditReceipt] = this.getCreditReceiptPDA(
      advertiserPartner,
      deal,
      timestamp
    );


    const advertiserAta = getAssociatedTokenAddressSync(
      paymentMint.mint,
      this.admin.publicKey,
      false,
      paymentMint.tokenProgram
    );
    const buyerAta = getAssociatedTokenAddressSync(
      paymentMint.mint,
      buyer,
      false,
      paymentMint.tokenProgram
    );

    return this.perqProgram.methods
      .redeemCredit(transferAmount, creditDeducted)
      .accountsPartial({
        global: new PublicKey("GxP85aQwZUFubaqdEWB3HbActEeYaVTyzcuYrFAmRUU6"),
        advertiser: advertiserPartner,
        merchant: merchantPartner, // Required for premium credits
        creditReceipt,
        mint: paymentMint.mint,
        treasuryAta: advertiserAta,
        advertiserAta,
        approvalAuthority: this.admin.publicKey,
        buyer,
        buyerAta,
        tokenProgram: paymentMint.tokenProgram,
      })
      .instruction();
  }

  updateDealIx(
    merchant: PublicKey,
    nonce: number,
    isActive: boolean,
    isPremium: boolean
  ): Promise<TransactionInstruction> {
    const [deal] = this.getDealPDA(merchant, nonce);
    try {
      return this.perqProgram.methods
        .updateDeal(isActive ?? null, isPremium ?? null)
        .accountsPartial({
          deal,
          authority: merchant,
        })
        .instruction();
    } catch (error) {
      console.error("Error updating deal:", error);
    }
    return this.perqProgram.methods
      .updateDeal(isActive ?? null, isPremium ?? null)
      .accountsPartial({
        deal,
        authority: merchant,
      })
      .instruction();
  }

  closeDealIx(
    merchant: PublicKey,
    nonce: number
  ): Promise<TransactionInstruction> {
    if (!this.globalConfig) {
      throw new Error("Global config not found");
    }

    const [global] = this.getGlobalConfigPDA();
    const [merchantPartner] = this.getPartnerPDA(merchant);
    const [deal] = this.getDealPDA(merchantPartner, nonce);

    return this.perqProgram.methods
      .closeDeal()
      .accountsPartial({
        feeReceiver: this.globalConfig.treasury,
        authority: this.admin.publicKey,
        global,
        deal,
        systemProgram: SystemProgram.programId,
      })
      .instruction();
  }

  closePartnerIx(owner: PublicKey): Promise<TransactionInstruction> {
    if (!this.globalConfig) {
      throw new Error("Global config not found");
    }

    const [global] = this.getGlobalConfigPDA();
    const [partner] = this.getPartnerPDA(owner);

    return this.perqProgram.methods
      .closePartner()
      .accountsPartial({
        global,
        feeReceiver: this.globalConfig.treasury,
        authority: this.admin.publicKey,
        partner,
        systemProgram: SystemProgram.programId,
      })
      .instruction();
  }
}
