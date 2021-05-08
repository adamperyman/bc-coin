import Block from '../src/block';
import Transaction from '../src/transaction';

jest.mock('crypto', () => ({
  createHash: jest.fn().mockReturnValue({
    digest: jest.fn().mockReturnValue('i-am-a-hash'),
    update: jest.fn().mockReturnValue({
      end: jest.fn(),
    }),
  }),
}));

beforeAll(() => {
  jest.clearAllMocks();
});

describe('Block', () => {
  it('hash returns the hash of a Block', () => {
    const transaction = new Transaction(null, 'adam', 'alexsmum');
    const block = new Block('prev-hash', transaction);

    expect(block.hash).toEqual('i-am-a-hash');
  });
});
