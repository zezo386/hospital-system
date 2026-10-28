"use client";

import { signIn } from "next-auth/react"

export default function SignInBtn({ provider } : { provider: string}) {
    return (
        <button
            onClick={() => signIn(provider, { redirectTo: "/dashboard" })}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
            Sign in with {provider}
        </button>
    )
}