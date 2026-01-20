"use client";

import { analytics } from "@/lib/firebase";
import { PropsWithChildren } from "react";

export default function AnalyticsProvider({ children }: PropsWithChildren) {
    console.log(`Analytics active for app: ${analytics.app.name}`);
    return <>{children}</>;
}
