import { ApplicationError } from "@/protocols";

export function cannotActiviteTicketError(): ApplicationError {
  return {
    name: "CannotTicketError",
    message: "Your ticket is missing. Still no activitie to check =(",
  };
}

export function cannotActivitePaymemtError(): ApplicationError {
  return {
    name: "CannotPaymemtError",
    message: "Still no activitie to check! Waiting payment confirmation!",
  };
}

export function cannotActiviteOnlineEventError(): ApplicationError {
  return {
    name: "CannotOnlineEventError",
    message: "You booked an online event. There is no need to choose an activite.",
  };
}

export function cannotActiviteEnrrolmentError(): ApplicationError {
  return {
    name: "CannotEnrrolmentError",
    message: "Somenthing is wrong with your errolment",
  };
}

export function cannotActiviteBookingError(): ApplicationError {
  return {
    name: "CannotActiviteBookingError",
    message: "You need to book a room first.",
  };
}

export function cannotActiviteDateError(): ApplicationError {
  return {
    name: "CannotActiviteDateError",
    message: "You need to send a valid date.",
  };
}

export function cannotActiviteOverCapacityError(): ApplicationError {
  return {
    name: "CannotActiviteOverCapacityError",
    message: "Sorry, there is no seats availble.",
  };
}

export function cannotActiviteDoesntMatchError(): ApplicationError {
  return {
    name: "CannotActiviteDoesntMatchError",
    message: "Sorry, something went wrong.",
  };
}

export function noActivitiesError(): ApplicationError {
  return {
    name: "NoActivitiesError",
    message: "Sorry, there are no activities listed for that day.",
  };
}

export function enrollmentError(): ApplicationError {
  return {
    name: "enrollmentError",
    message: "Sorry, there is a enrollmentError.",
  };
}

export function conflictActivitiesError(): ApplicationError {
  return {
    name: "ConflictActivitiesError",
    message: "Sorry, you already have an activity at this time.",
  };
}
