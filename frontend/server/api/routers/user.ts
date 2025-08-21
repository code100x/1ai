import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";



export const userRouter = createTRPCRouter({
  updateUser: protectedProcedure.input(z.object({ nickname: z.string().optional(), whatDoYouDo: z.string().optional(), customTraits: z.array(z.string()).optional(), about: z.string().optional() })).mutation(async ({  ctx, input }) => {

    if(!ctx.session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }
    try {
        await db.user.update({
            where: {
              id: ctx.session.user.id,
            },
            data: {
              ...input,
            },
          });
      
          return {
              success: true,
              message: "User updated successfully",
          }   
    } catch (error) {
        console.error(`Error updating user: ${error}`);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update user" });
    }
  }),
});
