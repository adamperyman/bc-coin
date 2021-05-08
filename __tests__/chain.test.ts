import Block from '../src/block';
import Chain from '../src/chain';
import Transaction from '../src/transaction';
import { getRSAKeyPair, getSignatureForTransaction } from '../src/utils';

beforeAll(() => {
  jest.resetAllMocks();
});

describe('Chain', () => {
  describe('addBlock', () => {
    it('should verify valid sender public key with valid signature', () => {
      const keyPair = getRSAKeyPair();
      const transaction = new Transaction(null, 'adam', 'alexsmum');
      const signature = getSignatureForTransaction(
        transaction,
        keyPair.privateKey,
      );

      Chain.instance.addBlock(transaction, keyPair.publicKey, signature);

      expect(Chain.instance.chainLength).toEqual(2); // +1 to account for genesis block.
    });

    it('should not verify invalid sender public key with valid signature', () => {
      const keyPair = getRSAKeyPair();
      const transaction = new Transaction(null, 'adam', 'alexsmum');
      const signature = getSignatureForTransaction(
        transaction,
        keyPair.privateKey,
      );

      expect(() =>
        Chain.instance.addBlock(
          transaction,
          keyPair.publicKey.slice(0, -20), // Chop off the end to make it invalid.
          signature,
        ),
      ).toThrow();
    });

    it('should not verify valid sender public key with invalid signature', () => {
      const keyPair = getRSAKeyPair();
      const transaction = new Transaction(null, 'adam', 'alexsmum');

      expect(() =>
        Chain.instance.addBlock(
          transaction,
          keyPair.publicKey,
          Buffer.from('i-am-a-signature'),
        ),
      ).toThrow('Failed to verify sender.');
    });
  });

  describe('mine', () => {
    it('should return true when solution is found for a valid nonce', () => {
      jest.mock('../src/chain');

      const transaction = new Transaction(null, 'adam', 'alexsmum');
      const block = new Block('prev-hash', transaction);

      expect(Chain.instance.mine(block.nonce)).toEqual({
        ok: true,
        nonce: block.nonce,
      });
    });
  });
});
