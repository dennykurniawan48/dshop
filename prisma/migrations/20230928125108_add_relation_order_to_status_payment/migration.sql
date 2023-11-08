-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "statusId" TEXT NOT NULL DEFAULT 'payment';

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "StatusPayment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
