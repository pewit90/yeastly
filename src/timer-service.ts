import { addMinutes } from "date-fns";
import { Bread } from "./model/bread";
import { StepState } from "./model/step";
import { Timer } from "./model/timer";

const notificationIndex: Record<number, Timer> = {};

export function hasPermission(): boolean {
  return Notification.permission === "granted";
}
export function getTimers(): Timer[] {
  return Object.values(notificationIndex);
}

export function clearNotification(breadUUID: number) {
  const timer = notificationIndex[breadUUID];
  if (timer) {
    timer.clear();
    delete notificationIndex[breadUUID];
  }
}

export function setupBreadTimer(bread: Bread): void {
  clearNotification(bread.uuid);
  const currentStep = bread.steps[bread.currentStepIndex];
  if (currentStep.state !== StepState.STARTED) {
    return;
  }

  if (
    currentStep.duration !== undefined &&
    currentStep.startedAt !== undefined
  ) {
    registerTimer(
      bread.uuid,
      addMinutes(currentStep.startedAt, currentStep.duration),
      // addSeconds(new Date(), 5),
      `${bread.name}: ${currentStep.name}`
    );
  }
}

async function registerTimer(breadUUID: number, dueDate: Date, title: string) {
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
}
