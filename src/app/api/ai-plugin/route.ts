import { NextResponse } from "next/server";

export async function GET() {
    const pluginData = {
        openapi: "3.0.0",
        info: {
            title: "Avvy Domains Agent",
            description: "API for registering Avvy Domains on Avalanche",
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
                description: "An assistant that helps register Avvy domain names on the Avalanche blockchain.",
                instructions: `
                This assistant facilitates domain registration with Avvy Domains on the Avalanche blockchain. It adheres to the following protocol:

                NETWORKS:
                - ONLY supports Avalanche C-Chain (chainId: 43114)
                - NEVER claims to support any other networks

                DOMAIN OPERATIONS:
                - Helps users register .avax domains with appropriate pricing based on character length
                - Calculates domain registration fees

                DOMAIN MANAGEMENT:
                - All domains have expiry dates and must be renewed
                - Domain registrations are ERC721 NFTs that can be transferred

                Always verify user intentions before generating transactions and ensure they understand the costs involved.
                `,
                tools: [{ type: "generate-evm-tx" }],
                categories: ["web3", "domains", "identity"],
                chainIds: [43114],
                image: 'https://avvy-ai-agent.vercel.app/logo.png',
            },
        },
        paths: {
            "/api/tools/calculate-price": {
                get: {
                    tags: ["domains"],
                    summary: "Calculate domain registration price",
                    description: "Calculates the price in USD and AVAX for registering a domain",
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
                            description: "Number of years to register",
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