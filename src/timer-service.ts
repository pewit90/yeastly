import { addMinutes } from "date-fns";
import { Bread } from "./model/bread";
import { StepState } from "./model/step";
import { getBreads } from "./model/store";
import { Timer } from "./model/timer";

const notificationIndex: Record<number, Timer> = {};

export function hasPermission(): boolean {
  return Notification.permission === "granted";
}
export function getTimers(): Timer[] {
  return Object.values(notificationIndex);
}

export async function debugRebuildTimers() {
  console.log("Rebuilding timers");
  for (const key in notificationIndex) {
    delete notificationIndex[key];
  }
  const breads = getBreads();
  for (const bread of breads) {
    await setupBreadTimer(bread);
  }
  console.log("Timers, as per service: " + JSON.stringify(notificationIndex));
}

export function clearNotification(breadUUID: number) {
  const timer = notificationIndex[breadUUID];
  if (timer) {
    timer.clear();
    delete notificationIndex[breadUUID];
  }
}

export async function setupBreadTimer(bread: Bread): Promise<void> {
  clearNotification(bread.uuid);
  const currentStep = bread.steps[bread.currentStepIndex];
  console.log(JSON.stringify(currentStep));
  if (currentStep.state !== StepState.STARTED) {
    return;
  }

  if (
    currentStep.duration !== undefined &&
    currentStep.startedAt !== undefined
  ) {
    await registerTimer(
      bread.uuid,
      addMinutes(currentStep.startedAt, currentStep.duration),
      // addSeconds(new Date(), 5),
      `${bread.name}: ${currentStep.name}`
    );
  }
}

async function registerTimer(breadUUID: number, dueDate: Date, title: string) {
  console.log("Registering timer for ", breadUUID);
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    // TODO inform user of his bad choice
    console.error("permission for notification denied");
    return;
  }

  clearTimeout(breadUUID);

  const timeout = setTimeout(() => {
    const notification = new Notification(title);
    notification.onclick = () => {
      console.log("notification clicked for", breadUUID);
    };
    delete notificationIndex[breadUUID];
  }, dueDate.getTime() - Date.now());
  notificationIndex[breadUUID] = new Timer(breadUUID, timeout);
  console.log(JSON.stringify(notificationIndex));
}
