export default class Transaction {
  constructor (
    public amount: number,
    public fromKey: string,
    public toKey: string,
  ) {}

  toString (): string {
    return JSON.stringify(this);
  }
}
