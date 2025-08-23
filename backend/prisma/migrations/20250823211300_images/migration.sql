-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
