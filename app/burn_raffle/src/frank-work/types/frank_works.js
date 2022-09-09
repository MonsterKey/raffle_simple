"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDL = void 0;
exports.IDL = {
    "version": "0.1.0",
    "name": "raffle_simple",
    "instructions": [
        {
            "name": "initRaffle",
            "accounts": [
                {
                    "name": "raffle",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "creator",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "endTimestamp",
                    "type": "i64"
                },
                {
                    "name": "ticketPrice",
                    "type": "u64"
                },
                {
                    "name": "maxEntrants",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "updateRaffle",
            "accounts": [
                {
                    "name": "raffle",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": false,
                    "isSigner": true
                }
            ],
            "args": [
                {
                    "name": "endTimestamp",
                    "type": "i64"
                },
                {
                    "name": "ticketPrice",
                    "type": "u64"
                },
                {
                    "name": "maxEntrants",
                    "type": "u64"
                },
                {
                    "name": "sold",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "readRaffle",
            "accounts": [
                {
                    "name": "raffle",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "burnToken",
            "accounts": [
                {
                    "name": "raffle",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "mint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "Raffle",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "endTimestamp",
                        "type": "i64"
                    },
                    {
                        "name": "ticketPrice",
                        "type": "u64"
                    },
                    {
                        "name": "totalSupply",
                        "type": "u64"
                    },
                    {
                        "name": "sold",
                        "type": "u64"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "MaxEntrantsTooLarge",
            "msg": "Max entrants is too large"
        },
        {
            "code": 6001,
            "name": "RaffleEnded",
            "msg": "Raffle has ended"
        },
        {
            "code": 6002,
            "name": "MaxSoldTooLarge",
            "msg": "Max sold is too large"
        }
    ]
};
