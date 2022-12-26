import { addMinutes, intervalToDuration } from "date-fns";
import { immerable } from "immer";
import {
  minutesToDuration,
  toBoolean,
  toDateOrUndefined,
  toNumberOrUndefined,
} from "../utils/conversion-utils";
import { Timer } from "./timer";

export enum StepState {
  PENDING = "PENDING",
  STARTED = "STARTED",
  COMPLETED = "COMPLETED",
}

export class Step {
  [immerable] = true;

  private get started(): boolean {
    return this.startedAt !== undefined && this.completedAt === undefined;
  }

  private get completed(): boolean {
    return this.startedAt !== undefined && this.completedAt !== undefined;
  }

  get state(): StepState {
    if (this.started) {
      return StepState.STARTED;
    } else if (this.completed) {
      return StepState.COMPLETED;
    } else {
      return StepState.PENDING;
    }
  }

  get timer(): Timer | undefined {
    return Timer.fromStep(this);
  }

  constructor(
    public readonly name: string,
    public readonly autostart: boolean, // does this step start automatically when the previous step is completed
    public readonly description?: string,
    public readonly startedAt?: Date,
    public readonly completedAt?: Date,
    public readonly duration?: number // manual step iff. undefined
  ) {}

  static fromObject(obj: any): Step {
    return new Step(
      obj.name,
      toBoolean(obj.autostart),
      obj.description,
      toDateOrUndefined(obj.startedAt),
      toDateOrUndefined(obj.completedAt),
      toNumberOrUndefined(obj.duration)
    );
  }
}

export function remainingDuration(step: Step): Duration | null {
  if (step.duration === undefined) {
    return null;
  } else if (step.startedAt === undefined) {
    return minutesToDuration(step.duration);
  } else {
    const endTime = addMinutes(step.startedAt, step.duration);
    return intervalToDuration({
      start: new Date(),
      end: endTime,
    });
  }
}

export function stepDuration(step: Step): Duration | null {
  if (!step.startedAt || !step.completedAt) {
    return null;
  }
  return intervalToDuration({
    start: step.startedAt,
    end: step.completedAt,
  });
}

export function formatDuration(
  duration: Duration | null,
  isNegative = false
): string | null {
  if (!duration) {
    return null;
  }

  const sign = isNegative ? "-" : "";

  if (Math.abs((duration.months ?? 0) + (duration.years ?? 0)) > 0) {
    return "long";
  }

  if (Math.abs(duration.days ?? 0) > 0) {
    return `${sign}${duration.days ?? 0}d ${duration.hours ?? 0}h`;
  }

  if (Math.abs(duration.hours ?? 0) > 0) {
    return `${sign}${duration.hours ?? 0}h ${duration.minutes ?? 0}m`;
  }

  const formatZero = (n: number) => (n < 10 ? "0" + n : "" + n);
  return `${sign}${duration.minutes ?? 0}m ${formatZero(
    duration.seconds ?? 0
  )}s`;
}

export function isStepOverdue(step: Step): boolean {
  if (step.startedAt == undefined || step.duration === undefined) {
    return false;
  }
  const endTime = addMinutes(step.startedAt, step.duration);
  const now = new Date();
  return now >= endTime;
}
