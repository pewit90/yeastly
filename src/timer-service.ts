import { addMinutes } from "date-fns";
import { Bread } from "./model/bread";
import { StepState } from "./model/step";
import { LocalNotifications } from "@capacitor/local-notifications";

export async function setupBreadTimer(bread: Bread): Promise<void> {
  const currentStep = bread.steps[bread.currentStepIndex];
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
      `${bread.name}: ${currentStep.name}`
    );
  }
}

async function registerTimer(breadUUID: number, dueDate: Date, title: string) {
  console.log("Registering timer for ", breadUUID);
  LocalNotifications.schedule({
    notifications: [
      {
        id: breadUUID,
        title: "Test Notificatoin",
        body: "This is the notification",
      },
    ],
  });
}
