
function getTriggerFunction(obj: any): Function {
    if (obj.durationSeconds !== undefined)
        return toTimerTrigger;
    else if (obj.eventName && obj.reminderPeriodSeconds)
        return toEventTrigger;
    else
        return toTrigger;
}

function toTrigger(obj: any): Trigger {
    return {
        startTime: obj.startTime ? new Date(obj.startTime) : undefined,
        endTime: obj.endTime ? new Date(obj.endTime) : undefined
    }
}

interface Trigger {
    startTime?: Date | undefined;
    endTime?: Date | undefined;
}

function toTimerTrigger(obj: any): TimerTrigger {
    const trigger = toTrigger(obj);
    return {
        ...trigger,
        durationSeconds: obj.durationSeconds as number
    }
}
interface TimerTrigger extends Trigger {
    durationSeconds: number;
}

function toEventTrigger(obj: any): EventTrigger {
    const trigger = toTrigger(obj);
    return {
        ...trigger,
        eventName: obj.eventName,
        reminderPeriodSeconds: obj.reminderPeriodSeconds as number
    }
}

interface EventTrigger extends Trigger {
    eventName: string; // e.g. when dough has doubled in size
    reminderPeriodSeconds: number;
}

function toStep(obj: any) {
    const step: Step = {
        name: obj.name,
        completed: obj.completed as boolean,
        autostart: obj.autostart as boolean
    };
    if (obj.trigger) {
        const triggerObj = obj.trigger;
        const conversionFunc = getTriggerFunction(triggerObj);
        step.trigger = conversionFunc(triggerObj);
    }
    return step;
}

export interface Step {
    name: string;
    completed: boolean;
    // Does this step start automatically when active?
    autostart: boolean;
    trigger?: Trigger;
}

export function toBread(obj: any): Bread {
    return {
        uuid: obj.uuid as number,
        name: obj.name,
        steps: obj.steps? obj.steps.map((el:any) => toStep(el)):[]
    }
}

export interface Bread {
    uuid: number;
    name: string;
    steps: Step[];
}