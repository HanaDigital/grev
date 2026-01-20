"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { GithubIcon } from "lucide-react";
import { Spinner } from "./ui/spinner";

export default function LoginUI() {
    const { data: session, status } = useSession();

    return (
        <Button
            variant="outline"
            onClick={() =>
                status === "authenticated" ? signOut() : signIn("github")
            }
            disabled={status === "loading"}
        >
            <GithubIcon />
            {status === "authenticated" ? (
                "Log Out"
            ) : status === "unauthenticated" ? (
                "Log In"
            ) : (
                <Spinner />
            )}
        </Button>
    );
}
