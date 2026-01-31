import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ComponentProps, ReactNode } from "react";

type TooltipUIProps = {
    asChild?: boolean;
    side?: "top" | "right" | "bottom" | "left";
    children?: ReactNode;
    text?: ReactNode;
} & ComponentProps<typeof Tooltip>;
export function TooltipUI({
    asChild = false,
    side = "top",
    children,
    text,
    ...props
}: TooltipUIProps) {
    return (
        <Tooltip {...props}>
            <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
            <TooltipContent side={side}>{text}</TooltipContent>
        </Tooltip>
    );
}
