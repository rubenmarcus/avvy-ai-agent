# Avvy Domains AI Agent



## API Reference

### Resolve Domain
Resolves an Avalanche domain name to its associated records.

**Endpoint:** `/api/tools/resolve-domain`

**Method:** GET

**Parameters:**
- `domainName` (required): The domain name to resolve (with or without .avax extension)
- `recordType` (optional): Type of record to resolve (default: 'EVM')
- `customKey` (optional): Custom record key when recordType is 'CUSTOM'

**Response:**
```json
{
  "domainName": "example.avax",
  "recordType": "EVM",
  "value": "0x1234567890123456789012345678901234567890"
}
```

**Prompt Examples:**
1. "What is the EVM address associated with satoshi.avax?"
2. "Find the avatar record for vitalik.avax domain"
3. "Resolve the custom Twitter handle record for sergey.avax"

### Calculate Price
Calculates the price for registering or renewing an Avalanche domain name.

**Endpoint:** `/api/tools/calculate-price`

**Method:** GET

**Parameters:**
- `domainName` (required): The domain name without .avax extension
- `years` (required): Number of years for registration/renewal

**Response:**
```json
{
  "domainName": "example.avax",
  "priceUSD": 25,
  "priceAVAX": "1.2500",
  "years": 5
}
```

**Prompt Examples:**
1. "How much does it cost to register crypto.avax for 3 years?"
2. "Calculate the price of a 4-character Avalanche domain for 2 years"
3. "What would I pay in AVAX to register blockchain.avax for 1 year?"

### Get Domain Info
Retrieves information about an Avalanche domain, including availability, expiry, and owner.

**Endpoint:** `/api/tools/get-domain-info`

**Method:** GET

**Parameters:**
- `domainName` (required): The domain name without .avax extension

**Response:**
```json
{
  "domainName": "example.avax",
  "available": false,
  "expiryDate": "2025-01-01T00:00:00Z",
  "owner": "0x1234567890123456789012345678901234567890",
  "records": {
    "EVM": "0x1234567890123456789012345678901234567890",
    "AVATAR": "https://example.com/avatar.png"
  }
}
```

**Prompt Examples:**
1. "Is avalanche.avax domain available for registration?"
2. "When does my defi.avax domain expire?"
3. "Who owns the blockchain.avax domain name?"

### Create Renewal Transaction
Creates a transaction to renew an existing Avalanche domain.

**Endpoint:** `/api/tools/create-renewal-tx`

**Method:** GET

**Parameters:**
- `domainName` (required): The domain name without .avax extension
- `years` (required): Number of years to renew

**Response:**
```json
{
  "transaction": {
    "chainId": 43114,
    "metaTransactions": [{
      "to": "0x5BBD3a8E215B1fC30595fd1Aba4F3FcDbB614078",
      "data": "0x...",
      "value": "1250000000000000000"
    }]
  },
  "meta": {
    "domainName": "example.avax",
    "priceUSD": 25,
    "avaxPrice": 20,
    "priceAVAX": "1.2500",
    "newExpiryDate": "2026-01-01T00:00:00Z"
  }
}
```

**Prompt Examples:**
1. "Create a transaction to renew my crypto.avax domain for 2 more years"
2. "I need to extend my avalanche.avax domain registration by 1 year"
3. "Generate a renewal transaction for my defi.avax domain for 5 years"

### Create Registration Transaction
Creates a transaction to register a new Avalanche domain.

**Endpoint:** `/api/tools/create-registration-tx`

**Method:** GET

**Parameters:**
- `domainName` (required): The domain name without .avax extension
- `years` (required): Number of years for registration
- `enhancedPrivacy` (optional): Enable enhanced privacy protection (true/false)

**Response:**
```json
{
  "transaction": {
    "chainId": 43114,
    "metaTransactions": [{
      "to": "0x5BBD3a8E215B1fC30595fd1Aba4F3FcDbB614078",
      "data": "0x...",
      "value": "1250000000000000000"
    }]
  },
  "meta": {
    "domainName": "example.avax",
    "priceUSD": 25,
    "priceAVAX": "1.2500",
    "currentAvaxPriceUSD": 20,
    "expiryDate": "2024-01-01T00:00:00Z",
    "enhancedPrivacy": false
  }
}
```

**Prompt Examples:**
1. "I want to register avalanche.avax for 3 years, create a transaction for me"
2. "Generate a transaction to buy crypto.avax domain with enhanced privacy for 1 year"
3. "Help me register a 5-character domain for 2 years on Avalanche"

## AI Agent Configuration

The template includes a pre-configured AI agent manifest at `/.well-known/ai-plugin.json`. You can customize the agent's behavior by modifying the configuration in `/api/ai-plugins/route.ts`. This route generates and returns the manifest object.

## Deployment

1. Push your code to GitHub
2. Deploy to Vercel or your preferred hosting platform
3. Add your `BITTE_API_KEY` to the environment variables
4. The `make-agent deploy` command will automatically run during build

## Making your own agent

Whether you want to add a tool to this boilerplate or make your own standalone agent tool, here's you'll need:

1. Make sure [`make-agent`](https://github.com/BitteProtocol/make-agent) is installed in your project:

```bash
pnpm install --D make-agent
```

2. Set up a manifest following the OpenAPI specification that describes your agent and its paths.
3. Have an api endpoint with the path `GET /api/ai-plugin` that returns your manifest

## Setting up the manifest

Follow the [OpenAPI Specification](https://swagger.io/specification/#schema-1) to add the following fields in the manifest object:

- `openapi`: The OpenAPI specification version that your manifest is following. Usually this is the latest version.
- `info`: Object containing information about the agent, namely its 'title', 'description' and 'version'.
- `servers`: Array of objects containing the urls for the deployed instances of the agent.
- `paths`: Object containing all your agent's paths and their operations.
- `"x-mb"`: Our custom field, containing the account id of the owner and an 'assistant' object with the agent's metadata, namely the tools it uses, and additional instructions to guide it.

## Learn More

- [Bitte Protocol Documentation](https://docs.bitte.ai)
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAPI Specification](https://swagger.io/specification/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
