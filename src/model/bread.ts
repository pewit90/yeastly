
interface Trigger {
    startTime?: Date|undefined;
    endTime?: Date|undefined;
}

interface TimerTrigger extends Trigger {
    durationSeconds: number;
}

interface EventTrigger extends Trigger {
    eventName: string; // e.g. when dough has doubled in size
    reminderPeriodSeconds: number;
}

export interface Step {
    name: string;
    completed: boolean;
    // Does this step start automatically when active?
    autostart: boolean;
    trigger?: Trigger;
}

export interface Bread {
    uuid: number;
    name: string;
    steps: Step[];
    
}