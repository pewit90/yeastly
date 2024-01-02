import produce, { immerable } from "immer";
import { toDateOrUndefined } from "../utils/conversion-utils";
import { Step, StepState } from "./step";

export class Bread {
  [immerable] = true;

  get started(): boolean {
    return this.steps.some((s) => s.state !== StepState.PENDING);
  }

  get completed(): boolean {
    return this.steps.every((s) => s.state === StepState.COMPLETED);
  }

  get currentStepIndex(): number {
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      if (step.state !== StepState.COMPLETED) {
        return i;
      }
    }
    return -1;
  }

  get currentStep(): Step | undefined {
    const currentStepIndex = this.currentStepIndex;
    if (currentStepIndex < 0) {
      return undefined;
    }
    return this.steps[currentStepIndex];
  }

  constructor(
    public readonly uuid: number,
    public readonly name: string,
    public readonly steps: Step[],
    public readonly createdTimestamp: Date,
    public readonly description?: string
  ) {}

  static fromObject(obj: any): Bread {
    return new Bread(
      obj.uuid as number,
      obj.name,
      obj.steps ? obj.steps.map((el: any) => Step.fromObject(el)) : [],
      toDateOrUndefined(obj.createdTimestamp) ?? new Date(), // TODO throw error if undefined
      obj.description
    );
  }

  continue(): Bread {
    return produce(this, (nextBread) => {
      const currentStepIndex = nextBread.currentStepIndex;
      const currentStep = nextBread.steps[currentStepIndex];
      if (currentStep.state !== StepState.STARTED) {
        return;
      }

      currentStep.completedAt = new Date();
      if (currentStepIndex >= nextBread.steps.length - 1) {
        return;
      }

      const nextStep = nextBread.steps[currentStepIndex + 1];
      if (nextStep.autostart) {
        nextStep.startedAt = new Date();
      }
    });
  }

  resetCurrentStep(): Bread {
    return produce(this, (nextBread) => {
      const currentStepIndex = nextBread.currentStepIndex;
      const currentStep = nextBread.steps[currentStepIndex];
      currentStep.startedAt = undefined;
      currentStep.completedAt = undefined;
    });
  }

  resumePreviousStep(): Bread {
    if (this.currentStepIndex === 0) {
      return this;
    }

    return produce(this, (nextBread) => {
      const currentStepIndex = nextBread.currentStepIndex;
      const currentStep = nextBread.steps[currentStepIndex];
      currentStep.startedAt = undefined;
      currentStep.completedAt = undefined;

      const previousStepIndex = currentStepIndex - 1;
      const previousStep = nextBread.steps[previousStepIndex];
      previousStep.completedAt = undefined;
    });
  }

  startStep(): Bread {
    return produce(this, (nextBread) => {
      const currentStep = nextBread.steps[nextBread.currentStepIndex];
      if (currentStep.state === StepState.PENDING) {
        const startedAt = new Date();
        currentStep.startedAt = startedAt;
      }
    });
  }

  resetAllSteps(): Bread {
    return produce(this, (nextBread) => {
      nextBread.steps = this.steps.map((step) =>
        produce(step, (nextStep) => {
          nextStep.startedAt = undefined;
          nextStep.completedAt = undefined;
        })
      );
    });
  }

  cloneAndReset(uuid: number, createdTimestamp: Date, name?: string): Bread {
    return produce(this, (nextBread) => {
      nextBread.uuid = uuid;
      nextBread.createdTimestamp = createdTimestamp;
      nextBread.name = name ?? this.name;
    }).resetAllSteps();
  }
}
