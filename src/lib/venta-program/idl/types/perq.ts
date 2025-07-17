/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/perq.json`.
 */
export type Perq = {
  "address": "E8MkgaPy1F3Ajqs4HFV7KBYsZVt5GDwyB7rPUk7ABTba",
  "metadata": {
    "name": "perq",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "buyDeal",
      "discriminator": [
        238,
        240,
        163,
        186,
        237,
        55,
        172,
        73
      ],
      "accounts": [
        {
          "name": "global"
        },
        {
          "name": "treasuryAta",
          "writable": true
        },
        {
          "name": "advertiser",
          "writable": true
        },
        {
          "name": "merchant",
          "writable": true
        },
        {
          "name": "deal",
          "writable": true
        },
        {
          "name": "creditReceipt",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  114,
                  101,
                  99,
                  101,
                  105,
                  112,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "advertiser"
              },
              {
                "kind": "account",
                "path": "deal"
              },
              {
                "kind": "arg",
                "path": "timestamp"
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "advertiserAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "advertiserAta",
          "writable": true
        },
        {
          "name": "merchantAta",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "timestamp",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closeDeal",
      "discriminator": [
        157,
        173,
        33,
        216,
        146,
        16,
        65,
        82
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
          "name": "deal",
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
      "name": "closePartner",
      "discriminator": [
        7,
        106,
        248,
        66,
        24,
        20,
        121,
        143
      ],
      "accounts": [
        {
          "name": "global"
        },
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
          "name": "partner",
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
      "name": "createDeal",
      "discriminator": [
        198,
        212,
        144,
        151,
        97,
        56,
        149,
        113
      ],
      "accounts": [
        {
          "name": "global"
        },
        {
          "name": "deal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "arg",
                "path": "nonce"
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "authority",
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
          "name": "nonce",
          "type": "u16"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "creditFaceValue",
          "type": "u64"
        },
        {
          "name": "validityDays",
          "type": "u16"
        },
        {
          "name": "isTradable",
          "type": "bool"
        },
        {
          "name": "isPremium",
          "type": "bool"
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
          "name": "treasury",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "whitelistedTokens",
          "type": {
            "option": {
              "array": [
                "pubkey",
                1
              ]
            }
          }
        },
        {
          "name": "approvers",
          "type": {
            "option": {
              "array": [
                "pubkey",
                1
              ]
            }
          }
        },
        {
          "name": "swapFeeBps",
          "type": {
            "option": "u16"
          }
        },
        {
          "name": "purchaseFeeBps",
          "type": {
            "option": "u16"
          }
        },
        {
          "name": "txFeeBps",
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
        }
      ]
    },
    {
      "name": "initOrUpdatePartner",
      "discriminator": [
        48,
        221,
        101,
        230,
        65,
        196,
        75,
        6
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "approvalAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "global"
        },
        {
          "name": "partner",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  114,
                  116,
                  110,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "owner"
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
          "name": "approvalAuthority",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "treasury",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "role",
          "type": {
            "option": {
              "defined": {
                "name": "partnerRole"
              }
            }
          }
        },
        {
          "name": "isFrozen",
          "type": {
            "option": "bool"
          }
        }
      ]
    },
    {
      "name": "redeemCredit",
      "discriminator": [
        166,
        97,
        217,
        54,
        207,
        141,
        80,
        194
      ],
      "accounts": [
        {
          "name": "global"
        },
        {
          "name": "advertiser",
          "writable": true
        },
        {
          "name": "merchant",
          "optional": true
        },
        {
          "name": "creditReceipt",
          "writable": true
        },
        {
          "name": "mint"
        },
        {
          "name": "treasuryAta",
          "writable": true
        },
        {
          "name": "advertiserAta",
          "writable": true
        },
        {
          "name": "approvalAuthority",
          "signer": true
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
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "transferAmount",
          "type": "u64"
        },
        {
          "name": "creditDeducted",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateDeal",
      "discriminator": [
        244,
        195,
        62,
        95,
        133,
        119,
        244,
        59
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "deal",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "isActive",
          "type": {
            "option": "bool"
          }
        },
        {
          "name": "isPremium",
          "type": {
            "option": "bool"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "creditReceipt",
      "discriminator": [
        31,
        53,
        7,
        19,
        86,
        202,
        177,
        108
      ]
    },
    {
      "name": "deal",
      "discriminator": [
        125,
        223,
        160,
        234,
        71,
        162,
        182,
        219
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
      "name": "partner",
      "discriminator": [
        122,
        43,
        246,
        239,
        141,
        56,
        243,
        182
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
      "name": "invalidDeal",
      "msg": "Invalid deal account"
    },
    {
      "code": 6002,
      "name": "unauthorized",
      "msg": "unauthorized"
    },
    {
      "code": 6003,
      "name": "invalidMint",
      "msg": "Invalid mint"
    },
    {
      "code": 6004,
      "name": "invalidTokenProgram",
      "msg": "Invalid ata program owner"
    },
    {
      "code": 6005,
      "name": "overflow",
      "msg": "Overflow in calculation"
    },
    {
      "code": 6006,
      "name": "insufficientBalance",
      "msg": "Insufficient balance"
    },
    {
      "code": 6007,
      "name": "invalidActiveReceipts",
      "msg": "Active receipts must be 0"
    },
    {
      "code": 6008,
      "name": "invalidValidityInput",
      "msg": "Validity must be greater than 0"
    },
    {
      "code": 6009,
      "name": "invalidGlobalTreasury",
      "msg": "Invalid global treasury"
    },
    {
      "code": 6010,
      "name": "creditExpired",
      "msg": "credit expired"
    },
    {
      "code": 6011,
      "name": "invalidMerchantAtaOwner",
      "msg": "Invalid merchant ATA owner"
    },
    {
      "code": 6012,
      "name": "invalidAdvertiserAtaOwner",
      "msg": "Invalid advertiser ATA owner"
    },
    {
      "code": 6013,
      "name": "invalidTreasury",
      "msg": "Invalid treasury"
    },
    {
      "code": 6014,
      "name": "partnerFrozen",
      "msg": "Partner is frozen"
    },
    {
      "code": 6015,
      "name": "invalidPartnerWallet",
      "msg": "Invalid partner wallet"
    },
    {
      "code": 6016,
      "name": "activeDealsMustBeZero",
      "msg": "Active deals must be zero"
    },
    {
      "code": 6017,
      "name": "invalidTimestamp",
      "msg": "Invalid timestamp"
    },
    {
      "code": 6018,
      "name": "invalidAdvertiserRole",
      "msg": "Invalid advertiser role"
    },
    {
      "code": 6019,
      "name": "invalidAdvertiser",
      "msg": "Invalid advertiser account"
    },
    {
      "code": 6020,
      "name": "invalidMerchant",
      "msg": "Invalid merchant account"
    },
    {
      "code": 6021,
      "name": "invalidCreditReceipt",
      "msg": "Invalid credit receipt account"
    }
  ],
  "types": [
    {
      "name": "creditReceipt",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "advertiser",
            "type": "pubkey"
          },
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "deal",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "expiry",
            "type": "u64"
          },
          {
            "name": "startTime",
            "type": "u64"
          },
          {
            "name": "isPremium",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                6
              ]
            }
          }
        ]
      }
    },
    {
      "name": "deal",
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
            "name": "price",
            "type": "u64"
          },
          {
            "name": "creditFaceValue",
            "type": "u64"
          },
          {
            "name": "validityDays",
            "type": "u16"
          },
          {
            "name": "nonce",
            "type": "u16"
          },
          {
            "name": "activeReceipts",
            "type": "u16"
          },
          {
            "name": "flag",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
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
            "name": "admin",
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
                1
              ]
            }
          },
          {
            "name": "approvers",
            "type": {
              "array": [
                "pubkey",
                1
              ]
            }
          },
          {
            "name": "swapFeeBps",
            "type": "u16"
          },
          {
            "name": "purchaseFeeBps",
            "type": "u16"
          },
          {
            "name": "txFeeBps",
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
          }
        ]
      }
    },
    {
      "name": "partner",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "approvalAuthority",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "role",
            "type": {
              "defined": {
                "name": "partnerRole"
              }
            }
          },
          {
            "name": "isFrozen",
            "type": "bool"
          },
          {
            "name": "activeDeals",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "partnerRole",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "merchant"
          },
          {
            "name": "advertiser"
          },
          {
            "name": "both"
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
    }
  ]
};
