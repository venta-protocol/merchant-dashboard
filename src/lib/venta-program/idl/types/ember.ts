/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/ember.json`.
 */
export type Ember = {
  "address": "FBMakVDotigJotn7fZVEzWuCmyZXHzefVibZaKJ4L1BD",
  "metadata": {
    "name": "ember",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "closeCustomer",
      "discriminator": [
        245,
        28,
        17,
        116,
        225,
        235,
        169,
        151
      ],
      "accounts": [
        {
          "name": "feeReceiver",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "global"
        },
        {
          "name": "merchant",
          "writable": true
        },
        {
          "name": "customer",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "closeMerchant",
      "discriminator": [
        138,
        96,
        102,
        11,
        220,
        136,
        154,
        11
      ],
      "accounts": [
        {
          "name": "feeReceiver",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "global"
        },
        {
          "name": "merchant",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initCustomer",
      "discriminator": [
        134,
        21,
        29,
        69,
        93,
        254,
        79,
        9
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "merchant"
        },
        {
          "name": "customer",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  109,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "account",
                "path": "merchant"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initMerchant",
      "discriminator": [
        209,
        11,
        214,
        195,
        222,
        157,
        124,
        192
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "merchant",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  114,
                  99,
                  104,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "seed"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "seed",
          "type": "pubkey"
        },
        {
          "name": "rewardExpiryDurationDays",
          "type": "u16"
        },
        {
          "name": "volumeRollingDurationDays",
          "type": "u16"
        },
        {
          "name": "tiers",
          "type": {
            "vec": {
              "defined": {
                "name": "tier"
              }
            }
          }
        }
      ]
    },
    {
      "name": "initOrUpdateGlobal",
      "discriminator": [
        38,
        171,
        50,
        229,
        111,
        141,
        84,
        172
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "global",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "mainAuthority",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "managerAuthority",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "state",
          "type": {
            "option": {
              "defined": {
                "name": "state"
              }
            }
          }
        },
        {
          "name": "treasury",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "globalFeeBps",
          "type": {
            "option": "u16"
          }
        },
        {
          "name": "whitelistedTokens",
          "type": {
            "option": {
              "array": [
                "pubkey",
                10
              ]
            }
          }
        }
      ]
    },
    {
      "name": "makePayment",
      "discriminator": [
        19,
        128,
        153,
        121,
        221,
        192,
        91,
        53
      ],
      "accounts": [
        {
          "name": "global"
        },
        {
          "name": "merchant",
          "writable": true
        },
        {
          "name": "customer",
          "writable": true
        },
        {
          "name": "mint"
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "buyerAta",
          "writable": true
        },
        {
          "name": "shopWalletAta",
          "writable": true
        },
        {
          "name": "treasuryAta",
          "writable": true
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "addtionalFee",
          "type": {
            "option": "u64"
          }
        }
      ]
    },
    {
      "name": "updateCustomer",
      "discriminator": [
        158,
        118,
        103,
        177,
        241,
        229,
        169,
        124
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "merchant",
          "writable": true
        },
        {
          "name": "customer",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "totalVolume",
          "type": {
            "option": "u32"
          }
        },
        {
          "name": "pendingReward",
          "type": {
            "option": "u32"
          }
        },
        {
          "name": "volumeEpochDay",
          "type": {
            "option": "u16"
          }
        },
        {
          "name": "blacklistStatus",
          "type": {
            "option": "bool"
          }
        }
      ]
    },
    {
      "name": "updateMerchant",
      "discriminator": [
        192,
        114,
        143,
        220,
        199,
        50,
        234,
        165
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "merchant",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "authority",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "rewardExpiryDurationDays",
          "type": {
            "option": "u16"
          }
        },
        {
          "name": "volumeRollingDurationDays",
          "type": {
            "option": "u16"
          }
        },
        {
          "name": "state",
          "type": {
            "option": {
              "defined": {
                "name": "state"
              }
            }
          }
        },
        {
          "name": "tiers",
          "type": {
            "option": {
              "vec": {
                "defined": {
                  "name": "tier"
                }
              }
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "customer",
      "discriminator": [
        112,
        147,
        140,
        31,
        93,
        186,
        103,
        18
      ]
    },
    {
      "name": "global",
      "discriminator": [
        167,
        232,
        232,
        177,
        200,
        108,
        114,
        127
      ]
    },
    {
      "name": "merchant",
      "discriminator": [
        71,
        235,
        30,
        40,
        231,
        21,
        32,
        64
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidGlobal",
      "msg": "Invalid global account"
    },
    {
      "code": 6001,
      "name": "invalidMerchant",
      "msg": "Invalid merchant account"
    },
    {
      "code": 6002,
      "name": "invalidCustomer",
      "msg": "Invalid customer"
    },
    {
      "code": 6003,
      "name": "invalidMerchantAuthority",
      "msg": "Invalid merchant authority"
    },
    {
      "code": 6004,
      "name": "claimableNotZero",
      "msg": "Claim all amount before closing merchant"
    },
    {
      "code": 6005,
      "name": "customerNotZero",
      "msg": "Close all customer before closing merchant"
    },
    {
      "code": 6006,
      "name": "tierNotFound",
      "msg": "Tier not found"
    },
    {
      "code": 6007,
      "name": "customerBlacklisted",
      "msg": "Customer is blacklisted"
    },
    {
      "code": 6008,
      "name": "unauthorized",
      "msg": "unauthorized"
    },
    {
      "code": 6009,
      "name": "invalidMint",
      "msg": "Invalid mint"
    },
    {
      "code": 6010,
      "name": "frozenMerchantAccount",
      "msg": "Frozen merchant account"
    },
    {
      "code": 6011,
      "name": "overflow",
      "msg": "Overflow in calculation"
    },
    {
      "code": 6012,
      "name": "insufficientBalance",
      "msg": "Insufficient balance"
    },
    {
      "code": 6013,
      "name": "invalidAmountInput",
      "msg": "Amount must be greater than 0"
    },
    {
      "code": 6014,
      "name": "invalidDiscriminator",
      "msg": "Invalid discriminator input"
    },
    {
      "code": 6015,
      "name": "protocolHalted",
      "msg": "Protocal is halted"
    },
    {
      "code": 6016,
      "name": "illegalMerchantUpdate",
      "msg": "Merchant must not be frozen for Wallet or 2FA update"
    },
    {
      "code": 6017,
      "name": "invalidTierCount",
      "msg": "Tier count must not exceed 10"
    },
    {
      "code": 6018,
      "name": "exceedU16Limit",
      "msg": "Exceed u16 limit"
    },
    {
      "code": 6019,
      "name": "exceedU32Limit",
      "msg": "Exceed u32 limit"
    },
    {
      "code": 6020,
      "name": "invalidRemainingAccounts",
      "msg": "Invalid remaining accounts"
    },
    {
      "code": 6021,
      "name": "unauthorizedCaller",
      "msg": "Unauthorized caller"
    },
    {
      "code": 6022,
      "name": "invalidArguments",
      "msg": "Invalid arguments"
    },
    {
      "code": 6023,
      "name": "invalidBalanceSheet",
      "msg": "Invalid balance sheet"
    },
    {
      "code": 6024,
      "name": "invalidMerchantProgramOwner",
      "msg": "Invalid merchant program owner"
    },
    {
      "code": 6025,
      "name": "invalidGlobalTreasury",
      "msg": "Invalid global treasury"
    },
    {
      "code": 6026,
      "name": "invalidRewardMint",
      "msg": "Invalid reward mint"
    },
    {
      "code": 6027,
      "name": "invalidTokenOwner",
      "msg": "Invalid token owner"
    },
    {
      "code": 6028,
      "name": "invalidSysvar",
      "msg": "Invalid sysvar"
    },
    {
      "code": 6029,
      "name": "invalidShopWallet",
      "msg": "Invalid shop wallet"
    },
    {
      "code": 6030,
      "name": "invalidGlobalState",
      "msg": "Invalid global state"
    },
    {
      "code": 6031,
      "name": "invalidMerchantState",
      "msg": "Invalid merchant state"
    },
    {
      "code": 6032,
      "name": "invalidCustomerState",
      "msg": "Invalid customer state"
    },
    {
      "code": 6033,
      "name": "invalidTreasury",
      "msg": "Invalid treasury"
    }
  ],
  "types": [
    {
      "name": "customer",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "totalVolumeCents",
            "type": "u32"
          },
          {
            "name": "pendingRewardCents",
            "type": "u32"
          },
          {
            "name": "volumeEpochDay",
            "type": "u16"
          },
          {
            "name": "rewardEpochDay",
            "type": "u16"
          },
          {
            "name": "blacklisted",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "reserved",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          }
        ]
      }
    },
    {
      "name": "global",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mainAuthority",
            "type": "pubkey"
          },
          {
            "name": "managerAuthority",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "whitelistedTokens",
            "type": {
              "array": [
                "pubkey",
                10
              ]
            }
          },
          {
            "name": "globalFeeBps",
            "type": "u16"
          },
          {
            "name": "state",
            "type": {
              "defined": {
                "name": "state"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                3
              ]
            }
          },
          {
            "name": "reserved",
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          }
        ]
      }
    },
    {
      "name": "merchant",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "seed",
            "type": "pubkey"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "pendingReward",
            "type": "u64"
          },
          {
            "name": "initializeDate",
            "type": "u64"
          },
          {
            "name": "tiers",
            "type": {
              "array": [
                {
                  "defined": {
                    "name": "tier"
                  }
                },
                10
              ]
            }
          },
          {
            "name": "rewardExpiryDurationDays",
            "type": "u16"
          },
          {
            "name": "volumeRollingDurationDays",
            "type": "u16"
          },
          {
            "name": "state",
            "type": {
              "defined": {
                "name": "state"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "reserved",
            "type": {
              "array": [
                "u8",
                128
              ]
            }
          }
        ]
      }
    },
    {
      "name": "state",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "normal"
          },
          {
            "name": "halt"
          }
        ]
      }
    },
    {
      "name": "tier",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "volumeRequirementCent",
            "type": "u32"
          },
          {
            "name": "totalRewardBps",
            "type": "u16"
          },
          {
            "name": "reserved",
            "type": {
              "array": [
                "u8",
                2
              ]
            }
          }
        ]
      }
    }
  ]
};
