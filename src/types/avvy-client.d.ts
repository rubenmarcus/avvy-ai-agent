declare module '@avvy/client' {
  export class Client {
    constructor(provider: import('viem').PublicClient);
    utils: {
      nameHash(name: string): Promise<string>;
    };
    constants: {
      RECORDS: {
        EVM: string;
        BTC: string;
        CONTENT: string;
        AVATAR: string;
      };
    };
    getResolver(hash: string): Promise<{ address: string } | null>;
    getRegistry(): Promise<{ owner(hash: string): Promise<string> }>;
    getRegistrar(): Promise<{ nameExpires(hash: string): Promise<bigint | { toNumber(): number }> }>;
    resolve(name: string, recordType: string): Promise<string>;
  }
}