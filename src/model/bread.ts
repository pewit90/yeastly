import produce, { immerable } from "immer";
import { toDateOrUndefined } from "../utils/conversion-utils";
import { Step, StepState } from "./step";

export class Bread {

    [immerable] = true;

    get started(): boolean {
        return this.steps.some(s => s.state !== StepState.PENDING);
    }

    get completed(): boolean {
        return this.steps.every(s => s.state === StepState.COMPLETED);
    }

    get currentStepIndex(): number {
        return this.steps.findIndex(s => s.state === StepState.PENDING)
    }

    constructor(
        public readonly uuid: number,
        public readonly name: string,
        public readonly steps: Step[],
        public readonly createdTimestamp: Date,
    ) { }

    static fromObject(obj: any): Bread {
        return new Bread(
            obj.uuid as number,
            obj.name,
            obj.steps ? obj.steps.map((el: any) => Step.fromObject(el)) : [],
            toDateOrUndefined(obj.createdTimestamp) ?? new Date(), // TODO throw error if undefined
        )
    }

    continue(): Bread {
        return produce(this, nextBread => {
            const currentStepIndex = nextBread.currentStepIndex;
            const currentStep = nextBread.steps[currentStepIndex];
            currentStep.completedAt = new Date();

            if (nextBread.currentStepIndex < nextBread.steps.length - 1) {
                const nextStep = nextBread.steps[currentStepIndex + 1];
                if (nextStep.autostart) {
                    nextStep.startedAt = new Date();
                }
            }
        });
    }

}