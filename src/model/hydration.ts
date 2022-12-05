import { immerable } from "immer";

export class Hydration {
  [immerable] = true;

  get water(): number {
    return this.flour * (this.waterPercentage / 100);
  }

  get salt(): number {
    return this.flour * (this.saltPercentage / 100);
  }

  constructor(
    public readonly flour: number,
    public readonly waterPercentage: number,
    public readonly saltPercentage: number
  ) {}
}
