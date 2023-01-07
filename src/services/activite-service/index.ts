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

async function getActivites(userId: number) {
  const ticketTypeId = await activitieService.confirmationStage(Number(userId));

  const activites = await activiteRepository.findActivites(ticketTypeId, userId);

  return activites;
}

async function getActivitiesByDay(userId: number, date: string) {
  const ticketTypeId = await confirmationStage(userId);
  const validDate = await dateValidation(date);
  
  if (!validDate) {
    throw cannotActiviteDateError();
  }

  const newDate = new Date(date);

  const activities = await activiteRepository.findActivitesByDate(ticketTypeId, userId, newDate);

  if (activities.length === 0) {
    throw noActivitiesError();
  }

  return activities;
}

async function subscribeByIdActivite(userId: number, id: number) {
  const ticketTypeId = await activitieService.confirmationStage(Number(userId));

  const activiteSelected = await activiteRepository.findActivitesById(id, userId);

  if (!activiteSelected) {
    throw notFoundError();
  }
  if (ticketTypeId !== activiteSelected.ticketTypeId) {
    throw cannotActiviteDoesntMatchError();
  }
  
  if (activiteSelected.capacity === 0) {
    throw cannotActiviteOverCapacityError();
  }

  await activiteRepository.updateActivities(id, activiteSelected.capacity);

  await bookingActiviteRepository.reserveActivite(userId, id);

  const updatedActivite = await activiteRepository.findActivitesById(activiteSelected.id, userId);

  return updatedActivite.BookingActivite;
}

async function dateValidation(date: string) {
  const newDate = new Date(date);
  return !isNaN(newDate.getTime());
}

const activitieService = {
  confirmationStage,
  getActivites,
  dateValidation,
  getActivitiesByDay,
  subscribeByIdActivite,
  getAcitivitiesDates
};

export default activitieService;
