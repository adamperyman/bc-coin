import { printBCCoinWelcomeMessage } from '../src/utils';

describe('Utils', () => {
  describe('printBCCoinWelcomeMessage', () => {
    it('should print expected number of lines', () => {
      const spy = jest.spyOn(console, 'log');

      printBCCoinWelcomeMessage();

      expect(spy).toHaveBeenCalledTimes(5);
    });
  });
});
