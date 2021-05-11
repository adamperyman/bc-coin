import Transaction from '../src/transaction';

describe('Transaction', () => {
  it('toString returns stringified transaction', () => {
    const transaction = new Transaction(null, 'adam', 'alexsmum');

    expect(transaction.toString()).toEqual(
      '{"_amount":null,"_fromKey":"adam","_toKey":"alexsmum"}',
    );
  });
});
