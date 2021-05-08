import Chain from './chain';
import Wallet from './wallet';
import { Currencies } from './types';
import { printBCCoinWelcomeMessage } from './utils';

export function runDemo (): void {
  printBCCoinWelcomeMessage();

  const barry = new Wallet({ [Currencies.BC_COIN]: 100 });
  const larry = new Wallet({ [Currencies.BC_COIN]: 200 });
  const harry = new Wallet({ [Currencies.BC_COIN]: 300 });

  barry.transfer(50, larry.publicKey);
  larry.transfer(23, harry.publicKey);
  harry.transfer(5, larry.publicKey);

  console.log(Chain.instance);
}

runDemo();
