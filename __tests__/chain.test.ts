import Block from '../src/block';
import Chain from '../src/chain';
import Transaction from '../src/transaction';
import { getRSAKeyPair, getSignatureForTransaction } from '../src/utils';

beforeAll(() => {
  jest.resetAllMocks();
});

describe('Chain', () => {
  describe('mine', () => {
    it('should return successful when solution is found for a valid nonce', () => {
      jest.mock('../src/chain');

      const transaction = new Transaction(null, 'adam', 'alexsmum');
      const block = new Block('prev-hash', transaction);

      expect(Chain.instance.mine(block.nonce)).toEqual({
        ok: true,
        nonce: block.nonce,
      });
    });
  });

  describe('addBlock', () => {
    it('should succeed with valid sender public key and valid signature', () => {
      const keyPair = getRSAKeyPair();
      const transaction = new Transaction(null, 'adam', 'alexsmum');
      const signature = getSignatureForTransaction(
        transaction,
        keyPair.privateKey,
      );

      Chain.instance.addBlock(transaction, keyPair.publicKey, signature);

      expect(Chain.instance.chainLength).toEqual(2); // +1 to account for genesis block.
    });

    it('should not succeed with invalid sender public key and valid signature', () => {
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

    it('should not succeed with valid sender public key and invalid signature', () => {
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
});
