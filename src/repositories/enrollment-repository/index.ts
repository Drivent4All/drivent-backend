import { prisma } from "@/config";
import { enrollmentError, noActivitiesError } from "@/errors";
import { Enrollment, PrismaClient, PrismaPromise } from "@prisma/client";
import { CreateAddressParams, UpdateAddressParams } from "../address-repository";

async function findWithAddressByUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
    },
  });
}

async function findById(enrollmentId: number) {
  return prisma.enrollment.findFirst({
    where: { id: enrollmentId }
  });
}

async function upsert(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
  createdAddress: CreateAddressParams, updatedAddress: UpdateAddressParams
) {
  return prisma.$transaction(async (tx: PrismaClient) => {
    const newEnrollment = await tx.enrollment.upsert({
      where: {
        userId,
      },
      create: createdEnrollment,
      update: updatedEnrollment,
    });

    if(!newEnrollment) {
      throw enrollmentError();
    }
    await tx.address.upsert({
      where: {
        enrollmentId: newEnrollment.id,
      },
      create: {
        ...createdAddress,
        Enrollment: { connect: { id: newEnrollment.id } },
      },
      update: updatedAddress,
    });

    return newEnrollment;
  });
}

export type CreateEnrollmentParams = Omit<Enrollment, "id" | "createdAt" | "updatedAt">;
export type UpdateEnrollmentParams = Omit<CreateEnrollmentParams, "userId">;

const enrollmentRepository = {
  findWithAddressByUserId,
  upsert,
  findById,
};

export default enrollmentRepository;
