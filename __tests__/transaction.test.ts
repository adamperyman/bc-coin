import Transaction from '../src/transaction';

describe('Transaction', () => {
  it('toString returns stringified transaction', () => {
    const transaction = new Transaction(null, 'adam', 'alexsmum');

    expect(transaction.toString()).toEqual(
      '{"amount":null,"fromKey":"adam","toKey":"alexsmum"}',
    );
  });
});
