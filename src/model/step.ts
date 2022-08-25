import { toBoolean, toDateOrUndefined, toNumberOrUndefined } from "../utils/conversion-utils";

export enum StepState {
    PENDING  = "PENDING",
    STARTED = "STARTED",
    COMPLETED = "COMPLETED"
}

export class Step {

    get pending(): boolean {
        return !this.started && !this.completed;        
    }

    get started(): boolean {
        return this.startedAt !== undefined;        
    }

    get completed(): boolean {
        return this.completedAt !== undefined;        
    }

    get state(): StepState {
        if (this.started) {
            return StepState.STARTED;
        } else if (this.completed) {
            return StepState.COMPLETED;
        } else {
            return StepState.PENDING
        }
    }

    constructor(
        public readonly name: string,
        public readonly autostart: boolean, // does this step start automatically when the previous step is completed 
        public readonly startedAt?: Date,
        public readonly completedAt?: Date,
        public readonly duration?: number, // manual step iff. undefined
    ) { }

    static fromObject(obj: any): Step {
        return new Step(
            obj.name,
            toBoolean(obj.autostart),
            toDateOrUndefined(obj.startedAt),
            toDateOrUndefined(obj.completedAt),
            toNumberOrUndefined(obj.duration),
        );
    }

}
