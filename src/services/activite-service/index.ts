import { cannotActiviteTicketError, cannotActiviteDoesntMatchError, cannotActiviteOverCapacityError, cannotActiviteDateError, cannotActiviteBookingError, cannotActivitePaymemtError, cannotActiviteOnlineEventError, cannotActiviteEnrrolmentError, noActivitiesError, notFoundError } from "@/errors";
import roomRepository from "@/repositories/room-repository";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import tikectRepository from "@/repositories/ticket-repository";
import activiteRepository from "@/repositories/activite-repository";
import { number, string } from "joi";
import { Activite } from "@prisma/client";
import { error } from "console";
import dayjs from "dayjs";
import httpStatus from "http-status";
import bookingActiviteRepository from "@/repositories/bookingActivite-repository";

async function confirmationStage(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw cannotActiviteEnrrolmentError();
  }
  const ticket = await tikectRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw cannotActiviteTicketError();
  }
  if (ticket.status === "RESERVED") {
    throw cannotActivitePaymemtError();
  }

  if (!ticket.TicketType.includesHotel) {
    throw cannotActiviteOnlineEventError();
  }
  // const booking = await bookingRepository.findByUserId(userId);
  // if (!booking) {
  //   throw cannotActiviteBookingError();
  // }

  return ticket.ticketTypeId;
}

async function getAcitivitiesDates(userId: number) {
  const ticketTypeId = await activitieService.confirmationStage(Number(userId));

  const dates = await activiteRepository.getAcitivitiesDates(ticketTypeId);  

  return dates;
}

// async function getActivities(userId: number) {
//   const ticketTypeId = await activitieService.confirmationStage(Number(userId));

//   const activites = await activiteRepository.findActivities(ticketTypeId, userId);

//   return activites;
// }

async function getActivitiesByDay(userId: number, date: string) {
  const newDate = new Date(date);

  const ticketTypeId = await confirmationStage(userId);

  if (!dayjs(newDate.getTime()).isValid()) {
    throw cannotActiviteDateError();
  }

  const activities = await activiteRepository.findActivitiesByDate(userId, newDate);

  if (activities.length === 0) {
    throw noActivitiesError();
  }

  return activities;
}

async function subscribeByIdActivity(userId: number, id: number) {
  const ticketTypeId = await activitieService.confirmationStage(Number(userId));

  const activiteSelected = await activiteRepository.findActivitiesById(id, userId);

  if (!activiteSelected) {
    throw notFoundError();
  }
  if (ticketTypeId !== activiteSelected.ticketTypeId) {
    throw cannotActiviteDoesntMatchError();
  }
  
  if (activiteSelected.capacity === 0) {
    throw cannotActiviteOverCapacityError();
  }

  // const activityChosen = await activiteRepository.findActivitesById(activityId, userId);
  // const sameDay = await activiteRepository.checkSameStartTime(userId, activityChosen.date, Number(activityChosen.startsAt.split("h")[0]));
  // console.log(sameDay);

  await activiteRepository.updateActivities(id, activiteSelected.capacity);

  await bookingActiviteRepository.reserveActivity(userId, id);

  const updatedActivite = await activiteRepository.findActivitiesById(activiteSelected.id, userId);

  return updatedActivite.BookingActivite;
}

async function checkSubscription(userId: number, activityId: number) {
  await activitieService.confirmationStage(Number(userId));

  if(Number.isNaN(activityId)) {
    throw notFoundError();
  }

  const subscription = await activiteRepository.checkSub(userId, activityId);

  return subscription;
}

const activitieService = {
  confirmationStage,
  // getActivities,
  getActivitiesByDay,
  subscribeByIdActivity,
  getAcitivitiesDates,
  checkSubscription
};

export default activitieService;
