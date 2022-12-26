import Alarm from "./capacitor/alarm-plugin";
import { Bread } from "./model/bread";

export async function hasNotificationPermission(): Promise<string> {
  const result = await Alarm.hasRequiredPermissions();
  return result.permissionState;
}

export async function setupTimer(bread: Bread): Promise<void> {
  const currentStep = bread.currentStep;
  const timer = currentStep?.timer;
  if (currentStep === undefined || timer === undefined) {
    return;
  }

  await Alarm.setAlarm({
    alarmId: toAlarmId(bread.uuid),
    alarmTime: timer.dueAt.getTime(),
    title: `${bread.name}: ${currentStep.name}`,
    text: `${bread.name} is ready for the next step`,
  });
}

export async function clearTimer(breadUUID: number) {
  Alarm.cancelAlarm({ alarmId: toAlarmId(breadUUID) });
}

function toAlarmId(breadUUID: number): string {
  return `bread_${breadUUID}`;
}
