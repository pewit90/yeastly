
function toDateOrUndefined(isoDate: string | undefined) {
    const date = isoDate ? new Date(isoDate) : undefined;
    return date;
}

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
        startTime: toDateOrUndefined(obj.startTime),
        endTime: toDateOrUndefined(obj.endTime)
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
        steps: obj.steps ? obj.steps.map((el: any) => toStep(el)) : [],
        started: obj.started,
        createdTimestamp: toDateOrUndefined(obj.createdTimestamp) ?? new Date(), // set now if created time not set
        completedTimestamp: toDateOrUndefined(obj.completedTimestamp)
    }
}

export interface Bread {
    uuid: number;
    name: string;
    steps: Step[];
    started: boolean;
    createdTimestamp: Date;
    completedTimestamp?: Date;
}