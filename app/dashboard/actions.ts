"use server";

import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { resend } from "@/lib/resend";
import { CreateServerFunctions } from "./serverFunctions";


export const { get_doctors, get_appointments, create_appointment, notify } = CreateServerFunctions({ auth, pool, resend });

setInterval(async () => {
    notify();
}, 1000 * 60 * 60);
