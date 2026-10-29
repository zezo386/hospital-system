"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { Pool } from "pg";
interface ActionDependencies {
    auth : () => Promise<any>;
    pool : Pool;
    resend: Resend;
}

export function CreateServerFunctions({ auth, pool, resend}: ActionDependencies) {
        
    async function get_doctors() {
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

    async function get_appointments(){
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

    async function create_appointment(
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

    async function notify(){
        const peopleToNotify = await pool.query(
            `SELECT DISTINCT u.email FROM users u JOIN appointments a ON u.id = a.patient_id WHERE a.appointment_date_start < NOW() + INTERVAL '5 hours' AND a.appointment_date_start > NOW() AND a.notified = false`
        );

        await pool.query(
            `UPDATE appointments SET notified = true WHERE appointment_date_start < NOW() + INTERVAL '5 hours' AND appointment_date_start > NOW() AND notified = false`
        )

        for (let user of peopleToNotify.rows) {
            resend.emails.send({
                to: user.email,
                from: "Hospital test <onboarding@resend.dev>",
                subject: "Upcoming Appointment Reminder",
                html: `<p>Dear ${user.name},</p>`
            })
        }
    }

    return {
        get_doctors,
        get_appointments,
        create_appointment,
        notify
    }
}