export default class Transaction {
  private _amount: number;
  private _fromKey: string;
  private _toKey: string;

  constructor (amount: number, fromKey: string, toKey: string) {
    this._amount = amount;
    this._fromKey = fromKey;
    this._toKey = toKey;
  }

  public toString (): string {
    return JSON.stringify(this);
  }
}
