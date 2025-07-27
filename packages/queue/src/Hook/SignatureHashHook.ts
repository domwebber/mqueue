import { BinaryToTextEncoding, createHash, timingSafeEqual } from "node:crypto";
import { IncomingQueueMessageListenerInput } from "../Adapter/IncomingQueueAdapter.js";
import { QueueMessage } from "../QueueMessage.js";
import { Hook } from "../utils/hooks.js";

export interface SignatureHashHookOptions {
  header?: string;
  algorithm?: string;
  encoding?: BinaryToTextEncoding;
}

export interface IncomingSignatureHashHookOptions
  extends SignatureHashHookOptions {
  throwOnMissing?: boolean;
  throwOnInvalid?: boolean;
}

export default class SignatureHashHook {
  public static DEFAULT_HEADER = "signature" as const;
  public static DEFAULT_ALGORITHM = "sha256" as const;
  public static DEFAULT_ENCODING = "base64" as const;

  protected static _hash(content: Buffer, algorithm: string) {
    return createHash(algorithm).update(content);
  }

  public static outgoing({
    header = this.DEFAULT_HEADER,
    algorithm = this.DEFAULT_ALGORITHM,
    encoding = this.DEFAULT_ENCODING,
  }: SignatureHashHookOptions = {}): Hook<QueueMessage> {
    return (input) => {
      input.headers[header] = this._hash(input.body, algorithm).digest(
        encoding,
      );
      return input;
    };
  }

  public static incoming({
    header = this.DEFAULT_HEADER,
    algorithm = this.DEFAULT_ALGORITHM,
    encoding = this.DEFAULT_ENCODING,
    throwOnMissing = true,
    throwOnInvalid = true,
  }: IncomingSignatureHashHookOptions = {}): Hook<IncomingQueueMessageListenerInput> {
    return (input) => {
      const signatureHeader = input.message.headers[header];

      if (typeof signatureHeader !== "string") {
        if (!throwOnMissing) return input;
        throw new Error("Received Queue Message with No Signature Header");
      }

      const calculatedHash = this._hash(input.message.body, algorithm).digest();
      const receivedHash = Buffer.from(signatureHeader, encoding);

      if (
        calculatedHash.length !== receivedHash.length ||
        timingSafeEqual(receivedHash, calculatedHash)
      ) {
        if (!throwOnInvalid) return input;
        throw new Error("Received Queue Message with Invalid Signature Header");
      }

      return input;
    };
  }
}
