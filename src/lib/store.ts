"use client";

import { atom, createStore } from "jotai";
import { ApiRateLimitT, RepoReleaseT } from "./types";
import { atomWithStorage } from "jotai/utils";

export const store = createStore();

export const searchInputValue = atom("");
export const isSearchErrorAtom = atom(false);

export const DEFAULT_OWNER = "Hi there, let's get started!";
export const DEFAULT_REPO_NAME = "View Github Release Statistics";
export const ownerAtom = atom(DEFAULT_OWNER);
export const repoNameAtom = atom(DEFAULT_REPO_NAME);

export const selectedRepoURLAtom = atom<string>();

export const githubApiRateLimitAtom = atom<ApiRateLimitT>();

export type RepoReleasesAtomT = {
    url: string;
    updatedOn: string;
    data: RepoReleaseT[];
};
export const repoReleasesAtom = atomWithStorage<RepoReleasesAtomT[]>(
    "repoReleases",
    [],
);

export type RepoFilterAtomT = {
    isEnabled: boolean;
    assetFilterRegex: string;
    isWhitelist: boolean;
};
export const repoFiltersAtom = atomWithStorage<{
    [key: string]: RepoFilterAtomT;
}>("repoFilters", {});

export type BookmarkedRepoAtomT = { owner: string; repoName: string };
export const bookmarkedReposAtom = atomWithStorage<{
    [key: string]: BookmarkedRepoAtomT;
}>("bookmarkedRepos", {});

export const isLoadingDataAtom = atom(false);
