"use client";
import NewAppointmentPopup from "./newAppointmentPopup";
import React, { useState } from "react";

export default function NewAppointmentBtn({ doctors } : { doctors: { id: string; name: string }[] }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
            >
                New Appointment
            </button>
            <NewAppointmentPopup open={isOpen} onClose={() => setIsOpen(false)} doctors={doctors} />
        </div>
    );
}