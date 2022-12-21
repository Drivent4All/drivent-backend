import { ApplicationError } from "@/protocols";

export function cannotNoActivitieError(): ApplicationError {
  return {
    name: "CannotNoActivitieError",
    message: "You booked an online event. There is no need to choose an activite.",
  };
}
