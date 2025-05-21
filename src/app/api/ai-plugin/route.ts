import { NextResponse } from "next/server";

export async function GET() {
    const pluginData = {
        openapi: "3.0.0",
        info: {
            title: "Avvy Domains Agent",
            description: "API for interactions with Avvy Domains on Avalanche",
            version: "1.0.0",
        },
        servers: [
            {
                url: 'https://avvy-ai-agent.vercel.app',
            },
        ],
        "x-mb": {
            "account-id": 'rubenmarcus.avax',
            assistant: {
                name: "Avvy Domains Agent",
                description: "An assistant that helps manage Avvy domain names on the Avalanche blockchain, including registration, renewal, transfers, and auction participation.",
                instructions: `
                This assistant facilitates interactions with Avvy Domains on the Avalanche blockchain. It adheres to the following protocol:

                NETWORKS:
                - ONLY supports Avalanche C-Chain (chainId: 43114)
                - NEVER claims to support any other networks

                DOMAIN OPERATIONS:
                - Helps users register .avax domains with appropriate pricing based on character length
                - Assists with domain renewals to prevent expiration
                - Provides information about transferring domains as NFTs
                - Calculates domain registration and renewal fees

                PRICING RULES:
                - 5+ characters: $5 USD / year
                - 4 characters: $160 USD / year
                - 3 characters: $640 USD / year
                - Fees are paid in AVAX using Chainlink's price feed

                DOMAIN MANAGEMENT:
                - All domains have expiry dates and must be renewed
                - Domain registrations are ERC721 NFTs that can be transferred

                Always verify user intentions before generating transactions and ensure they understand the costs involved and domain lifecycle.
                `,
                tools: [{ type: "generate-evm-tx" }],
                categories: ["web3", "domains", "identity"],
                chainIds: [43114],
                image: 'https://avvy-ai-agent.vercel.app/logo.png',
            },
        },
        paths: {
            "/api/tools/get-domain-info": {
                get: {
                    tags: ["domains"],
                    summary: "Get information about a domain",
                    description: "Returns details about a specified .avax domain including ownership, expiry, and records",
                    operationId: "get-domain-info",
                    parameters: [
                        {
                            name: "domainName",
                            in: "query",
                            description: "The .avax domain name to check (without .avax extension)",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            example: "avvydomains"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Domain information",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            domainName: {
                                                type: "string",
                                                description: "The domain name with .avax extension",
                                                example: "avvydomains.avax"
                                            },
                                            available: {
                                                type: "boolean",
                                                description: "Whether the domain is available to register",
                                                example: false
                                            },
                                            expiryDate: {
                                                type: "string",
                                                description: "The date when the domain expires",
                                                example: "2025-01-01T00:00:00Z"
                                            },
                                            owner: {
                                                type: "string",
                                                description: "The owner's address if registered",
                                                example: "0x1234567890123456789012345678901234567890"
                                            },
                                            records: {
                                                type: "object",
                                                description: "Domain records like EVM address, avatar, etc.",
                                                additionalProperties: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/calculate-price": {
                get: {
                    tags: ["domains"],
                    summary: "Calculate domain registration or renewal price",
                    description: "Calculates the price in USD and AVAX for registering or renewing a domain",
                    operationId: "calculate-price",
                    parameters: [
                        {
                            name: "domainName",
                            in: "query",
                            description: "The domain name without .avax extension",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            example: "mydomain"
                        },
                        {
                            name: "years",
                            in: "query",
                            description: "Number of years to register/renew",
                            required: true,
                            schema: {
                                type: "number",
                                minimum: 1
                            },
                            example: 1
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Price calculation",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            domainName: {
                                                type: "string",
                                                description: "The domain name with .avax extension",
                                                example: "mydomain.avax"
                                            },
                                            priceUSD: {
                                                type: "number",
                                                description: "Price in USD",
                                                example: 5
                                            },
                                            priceAVAX: {
                                                type: "string",
                                                description: "Approximate price in AVAX based on current rate",
                                                example: "0.25"
                                            },
                                            years: {
                                                type: "number",
                                                description: "Number of years",
                                                example: 1
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/create-registration-tx": {
                get: {
                    tags: ["domains"],
                    summary: "Create domain registration transaction",
                    description: "Generates a transaction to register a domain",
                    operationId: "create-registration-tx",
                    parameters: [
                        {
                            name: "domainName",
                            in: "query",
                            description: "The domain name without .avax extension",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            example: "mydomain"
                        },
                        {
                            name: "years",
                            in: "query",
                            description: "Number of years to register",
                            required: true,
                            schema: {
                                type: "number",
                                minimum: 1
                            },
                            example: 1
                        },
                        {
                            name: "enhancedPrivacy",
                            in: "query",
                            description: "Whether to enable enhanced privacy features",
                            schema: {
                                type: "boolean"
                            },
                            example: false
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Registration transaction",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transaction: {
                                                type: "object",
                                                properties: {
                                                    to: {
                                                        type: "string",
                                                        description: "Contract address",
                                                        example: "0x5BBD3a8E215B1fC30595fd1Aba4F3FcDbB614078"
                                                    },
                                                    data: {
                                                        type: "string",
                                                        description: "Transaction calldata"
                                                    },
                                                    value: {
                                                        type: "string",
                                                        description: "Transaction value in wei"
                                                    }
                                                }
                                            },
                                            meta: {
                                                type: "object",
                                                properties: {
                                                    domainName: {
                                                        type: "string",
                                                        example: "mydomain.avax"
                                                    },
                                                    priceUSD: {
                                                        type: "number",
                                                        example: 5
                                                    },
                                                    expiryDate: {
                                                        type: "string",
                                                        example: "2025-01-01T00:00:00Z"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/create-renewal-tx": {
                get: {
                    tags: ["domains"],
                    summary: "Create domain renewal transaction",
                    description: "Generates a transaction to renew a domain",
                    operationId: "create-renewal-tx",
                    parameters: [
                        {
                            name: "domainName",
                            in: "query",
                            description: "The domain name without .avax extension",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            example: "mydomain"
                        },
                        {
                            name: "years",
                            in: "query",
                            description: "Number of years to renew",
                            required: true,
                            schema: {
                                type: "number",
                                minimum: 1
                            },
                            example: 1
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Renewal transaction",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transaction: {
                                                type: "object",
                                                properties: {
                                                    to: {
                                                        type: "string",
                                                        description: "Contract address",
                                                        example: "0x5BBD3a8E215B1fC30595fd1Aba4F3FcDbB614078"
                                                    },
                                                    data: {
                                                        type: "string",
                                                        description: "Transaction calldata"
                                                    },
                                                    value: {
                                                        type: "string",
                                                        description: "Transaction value in wei"
                                                    }
                                                }
                                            },
                                            meta: {
                                                type: "object",
                                                properties: {
                                                    domainName: {
                                                        type: "string",
                                                        example: "mydomain.avax"
                                                    },
                                                    priceUSD: {
                                                        type: "number",
                                                        example: 5
                                                    },
                                                    newExpiryDate: {
                                                        type: "string",
                                                        example: "2026-01-01T00:00:00Z"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/create-transfer-tx": {
                get: {
                    tags: ["domains"],
                    summary: "Create domain transfer transaction",
                    description: "Generates a transaction to transfer a domain as an NFT",
                    operationId: "create-transfer-tx",
                    parameters: [
                        {
                            name: "domainName",
                            in: "query",
                            description: "The domain name without .avax extension",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            example: "mydomain"
                        },
                        {
                            name: "recipient",
                            in: "query",
                            description: "The recipient address",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            example: "0x1234567890123456789012345678901234567890"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Transfer transaction",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transaction: {
                                                type: "object",
                                                properties: {
                                                    to: {
                                                        type: "string",
                                                        description: "Contract address",
                                                        example: "0x5BBD3a8E215B1fC30595fd1Aba4F3FcDbB614078"
                                                    },
                                                    data: {
                                                        type: "string",
                                                        description: "Transaction calldata"
                                                    },
                                                    value: {
                                                        type: "string",
                                                        description: "Transaction value in wei",
                                                        example: "0"
                                                    }
                                                }
                                            },
                                            meta: {
                                                type: "object",
                                                properties: {
                                                    domainName: {
                                                        type: "string",
                                                        example: "mydomain.avax"
                                                    },
                                                    recipient: {
                                                        type: "string",
                                                        example: "0x1234567890123456789012345678901234567890"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/resolve-domain": {
                get: {
                    tags: ["resolution"],
                    summary: "Resolve a domain to an address or record",
                    description: "Resolves a domain name to its associated address or other record",
                    operationId: "resolve-domain",
                    parameters: [
                        {
                            name: "domainName",
                            in: "query",
                            description: "The domain name with or without .avax extension",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            example: "avvydomains.avax"
                        },
                        {
                            name: "recordType",
                            in: "query",
                            description: "The type of record to resolve (default: EVM)",
                            schema: {
                                type: "string",
                                enum: ["EVM", "BTC", "VALIDATOR", "CONTENT", "AVATAR", "CUSTOM"]
                            },
                            example: "EVM"
                        },
                        {
                            name: "customKey",
                            in: "query",
                            description: "Custom record key (only used when recordType is CUSTOM)",
                            schema: {
                                type: "string"
                            }
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Resolution result",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            domainName: {
                                                type: "string",
                                                description: "The domain with .avax extension",
                                                example: "avvydomains.avax"
                                            },
                                            recordType: {
                                                type: "string",
                                                description: "The type of record resolved",
                                                example: "EVM"
                                            },
                                            value: {
                                                type: "string",
                                                description: "The resolved value",
                                                example: "0x1234567890123456789012345678901234567890"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "404": {
                            description: "Domain or record not found",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        components: {
            parameters: {
                chainId: {
                    name: "chainId",
                    in: "query",
                    description: "EVM Network chain ID (only Avalanche 43114 is supported)",
                    required: true,
                    schema: {
                        type: "number",
                        enum: [43114]
                    },
                    example: 43114
                }
            },
            schemas: {
                Address: {
                    description: "20 byte Ethereum address encoded as a hex with `0x` prefix",
                    type: "string",
                    example: "0x1234567890123456789012345678901234567890"
                }
            }
        }
    };

    return NextResponse.json(pluginData);
}