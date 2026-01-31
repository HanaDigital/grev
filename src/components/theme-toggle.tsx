"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { TooltipUI } from "./custom-ui/tooltip-ui";

export function ThemeToggleUI() {
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        if (theme !== "system") return;
        setTheme("light");
    }, [theme, setTheme]);

    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };

    return (
        <TooltipUI
            asChild
            text="Toggle theme"
            side="bottom"
            delayDuration={400}
        >
            <Button variant="outline" size="icon" onClick={toggleTheme}>
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        </TooltipUI>
    );
}
