"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

export default function LoginUI() {
    const { data: session, status } = useSession();

    if (status === "authenticated") {
        return (
            <Button variant="outline" onClick={() => signOut()}>
                Log Out
            </Button>
        );
    } else if (status === "loading") {
        return <div>Loading...</div>;
    } else {
        return (
            <Button variant="outline" onClick={() => signIn("github")}>
                Log In
            </Button>
        );
    }
}
