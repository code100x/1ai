-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
