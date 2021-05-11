import * as crypto from 'crypto';
import Transaction from './transaction';

export default class Block {
  private _nonce = Math.round(Math.random() * 999999999);
  private _timestamp = Date.now();
  private _prevHash: string;
  private _transaction: Transaction;

  constructor (prevHash: string, transaction: Transaction) {
    this._prevHash = prevHash;
    this._transaction = transaction;
  }

  get nonce (): number {
    return this._nonce;
  }

  get timestamp (): number {
    return this._timestamp;
  }

  get prevHash (): string {
    return this._prevHash;
  }

  get transaction (): Transaction {
    return this._transaction;
  }

  get hash (): string {
    const blockString = JSON.stringify(this);
    const hash = crypto.createHash('SHA256');

    hash.update(blockString).end();

    return hash.digest('hex');
  }
}
