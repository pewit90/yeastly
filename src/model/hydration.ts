import { immerable } from "immer";

export class Hydration {
  [immerable] = true;

  get water(): number {
    return this.flour * this.percentage;
  }

  constructor(
    public readonly flour: number,
    public readonly percentage: number
  ) {}
}
