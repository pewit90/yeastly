import { addMinutes } from "date-fns";
import { immerable } from "immer";
import { Step, StepState } from "./step";

export class Timer {
  [immerable] = true;

  static fromStep(step: Step): Timer | undefined {
    if (
      step.state !== StepState.STARTED ||
      step.startedAt === undefined ||
      step.duration === undefined
    ) {
      return undefined;
    }

    const dueAt = addMinutes(step.startedAt, step.duration);
    return new Timer(dueAt);
  }

  constructor(public readonly dueAt: Date) {}
}
