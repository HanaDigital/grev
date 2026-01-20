import { motion, AnimatePresence } from "motion/react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import {
    AlertTriangleIcon,
    ChevronDownIcon,
    CircleAlertIcon,
    InfoIcon,
    RotateCcwIcon,
} from "lucide-react";
import { Label } from "./ui/label";
import { useCallback, useEffect, useState } from "react";
import { getGithubClient } from "@/lib/helper";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { Skeleton } from "./ui/skeleton";
import { useAtom, useAtomValue } from "jotai";
import { githubApiRateLimitAtom, isLoadingDataAtom } from "@/lib/store";
import { useSession } from "next-auth/react";

export default function RateLimitButtonUI() {
    const [apiRateLimits, setApiRateLimits] = useAtom(githubApiRateLimitAtom);
    const isLoadingData = useAtomValue(isLoadingDataAtom);
    const [isLoadingApiRateLimits, setIsLoadingApiRateLimits] = useState(false);
    const { data: session, status } = useSession();

    const getApiRateLimits = useCallback(async () => {
        setIsLoadingApiRateLimits(true);
        try {
            const client = getGithubClient(session?.accessToken);
            const res = await client.rest.rateLimit.get();
            const rate = res.data.rate;
            setApiRateLimits({
                limit: rate.limit,
                remaining: rate.remaining,
                reset: rate.reset,
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch api rate limits!");
        }
        setIsLoadingApiRateLimits(false);
    }, [setApiRateLimits, session]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        getApiRateLimits();
    }, [getApiRateLimits]);

    const remainingRateLimitPercentage = apiRateLimits
        ? (apiRateLimits.remaining / apiRateLimits.limit) * 100
        : 100;
    const apiRateLimitStatus =
        remainingRateLimitPercentage > 20
            ? "Good"
            : remainingRateLimitPercentage > 0
              ? "Low"
              : "Empty";
    return (
        <AnimatePresence>
            {!apiRateLimits && isLoadingApiRateLimits && (
                <Skeleton className="w-52 h-7" />
            )}
            {apiRateLimits && (
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                >
                    <Popover>
                        <PopoverTrigger asChild className="w-fit">
                            <Button
                                variant="link"
                                className="flex items-center gap-1 text-sm font-semibold text-muted-foreground underline-offset-4 p-0! h-auto"
                            >
                                {apiRateLimitStatus === "Good" ? (
                                    <InfoIcon className="w-4" />
                                ) : apiRateLimitStatus === "Low" ? (
                                    <CircleAlertIcon className="stroke-amber-600 w-4" />
                                ) : (
                                    <AlertTriangleIcon className="stroke-destructive w-4" />
                                )}
                                <p>Github API Usage Stats</p>
                                <ChevronDownIcon className="w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-sm flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <h4 className="leading-none font-medium relative">
                                    Usage Statistics
                                    <Button
                                        size="icon-sm"
                                        variant="ghost"
                                        className="absolute -top-2 right-0"
                                        onClick={getApiRateLimits}
                                        disabled={
                                            isLoadingApiRateLimits ||
                                            isLoadingData
                                        }
                                    >
                                        {isLoadingApiRateLimits ? (
                                            <Spinner />
                                        ) : (
                                            <RotateCcwIcon />
                                        )}
                                    </Button>
                                </h4>
                                <p className="text-muted-foreground text-sm pr-5">
                                    The amount of requests you can make to the
                                    github api.
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-4">
                                    <Label className="w-32">Max Requests</Label>
                                    <p>{apiRateLimits.limit}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="w-32">
                                        Remaining Requests
                                    </Label>
                                    <p
                                        className={`flex gap-1 items-center ${apiRateLimitStatus === "Low" ? "text-amber-600" : apiRateLimitStatus === "Empty" ? "text-destructive" : ""}`}
                                    >
                                        {apiRateLimits.remaining}{" "}
                                        {apiRateLimitStatus === "Low" && (
                                            <>
                                                <CircleAlertIcon className="stroke-amber-600 w-4 animate-pulse" />
                                                {status !== "authenticated" && (
                                                    <span className="text-sm text-amber-600">
                                                        Consider logging in.
                                                    </span>
                                                )}
                                            </>
                                        )}
                                        {apiRateLimitStatus === "Empty" && (
                                            <>
                                                <AlertTriangleIcon className="stroke-destructive w-4 animate-pulse" />
                                                {status !== "authenticated" && (
                                                    <span className="text-sm text-amber-600">
                                                        Consider logging in.
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="w-32">
                                        Limit Reset On
                                    </Label>
                                    <p>
                                        {new Date(apiRateLimits.reset * 1000)
                                            .toLocaleString()
                                            .replace(",", " |")}
                                    </p>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
