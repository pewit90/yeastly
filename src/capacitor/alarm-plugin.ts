import { registerPlugin, WebPlugin } from "@capacitor/core";

export interface AlarmSetResult {
  sec: number;
  result: boolean;
}

export interface AlarmPlugin {
  setAlarm(options: {
    sec: number;
    sound: boolean;
    title: string;
    text: string;
  }): Promise<AlarmSetResult>;
}

export class AlarmWeb extends WebPlugin implements AlarmPlugin {
  setAlarm(options: {
    sec: number;
    sound: boolean;
    title: string;
    text: string;
  }): Promise<AlarmSetResult> {
    console.log("Capacitor: setAlarm()", options);
    return Promise.resolve({ sec: options.sec, result: true });
  }
}

const Alarm = registerPlugin<AlarmPlugin>("Alarm", {
  web: () => Promise.resolve(new AlarmWeb()),
});

export default Alarm;
