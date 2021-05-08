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
  public publicKey: string;
  private privateKey: string;

  private currencyValues: CurrencyValueMap = {
    [Currencies.BC_COIN]: 0,
  };

  get bcCoinValue (): number {
    return this.currencyValues[Currencies.BC_COIN];
  }

  constructor (initialDeposit?: CurrencyValueMap) {
    const keyPair = getRSAKeyPair();

    this.privateKey = keyPair.privateKey;
    this.publicKey = keyPair.publicKey;

    this.currencyValues = {
      ...this.currencyValues,
      ...initialDeposit,
    };
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

    if (this.currencyValues[currency] < amount) {
      throw createError(400, 'Insufficient funds.', {
        currency,
        transactionAmount: amount,
        availableFunds: this.currencyValues[currency],
      });
    }

    // Debit sender's wallet.
    this.currencyValues[currency] -= amount;

    // Generate signature from transaction, sign with sender's private key.
    const transaction = new Transaction(amount, this.publicKey, toPublicKey);
    const signature = getSignatureForTransaction(transaction, this.privateKey);

    Chain.instance.addBlock(transaction, this.publicKey, signature);

    // TODO: Credit payee wallet.
    console.log(`${prettyPrintPem(this.publicKey)}\n`);
    console.log(`👆 SENT ${amount} ${Currencies[currency]} TO 👇\n`);
    console.log(`${prettyPrintPem(toPublicKey)}\n`);
    console.log(`${TRANSACTION_SEPARATOR}`);
  }
}
