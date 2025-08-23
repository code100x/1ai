/*
  Warnings:

  - You are about to drop the column `creditsGranted` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionId` on the `Subscription` table. All the data in the column will be lost.
  - Changed the type of `status` on the `PaymentHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `rzpSubscriptionId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "public"."PaymentHistory" DROP COLUMN "status",
ADD COLUMN     "status" "public"."PaymentStatus" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Subscription" DROP COLUMN "creditsGranted",
DROP COLUMN "isActive",
DROP COLUMN "subscriptionId",
ADD COLUMN     "rzpSubscriptionId" TEXT NOT NULL;
