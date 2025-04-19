import { currentUser } from "@clerk/nextjs/server";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/app/db";

export const appRouter = router({});

export type AppRouter = typeof appRouter;
