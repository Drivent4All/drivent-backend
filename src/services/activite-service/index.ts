import { cannotActivitieError, cannotNoActivitieError, notFoundError } from "@/errors";
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

async function confirmationStage(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw cannotActivitieError();
  }
  const ticket = await tikectRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotNoActivitieError();
  }

  const booking = await bookingRepository.findByUserId(userId);
  if (!booking) {
    throw notFoundError();
  }

  return ticket.ticketTypeId;
}

async function getActivites(userId: number) {
  const ticketTypeId = await activitieService.confirmationStage(Number(userId));
 
  const activites = await activiteRepository.findActivites(ticketTypeId);

  return activites;
}

async function getActivitiesByDay(userId: number, day: number, month: number, year: number) {
  const validDate = await dateValidation(day, month, year);

  const ticketTypeId = await confirmationStage(Number(userId));

  const activities = await activiteRepository.findActivites(ticketTypeId);

  activities.filter(({ startsAt }) => {
    const date = dayjs(startsAt).format("YYYY-MM-DD");
    if(date===validDate) {
      return true;
    }
    else{
      false;
    }
  });
  return activities;
}

async function dateValidation(day: number, month: number, year: number) {
  const date = dayjs(`${month}-${day}-${year}`).format("YYYY-MM-DD");

  if(!dayjs(date).isValid()) {
    throw error;
  }
  return date;
}

const activitieService = {
  confirmationStage,
  getActivites,
  dateValidation,
  getActivitiesByDay
};

export default activitieService;
