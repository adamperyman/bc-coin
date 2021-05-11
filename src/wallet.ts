import * as createError from 'http-errors';

import Chain from './chain';
import Transaction from './transaction';
import { TRANSACTION_SEPARATOR } from './constants';
import { CurrencyValueMap, Currencies } from './types';

import {
  getRSAKeyPair,
  getSignatureForTransaction,
  prettyPrintPem,
} from './utils';

export default class Wallet {
  private _publicKey: string;
  private _privateKey: string;
  private _currencyValues: CurrencyValueMap = {
    [Currencies.BC_COIN]: 0,
  };

  constructor (initialDeposit?: CurrencyValueMap) {
    const keyPair = getRSAKeyPair();

    this._privateKey = keyPair.privateKey;
    this._publicKey = keyPair.publicKey;

    this._currencyValues = {
      ...this._currencyValues,
      ...initialDeposit,
    };
  }

  get publicKey (): string {
    return this._publicKey;
  }

  get bcCoinValue (): number {
    return this._currencyValues[Currencies.BC_COIN];
  }

  transfer (
    amount: number,
    toPublicKey: string,
    currency: Currencies = Currencies.BC_COIN,
  ): void {
    if (!Currencies[currency]) {
      throw createError(400, 'Currency not supported.', {
        currency,
      });
    }

    if (this._currencyValues[currency] < amount) {
      throw createError(400, 'Insufficient funds.', {
        currency,
        transactionAmount: amount,
        availableFunds: this._currencyValues[currency],
      });
    }

    // Debit sender's wallet.
    this._currencyValues[currency] -= amount;

    // Generate signature from transaction, sign with sender's private key.
    const transaction = new Transaction(amount, this._publicKey, toPublicKey);
    const signature = getSignatureForTransaction(transaction, this._privateKey);

    Chain.instance.addBlock(transaction, this._publicKey, signature);

    // TODO: Credit payee wallet.
    console.log(`${prettyPrintPem(this._publicKey)}\n`);
    console.log(`👆 SENT ${amount} ${Currencies[currency]} TO 👇\n`);
    console.log(`${prettyPrintPem(toPublicKey)}\n`);
    console.log(`${TRANSACTION_SEPARATOR}`);
  }
}
