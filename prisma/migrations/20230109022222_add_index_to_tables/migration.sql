-- CreateIndex
CREATE INDEX "Activite_date_idx" ON "Activite"("date");

-- CreateIndex
CREATE INDEX "BookingActivite_userId_idx" ON "BookingActivite"("userId");

-- CreateIndex
CREATE INDEX "Enrollment_userId_idx" ON "Enrollment"("userId");

-- CreateIndex
CREATE INDEX "Payment_ticketId_idx" ON "Payment"("ticketId");

-- CreateIndex
CREATE INDEX "Ticket_enrollmentId_idx" ON "Ticket"("enrollmentId");
