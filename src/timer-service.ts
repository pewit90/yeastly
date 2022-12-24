import { LocalNotifications } from "@capacitor/local-notifications";
import { addSeconds, addMinutes, differenceInSeconds } from "date-fns";
import Alarm from "./capacitor/alarm-plugin";
import { Bread } from "./model/bread";
import { StepState } from "./model/step";
import { getBread } from "./model/store";
import { Timer } from "./model/timer";

export async function getPendingTimers() {
  const pending = await LocalNotifications.getPending();
  const timers = pending.notifications.map(
    (notificaction) => new Timer(notificaction.id, notificaction.schedule!.at!)
  );
  return timers;
}

export async function hasNotificationPermission() {
  const permissionState = await LocalNotifications.checkPermissions();
  return permissionState.display;
}

export async function setupBreadTimer(bread: Bread): Promise<void> {
  const currentStep = bread.steps[bread.currentStepIndex];
  if (currentStep.state !== StepState.STARTED) {
    return;
  }

  if (
    currentStep.duration !== undefined &&
    currentStep.startedAt !== undefined
  ) {
    // const dueTime = addSeconds(currentStep.startedAt, 5);
    const dueTime = addMinutes(currentStep.startedAt, currentStep.duration);
    await registerTimer(
      bread.uuid,
      dueTime,
      `${bread.name}: ${currentStep.name}`
    );
  }
}

async function registerTimer(breadUUID: number, dueDate: Date, title: string) {
  // TODO: verify input
  const bread = getBread(breadUUID);
  const currentStep = bread.steps[bread.currentStepIndex];

  const { alarmId } = await Alarm.setAlarm({
    sec: differenceInSeconds(dueDate, new Date()),
    sound: true,
    title: `${currentStep.name}`,
    text: `${bread.name} is ready for the next step`,
  });

  // LocalNotifications.schedule({
  //   notifications: [
  //     {
  //       id: breadUUID,
  //       title: `${currentStep.name}`,
  //       body: `${bread.name} is ready for the next step`,
  //       schedule: {
  //         at: dueDate,
  //         allowWhileIdle: true,
  //       },
  //     },
  //   ],
  // });
}
