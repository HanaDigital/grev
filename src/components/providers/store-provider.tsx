"use client";

import { store } from "@/lib/store";
import { Provider } from "jotai";
import { PropsWithChildren } from "react";

export const StoreProvider = ({ children }: PropsWithChildren) => {
    return <Provider store={store}>{children}</Provider>;
};
