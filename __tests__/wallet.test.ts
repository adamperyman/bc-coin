import Wallet from '../src/wallet';
import { Currencies } from '../src/types';

beforeAll(() => {
  jest.clearAllMocks();
});

describe('Wallet', () => {
  describe('transfer', () => {
    it('should throw when currency not supported', () => {
      const wallet = new Wallet();

      // @ts-ignore: testing invalid currency.
      expect(() => wallet.transfer(420, 'to-pub-key', 'fake-currency')).toThrow(
        'Currency not supported.',
      );
    });

    it('should throw when wallet has insufficient funds', () => {
      const wallet = new Wallet();

      expect(() => wallet.transfer(420, 'to-pub-key')).toThrow(
        'Insufficient funds.',
      );
    });

    it('should remove funds from wallet when transaction is successful', () => {
      const wallet = new Wallet({ [Currencies.BC_COIN]: 1000 });

      wallet.transfer(420, 'to-pub-key');

      expect(wallet.bcCoinValue).toEqual(580);
    });

    it('should correctly set initial deposit', () => {
      const wallet = new Wallet({ [Currencies.BC_COIN]: 1000 });

      expect(wallet.bcCoinValue).toEqual(1000);
    });
  });
});
