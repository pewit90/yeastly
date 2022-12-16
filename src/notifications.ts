import { addSeconds } from "date-fns";
import { redirect, useNavigate } from "react-router-dom";
import { Bread } from "./model/bread";
import { StepState } from "./model/step";

const notificationIndex: Record<number, NodeJS.Timeout> = {};

export function clearNotification(breadUUID: number) {
  const timeout = notificationIndex[breadUUID];
  if (timeout) {
    clearTimeout(timeout);
    delete notificationIndex[breadUUID];
  }
}

export function setupBreadNotification(bread: Bread): void {
  clearNotification(bread.uuid);
  const currentStep = bread.steps[bread.currentStepIndex];
  if (currentStep.state !== StepState.STARTED) {
    return;
  }

  if (currentStep.duration !== undefined) {
    registerNotification(
      bread.uuid,
      // addMinutes(startedAt, currentStep.duration),
      addSeconds(new Date(), 5),
      `${bread.name}: ${currentStep.name}`
    );
  }
}

async function registerNotification(
  breadUUID: number,
  time: Date,
  title: string
) {
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
  }, time.getTime() - Date.now());
  notificationIndex[breadUUID] = timeout;
}
