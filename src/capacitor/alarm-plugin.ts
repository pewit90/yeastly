import { registerPlugin, WebPlugin } from "@capacitor/core";

export interface AlarmSetResult {
  alarmId: string;
}

export interface AlarmPlugin {
  setAlarm(options: {
    sec: number;
    sound: boolean;
    title: string;
    text: string;
  }): Promise<AlarmSetResult>;
  cancelAlarm(options: { alarmId: string }): void;
}

export class AlarmWeb extends WebPlugin implements AlarmPlugin {
  setAlarm(options: {
    sec: number;
    sound: boolean;
    title: string;
    text: string;
  }): Promise<AlarmSetResult> {
    console.log("Capacitor: setAlarm()", options);
    return Promise.resolve({ alarmId: crypto.randomUUID() });
  }

  cancelAlarm(options: { alarmId: string }): void {
    console.log("Capacitor: cancelAlarm()", options);
  }
}

const Alarm = registerPlugin<AlarmPlugin>("Alarm", {
  web: () => Promise.resolve(new AlarmWeb()),
});

export default Alarm;
