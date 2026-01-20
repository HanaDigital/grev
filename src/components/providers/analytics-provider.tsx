"use client";

import { analytics } from "@/lib/firebase";
import { PropsWithChildren, useEffect } from "react";

export default function AnalyticsProvider({ children }: PropsWithChildren) {
    useEffect(() => {
        if (analytics)
            console.log(`Analytics active for app: ${analytics?.app.name}`);
    }, []);
    return <>{children}</>;
}
