import { cannotActiviteTicketError, cannotActiviteDoesntMatchError, cannotActiviteOverCapacityError, conflictActivitiesError, cannotActiviteDateError, cannotActiviteBookingError, cannotActivitePaymemtError, cannotActiviteOnlineEventError, cannotActiviteEnrrolmentError, noActivitiesError, notFoundError } from "@/errors";
import roomRepository from "@/repositories/room-repository";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import tikectRepository from "@/repositories/ticket-repository";
import activiteRepository from "@/repositories/activite-repository";
import { number, string } from "joi";
import { Activite, BookingActivite } from "@prisma/client";
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
  return ticket.ticketTypeId;
}

async function getAcitivitiesDates(userId: number) {
  const ticketTypeId = await activitieService.confirmationStage(Number(userId));

  const dates = await activiteRepository.getAcitivitiesDates(ticketTypeId);

  return dates;
}

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
console.log("activities", activities)
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
  const alreadySubscibed = await activiteRepository.allSubscriptions(userId)

  if (alreadySubscibed.length !== 0) {

    for (let i = 0; i < alreadySubscibed.length; i++) {

      const activitySubscribed = alreadySubscibed[i].Activite

      const isActivitySubStartsBeforeActivityStartsSelected = dayjs(activitySubscribed.startsAt).isBefore(activiteSelected.startsAt)
      const isActivitySubSEndsAfterActivityStartsSelected = dayjs(activitySubscribed.endsAt).isAfter(activiteSelected.startsAt)

      if (isActivitySubStartsBeforeActivityStartsSelected && isActivitySubSEndsAfterActivityStartsSelected) {
        throw conflictActivitiesError()
      }

      const isActivitySelectedtartsBeforeActivityStartsSub = dayjs(activiteSelected.startsAt).isBefore(activitySubscribed.startsAt)
      const isActivitySelectedSEndsAfterActivityStartsSub = dayjs(activiteSelected.endsAt).isAfter(activitySubscribed.startsAt)

      if (isActivitySelectedtartsBeforeActivityStartsSub && isActivitySelectedSEndsAfterActivityStartsSub) {
        throw conflictActivitiesError()
      }

      const isActivitySelectedtartsTheSameActivityStartsSub = dayjs(activiteSelected.startsAt).isSame(activitySubscribed.startsAt)

      if (isActivitySelectedtartsTheSameActivityStartsSub) {
        throw conflictActivitiesError()
      }
    }

  }
  await activiteRepository.updateActivities(id, activiteSelected.capacity);

  await bookingActiviteRepository.reserveActivity(userId, id);

  const updatedActivite = await activiteRepository.findActivitiesById(activiteSelected.id, userId);

  return updatedActivite.BookingActivite;
}

async function checkSubscription(userId: number, activityId: number) {
  await activitieService.confirmationStage(Number(userId));

  if (Number.isNaN(activityId)) {
    throw notFoundError();
  }

  const subscription = await activiteRepository.checkSub(userId, activityId);

  return subscription;
}

const activitieService = {
  confirmationStage,
  getActivitiesByDay,
  subscribeByIdActivity,
  getAcitivitiesDates,
  checkSubscription
};

export default activitieService;
