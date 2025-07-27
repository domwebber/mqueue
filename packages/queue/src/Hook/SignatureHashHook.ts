import { BinaryToTextEncoding, createHash, timingSafeEqual } from "node:crypto";
import { QueueMessage } from "../QueueMessage.js";
import { Hook } from "../utils/hooks.js";
import { IncomingQueueMessageListenerInput } from "../IncomingQueue.js";

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

/**
 * Enable Digital Signatures for Queue Messages via Hooks.
 *
 * ```ts
 * const outgoingQueue = new MQueue.Outgoing(
 *   outgoingQueueAdapter,
 *   { onSend: [SignatureHashHook.outgoing()] },
 * );
 *
 * // ...
 *
 * const incomingQueue = new MQueue.Incoming(
 *   incomingQueueAdapter,
 *   { onReceipt: [SignatureHashHook.incoming()] },
 * );
 * ```
 */
export default class SignatureHashHook {
  public static DEFAULT_HEADER = "signature" as const;
  public static DEFAULT_ALGORITHM = "sha256" as const;
  public static DEFAULT_ENCODING = "base64" as const;

  protected static _hash(content: Buffer, algorithm: string) {
    return createHash(algorithm).update(content);
  }

  /**
   * Enable Digital Signatures for Outgoing Queue Messages.
   *
   * ```ts
   * const outgoingQueue = new MQueue.Outgoing(
   *   outgoingQueueAdapter,
   *   { onSend: [SignatureHashHook.outgoing()] },
   * );
   * ```
   */
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

  /**
   * Enable Digital Signatures for Incoming Queue Messages.
   *
   * ```ts
   * const incomingQueue = new MQueue.Incoming(
   *   incomingQueueAdapter,
   *   { onReceipt: [SignatureHashHook.incoming()] },
   * );
   * ```
   */
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
