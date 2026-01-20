"use client";

import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { getRepoData, getNewURL, parseRepoSearchValue } from "@/lib/helper";
import { useSetAtom } from "jotai";
import {
    isSearchErrorAtom,
    ownerAtom,
    repoNameAtom,
    searchInputValue,
    selectedRepoURLAtom,
} from "@/lib/store";
import { useRouter } from "next/navigation";
import { SearchResultsUI } from "./search-results";
import { SearchInputUI } from "./search-input";
import { useSession } from "next-auth/react";

const DEFAULT_OWNER = "Hi there, lets get started!";
const DEFAULT_REPO_NAME = "View Github Release Statistics";

export function SearchUI() {
    const setSearchValue = useSetAtom(searchInputValue);
    const setIsSearchError = useSetAtom(isSearchErrorAtom);
    const setOwner = useSetAtom(ownerAtom);
    const setRepoName = useSetAtom(repoNameAtom);
    const setSelectedRepoURL = useSetAtom(selectedRepoURLAtom);
    const router = useRouter();
    const { data: session } = useSession();

    const handleSearch = useCallback(
        async (value: string) => {
            setIsSearchError(false);

            if (!value.trim()) {
                setOwner(DEFAULT_OWNER);
                setRepoName(DEFAULT_REPO_NAME);
                setSelectedRepoURL("");
                setSearchValue("");
                const newURL = getNewURL();
                router.push(newURL);
                return;
            }

            const { owner, repo } = parseRepoSearchValue(value);
            if (!owner || !repo) {
                toast.error("Please enter a valid GitHub repository URL.");
                setIsSearchError(true);
                return;
            }

            const { error } = await getRepoData(
                owner,
                repo,
                true,
                session?.accessToken,
            );
            if (!error) {
                setRepoName(repo);
                setOwner(owner);
                const newURL = getNewURL(owner, repo);
                router.push(newURL);
            } else setIsSearchError(true);
        },
        [
            setSelectedRepoURL,
            router,
            setIsSearchError,
            setOwner,
            setRepoName,
            setSearchValue,
            session,
        ],
    );

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const ownerParam = urlParams.get("owner");
        const repoParam = urlParams.get("repo");
        if (ownerParam && repoParam) {
            setSearchValue(`${ownerParam}/${repoParam}`);
            handleSearch(`${ownerParam}/${repoParam}`);
        }
    }, [handleSearch, setSearchValue]);

    return (
        <section className="flex-1 flex flex-col justify-center items-start max-w-5xl w-full mx-auto p-3 py-24">
            <SearchInputUI handleSearch={handleSearch} />
            <SearchResultsUI handleSearch={handleSearch} />
        </section>
    );
}
