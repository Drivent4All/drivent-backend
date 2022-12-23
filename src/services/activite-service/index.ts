import { cannotActiviteTicketError, cannotActiviteDoesntMatchError, cannotActiviteOverCapacityError, cannotActiviteDateError, cannotActiviteBookingError, cannotActivitePaymemtError, cannotActiviteOnlineEventError, cannotActiviteEnrrolmentError, notFoundError } from "@/errors";
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

async function getActivites(userId: number) {
  const ticketTypeId = await activitieService.confirmationStage(Number(userId));

  const activites = await activiteRepository.findActivites(ticketTypeId, userId);

  return activites;
}

async function getActivitiesByDay(userId: number, day: number, month: number, year: number) {
  const validDate = await dateValidation(day, month, year);

  const ticketTypeId = await confirmationStage(userId);

  const activities = await activiteRepository.findActivites(ticketTypeId, userId);

  const activitiesByDay: Activite[] = activities.filter(({ startsAt }) => {
    // const date = dayjs(startsAt).add(1, 'day').format("YYYY-MM-DD");
    const date = dayjs(startsAt).format("YYYY-MM-DD");

    if (date === validDate) {
      return true;
    }
    else {
      return false;
    }
  });
  return activitiesByDay;
}

async function subscribeByIdActivite(userId: number, id: number) {
  const ticketTypeId = await activitieService.confirmationStage(Number(userId));

  const activiteSelected = await activiteRepository.findActivitesById(id, userId);

  if (!activiteSelected) {
    throw notFoundError();
  }
  if (ticketTypeId !== activiteSelected.ticketTypeId) {
    console.log("entrou?");
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

async function dateValidation(day: number, month: number, year: number) {
  console.log("antes de transformar em data", day, month);
  const date = dayjs(`${month}-${day}-${year}`).format("YYYY-MM-DD");
  const splitDate = date.split("-");
  const dayOfDate = splitDate[2];
  if (day !== Number(dayOfDate)) {
    throw cannotActiviteDateError();
  }
  return date;
}

const activitieService = {
  confirmationStage,
  getActivites,
  dateValidation,
  getActivitiesByDay,
  subscribeByIdActivite
};

export default activitieService;
