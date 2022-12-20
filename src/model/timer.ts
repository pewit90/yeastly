import { immerable } from "immer";

export class Timer {
  [immerable] = true;

  constructor(
    public readonly breadUUID: number,
    private readonly dueAt: Date
  ) {}
}
