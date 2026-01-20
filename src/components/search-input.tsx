"use client";

import { ArrowRightIcon, StarIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { TextEffect } from "./ui/text-effect";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { GlowEffect } from "./ui/glow-effect";
import RateLimitButtonUI from "./rate-limit-button";
import { formatRepoURL } from "@/lib/helper";
import { useAtom, useAtomValue } from "jotai";
import {
    bookmarkedReposAtom,
    DEFAULT_OWNER,
    DEFAULT_REPO_NAME,
    isLoadingDataAtom,
    isSearchErrorAtom,
    ownerAtom,
    repoNameAtom,
    searchInputValue,
} from "@/lib/store";
import { Spinner } from "./ui/spinner";

type SearchInputUIProps = {
    handleSearch: (value: string) => void;
};
export function SearchInputUI({ handleSearch }: SearchInputUIProps) {
    const [searchValue, setSearchValue] = useAtom(searchInputValue);
    const [isSearchError, setIsSearchError] = useAtom(isSearchErrorAtom);
    const owner = useAtomValue(ownerAtom);
    const repoName = useAtomValue(repoNameAtom);
    const isRepoLoaded =
        owner !== DEFAULT_OWNER && repoName !== DEFAULT_REPO_NAME;
    const isLoadingData = useAtomValue(isLoadingDataAtom);

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col">
                <TextEffect
                    key={owner}
                    per="char"
                    preset="fade"
                    className="text-muted-foreground font-teko tracking-wide text-2xl"
                >
                    {owner}
                </TextEffect>
                <TextEffect
                    key={repoName}
                    per="char"
                    preset="fade"
                    className="text-5xl font-bold -mt-1.5"
                >
                    {repoName}
                </TextEffect>
            </div>

            <div className="flex flex-col gap-1 mb-12">
                <motion.div
                    className="flex gap-1 items-center"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <BookmarkButtonUI
                        owner={owner}
                        repoName={repoName}
                        isLoadingData={isLoadingData}
                    />
                    <div className="relative flex-1">
                        <motion.div
                            className="pointer-events-none absolute inset-0"
                            animate={{
                                opacity: isSearchError ? 1 : 0,
                            }}
                            transition={{
                                duration: 0.2,
                                ease: "easeOut",
                            }}
                        >
                            <GlowEffect
                                colors={["#FF2E54", "#FF0000"]}
                                mode="pulse"
                                blur="softest"
                                duration={4}
                            />
                        </motion.div>
                        <Input
                            placeholder="https://github.com/owner/repository"
                            className="relative text-2xl! h-auto p-4 w-full border-2 bg-white placeholder:opacity-50 shadow-none! ring-0!"
                            autoComplete="off"
                            type="url"
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                                setIsSearchError(false);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter")
                                    handleSearch(searchValue);
                            }}
                            disabled={isLoadingData}
                        />
                        <AnimatePresence>
                            {isRepoLoaded && (
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    className="absolute bottom-[calc(100%-2px)] right-2"
                                >
                                    <Button
                                        variant="secondary"
                                        className="text-xs rounded-b-none py-1! h-fit gap-0.5"
                                        size="sm"
                                        onClick={() => handleSearch("")}
                                    >
                                        <XIcon className="w-3! mt-px" />
                                        Clear
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <Button
                        className="text-2xl! h-auto aspect-square!"
                        onClick={() => handleSearch(searchValue)}
                        size="lg"
                        disabled={isLoadingData}
                    >
                        {isLoadingData ? (
                            <Spinner className="w-8 h-8" />
                        ) : (
                            <ArrowRightIcon className="w-8! h-8!" />
                        )}
                    </Button>
                </motion.div>

                <RateLimitButtonUI />
            </div>
        </div>
    );
}

type BookmarkButtonUIProps = {
    owner: string;
    repoName: string;
    isLoadingData: boolean;
};
function BookmarkButtonUI({
    owner,
    repoName,
    isLoadingData,
}: BookmarkButtonUIProps) {
    const repoURL = formatRepoURL(owner, repoName);
    const [repoBookmarks, setRepoBookmarks] = useAtom(bookmarkedReposAtom);
    const isBookmarked = !!repoBookmarks[repoURL];

    const handleSetBookmark = () => {
        if (isBookmarked) {
            setRepoBookmarks((prev) => {
                const updated = { ...prev };
                delete updated[repoURL];
                return updated;
            });
            toast.success(`Removed bookmark for ${owner}/${repoName}`);
        } else {
            setRepoBookmarks((prev) => ({
                ...prev,
                [repoURL]: { owner, repoName },
            }));
            toast.success(`Bookmarked ${owner}/${repoName}`);
        }
    };

    return (
        <AnimatePresence>
            {owner !== DEFAULT_OWNER && repoName !== DEFAULT_REPO_NAME && (
                <motion.div
                    className="h-fit"
                    initial={{ width: 0 }}
                    animate={{ width: "auto" }}
                    exit={{ width: 0 }}
                    transition={{
                        duration: 0.2,
                        ease: "easeOut",
                    }}
                >
                    <Button
                        className="text-2xl! h-full p-6 border-primary"
                        onClick={handleSetBookmark}
                        size="lg"
                        disabled={isLoadingData}
                        variant="secondary"
                    >
                        <StarIcon
                            className={`${isBookmarked ? "fill-primary" : ""}`}
                        />
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
