"use server";

import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function get_doctors() {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
        redirect("/login");
    }

    const doctors = await pool.query(
        `SELECT id, name FROM users WHERE role = 'doctor'`
    );

    return doctors.rows;
}

export async function get_appointments(){
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
        redirect("/login");
    }

    if (user.role === "doctor"){
        const appointments = await pool.query(
            `SELECT a.*, u.name AS patient_name FROM appointments a JOIN users u ON u.id = a.patient_id WHERE a.doctor_id = $1 ORDER BY a.appointment_date_start ASC;`,
            [user.id]
        );

        return appointments.rows;
    }

    const appointments = await pool.query(
        `
        SELECT
        a.*,
        u.name AS doctor_name
        FROM appointments a
        JOIN users u ON u.id = a.doctor_id
        WHERE a.patient_id = $1
        ORDER BY a.appointment_date_start ASC;
        `,
        [user.id]
    );

    return appointments.rows;
}

export async function create_appointment(
    doctor_id: string,
    start_date: string,
    end_date: string,
    title: string
  ) {
    const session = await auth();
    const user = session?.user;
  
    if (!user?.id) redirect("/login");
  
    if (user.role !== "patient") {
      throw new Error("Only patients can create appointments.");
    }
  
    if (new Date(start_date).getTime() >= new Date(end_date).getTime()) {
      throw new Error("End time must be after start time.");
    }
  
    const { rowCount } = await pool.query(
      `INSERT INTO appointments (doctor_id, patient_id, appointment_date_start, appointment_date_end, title)
       SELECT $1, $2, $3::timestamptz, $4::timestamptz, $5
       WHERE NOT EXISTS (
         SELECT 1 FROM appointments a
         WHERE a.doctor_id = $1
           AND a.appointment_date_start::timestamptz < $4::timestamptz
           AND $3::timestamptz < a.appointment_date_end::timestamptz
       )`,
      [doctor_id, user.id, start_date, end_date, title]
    );
  
    if (rowCount === 0) {
      throw new Error("This time slot overlaps an existing appointment for this doctor.");
    }
  
    revalidatePath("/dashboard");
  }