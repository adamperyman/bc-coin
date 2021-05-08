import * as crypto from 'crypto';
import Transaction from './transaction';

export default class Block {
  public nonce = Math.round(Math.random() * 999999999);
  public timestamp = Date.now();

  constructor (public prevHash: string, public transaction: Transaction) {}

  get hash (): string {
    const blockString = JSON.stringify(this);
    const hash = crypto.createHash('SHA256');
    hash.update(blockString).end();

    return hash.digest('hex');
  }
}
