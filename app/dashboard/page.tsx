import { Suspense } from "react";
import AppointmentsPage from "./_components/appointments";
import { auth } from "@/auth";

export default async function dashboard(){
    const session = await auth();

    return (
        <div className="flex flex-col items-center">
            <h1>Dashboard</h1>
            <Suspense fallback={<div>Loading appointments...</div>}>
                <AppointmentsPage role={session?.user?.role as string} />
            </Suspense>
        </div>
    );
}