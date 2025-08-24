/*
  Warnings:

  - You are about to drop the column `externalId` on the `Execution` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Execution" DROP CONSTRAINT "Execution_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- AlterTable
ALTER TABLE "public"."Execution" DROP COLUMN "externalId";

-- AddForeignKey
ALTER TABLE "public"."Execution" ADD CONSTRAINT "Execution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."Execution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
