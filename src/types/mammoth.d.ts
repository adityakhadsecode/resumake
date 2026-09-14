declare module "mammoth" {
  export interface ExtractRawTextOptions {
    buffer?: Buffer | ArrayBuffer;
    path?: string;
  }

  export interface ExtractResult {
    value: string;
    messages: Array<{
      type: string;
      message: string;
    }>;
  }

  export function extractRawText(options: ExtractRawTextOptions): Promise<ExtractResult>;
}
