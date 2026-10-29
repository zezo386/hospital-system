"use server";

import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { resend } from "@/lib/resend";
import { CreateServerFunctions } from "./serverFunctions";


export const { get_doctors, get_appointments, create_appointment } = CreateServerFunctions({ auth, pool, resend });