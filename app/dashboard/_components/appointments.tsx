import Appointment from "./appointment";
import { get_appointments, get_doctors } from "../actions";
import NewAppointmentBtn from "./newAppointmentBtn";
import { auth } from "@/auth";

export default async function AppointmentsPage({ role } : { role : string }) {
    const appointments = await get_appointments();
    const doctors = await get_doctors();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Appointments</h1>
            {appointments.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
                appointments.map((appointment) => (
                    <Appointment
                        key={appointment.id}
                        is_doctor={role === "doctor"}
                        doctorName={appointment.doctor_name}
                        start_date={new Date(appointment.appointment_date_start)}
                        end_date={new Date(appointment.appointment_date_end)}
                        title={appointment.title}
                        patientName={appointment.patient_name}
                    />
                ))
            )}
            <NewAppointmentBtn doctors={doctors}/>
        </div>
    );
}
