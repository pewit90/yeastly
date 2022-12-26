import { registerPlugin, WebPlugin } from "@capacitor/core";

export interface AlarmSetResult {
  alarmId: string;
}

export interface AlarmPlugin {
  setAlarm(options: {
    alarmId: string;
    alarmTime: number;
    title: string;
    text: string;
  }): Promise<void>;
  cancelAlarm(options: { alarmId: string }): void;
  hasRequiredPermissions(): Promise<{ permissionState: string }>;
}

export class AlarmWeb extends WebPlugin implements AlarmPlugin {
  setAlarm(options: {
    alarmId: string;
    alarmTime: number;
    title: string;
    text: string;
  }): Promise<void> {
    console.log("Capacitor: setAlarm()", options);
    return Promise.resolve();
  }

  cancelAlarm(options: { alarmId: string }): void {
    console.log("Capacitor: cancelAlarm()", options);
  }

  hasRequiredPermissions(): Promise<{ permissionState: string }> {
    return Promise.resolve({ permissionState: "granted" });
  }
}

const Alarm = registerPlugin<AlarmPlugin>("Alarm", {
  web: () => Promise.resolve(new AlarmWeb()),
});

export default Alarm;
