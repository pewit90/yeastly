import { registerPlugin } from "@capacitor/core";

export interface AlarmSetResult {
  sec: number;
  result: boolean;
}

export interface AlarmPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
  setAlarm(options: {
    sec: number;
    sound: boolean;
    title: string;
    text: string;
  }): Promise<AlarmSetResult>;
}

const Alarm = registerPlugin<AlarmPlugin>("Alarm");

export default Alarm;
