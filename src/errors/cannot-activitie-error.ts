import { ApplicationError } from "@/protocols";

export function cannotActivitieError(): ApplicationError {
  return {
    name: "CannotActivitieError",
    message: "Still no activitie to check! Waiting payment confirmation!",
  };
}
