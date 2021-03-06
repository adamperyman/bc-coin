import * as crypto from 'crypto';
import * as createError from 'http-errors';
import Block from './block';
import { N_SEED_COINS } from './constants';
import Transaction from './transaction';

interface MiningResult {
  ok: boolean;
  nonce: number;
}

export default class Chain {
  public static instance = new Chain();
  private _chain: Block[];

  constructor () {
    this._chain = [
      new Block(null, new Transaction(N_SEED_COINS, 'genesis', 'self')), // Genesis block.
    ];
  }

  get lastBlock (): Block {
    return this._chain[this._chain.length - 1];
  }

  get chainLength (): number {
    return this._chain.length;
  }

  mine (nonce: number): MiningResult {
    let solution = 1;
    let isMining = true;

    console.log(`⛏️\tMining nonce: ${nonce}..\n`);

    // TODO: Be smarter.
    while (isMining) {
      const hash = crypto.createHash('MD5');
      hash.update((nonce + solution).toString()).end();

      const attempt = hash.digest('hex');

      if (attempt.substr(0, 4) === '0000') {
        console.log(`🍛\tSolved: ${solution}\n`);
        isMining = false;
        break;
      }

      solution += 1;
    }

    return {
      ok: true,
      nonce,
    };
  }

  addBlock (
    transaction: Transaction,
    senderPublicKey: string,
    signature: Buffer,
  ): void {
    const verifier = crypto.createVerify('SHA256');
    verifier.update(transaction.toString());

    const isValid = verifier.verify(senderPublicKey, signature);

    if (!isValid) {
      throw createError(500, 'Failed to verify sender.', {
        transaction: transaction.toString(),
        senderPublicKey,
        signature,
      });
    }

    const newBlock = new Block(this.lastBlock.hash, transaction);

    this.mine(newBlock.nonce);
    this._chain.push(newBlock);
  }
}
