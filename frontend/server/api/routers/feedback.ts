import { z } from "zod";
import axios from "axios";
import { env } from "@/env";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

const contentTemplate = `
Gm Gm, I am the feedback bot.

I have received a new feedback from **{name}**

Message: **{message}**

Thank you for your feedback!
`;

export const feedbackRouter = createTRPCRouter({
  createFeedback: publicProcedure.input(z.object({ name: z.string(), message: z.string() })).mutation(async ({  input }) => {

    await axios.post(env.WEBHOOK_URL, {
      content: contentTemplate.replace("{name}", input.name).replace("{message}", input.message),
    });


    return {
      success: true,
    };
  }),
});
