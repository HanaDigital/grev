"use client";

import { Octokit, RequestError } from "octokit";
import { throttling } from "@octokit/plugin-throttling";
import {
    githubApiRateLimitAtom,
    isLoadingDataAtom,
    repoReleasesAtom,
    selectedRepoURLAtom,
    store,
} from "./store";
import { ApiHeadersT, RepoReleaseAssetT, RepoReleaseT } from "./types";

export function getGithubClient(accessToken?: string) {
    const MyOctokit = Octokit.plugin(throttling);
    const client = new MyOctokit({
        userAgent: "grev/v2026.1",
        auth: accessToken ? accessToken : undefined,
        throttle: {
            onRateLimit: (retryAfter, options, octokit, retryCount) => {
                throw new RequestError("API Rate Limit Exceeded", 500, {
                    request: {
                        method: "GET",
                        url: options.url,
                        body: {},
                        headers: {},
                    },
                    response: {
                        status: 403,
                        url: options.url,
                        headers: {},
                        data: {
                            message: "API Rate Limit Exceeded",
                        },
                        retryCount,
                    },
                });
            },
            onSecondaryRateLimit: (
                retryAfter,
                options,
                octokit,
                retryCount,
            ) => {
                throw new RequestError("API Rate Limit Exceeded", 500, {
                    request: {
                        method: "GET",
                        url: options.url,
                        body: {},
                        headers: {},
                    },
                    response: {
                        status: 403,
                        url: options.url,
                        headers: {},
                        data: {
                            message: "API Rate Limit Exceeded",
                        },
                        retryCount,
                    },
                });
            },
        },
    });
    return client;
}

const ONE_HOUR = 60 * 60 * 1000;
export async function getRepoData(
    owner: string,
    repoName: string,
    loadFromCache: boolean,
    accessToken?: string,
) {
    if (store.get(isLoadingDataAtom))
        return { error: "A request is already in progress." };
    store.set(isLoadingDataAtom, true);

    try {
        const repoURL = formatRepoURL(owner, repoName);
        if (loadFromCache) {
            const repoReleases = store.get(repoReleasesAtom);
            const foundRepoReleases = repoReleases.find(
                (r) => r.url === repoURL,
            );
            if (foundRepoReleases && foundRepoReleases.data.length) {
                const now = new Date().getTime();
                const updatedOn = new Date(
                    foundRepoReleases.updatedOn,
                ).getTime();
                if (now - updatedOn <= ONE_HOUR) {
                    store.set(selectedRepoURLAtom, repoURL);
                    store.set(isLoadingDataAtom, false);
                    return { error: null };
                }
            }
        }

        const client = getGithubClient(accessToken);
        const releases: RepoReleaseT[] = [];
        const iterator = client.paginate.iterator(
            client.rest.repos.listReleases,
            {
                owner: owner,
                repo: repoName,
                per_page: 100,
            },
        );

        let apiHeaders: ApiHeadersT = {};
        for await (const res of iterator) {
            const headers = res.headers;
            apiHeaders = {
                limit: headers["x-ratelimit-limit"]!,
                remaining: headers["x-ratelimit-remaining"]!,
                reset: headers["x-ratelimit-reset"]!,
            };

            res.data.forEach((r) => {
                releases.push({
                    url: r.url,
                    id: r.id,
                    author: {
                        id: r.author.id,
                        avatar_url: r.author.avatar_url,
                        type: r.author.type,
                    },
                    tag_name: r.tag_name,
                    name: r.name,
                    draft: r.draft,
                    prerelease: r.prerelease,
                    created_at: r.created_at,
                    updated_at: r.updated_at,
                    published_at: r.published_at,
                    assets: r.assets.map(
                        (a) =>
                            ({
                                id: a.id,
                                name: a.name,
                                label: a.label,
                                content_type: a.content_type,
                                state: a.state,
                                size: a.size,
                                download_count: a.download_count,
                                created_at: a.created_at,
                                updated_at: a.updated_at,
                            }) satisfies RepoReleaseAssetT,
                    ),
                } satisfies RepoReleaseT);
            });
        }
        setApiRateLimitsFromHeaders(apiHeaders);
        setRepoReleases(owner, repoName, releases);
        store.set(selectedRepoURLAtom, repoURL);
        store.set(isLoadingDataAtom, false);
        return { error: null };
    } catch (error) {
        // if (loadFromCache) store.set(selectedRepoURLAtom, undefined);
        store.set(isLoadingDataAtom, false);
        if (error instanceof RequestError) {
            const headers = error.response?.headers;
            if (headers)
                setApiRateLimitsFromHeaders({
                    limit: headers["x-ratelimit-limit"]!,
                    remaining: headers["x-ratelimit-remaining"]!,
                    reset: headers["x-ratelimit-reset"]!,
                });

            if (error.status === 404)
                return { error: `Couldn't find ${owner}/${repoName}` };
            else if (
                (error.response?.data as { message: string }).message ===
                "Only the first 1000 results are available."
            ) {
                return {
                    error: `Couldn't load all releases${accessToken ? "" : ", try logging in with Github"}."`,
                };
            } else if (
                error.status === 403 &&
                (
                    error.response?.data as { message: string }
                ).message.startsWith("API rate limit exceeded")
            ) {
                return {
                    error: `Api rate limit exceeded, wait for some time${accessToken ? "" : " or try logging in with Github"}.`,
                };
            } else {
                console.error({ ...error });
                return {
                    error: "Something went wrong while fetching the request.",
                };
            }
        } else {
            console.error({ error });
            return {
                error: "Something went wrong while handling the request.",
            };
        }
    }
}

export function setApiRateLimitsFromHeaders(headers: ApiHeadersT) {
    store.set(githubApiRateLimitAtom, (prev) => {
        if (!prev) return prev;
        const newLimits = { ...prev };
        if (headers.limit) newLimits.limit = parseInt(headers.limit);
        if (headers.remaining)
            newLimits.remaining = parseInt(headers.remaining);
        if (headers.reset) newLimits.reset = parseInt(headers.reset);
        return newLimits;
    });
}

export function setRepoReleases(
    owner: string,
    repoName: string,
    releases: RepoReleaseT[],
) {
    const url = formatRepoURL(owner, repoName);
    store.set(repoReleasesAtom, (prev) => {
        let newRepoReleases = [...prev];
        newRepoReleases = newRepoReleases.filter((r) => r.url !== url);
        if (newRepoReleases.length >= 5) {
            newRepoReleases = newRepoReleases.slice(1);
        }
        newRepoReleases.push({
            url,
            updatedOn: new Date().toISOString(),
            data: releases,
        });
        return newRepoReleases;
    });
}

export function formatRepoURL(owner: string, repoName: string) {
    return `${owner.toLowerCase()}/${repoName.toLowerCase()}`;
}

export function getNewURL(owner?: string, repoName?: string) {
    if (!owner || !repoName) {
        return `${window.location.protocol}//${window.location.host}`;
    }
    return `${window.location.protocol}//${window.location.host}?owner=${owner}&repo=${repoName}`;
}

export const parseRepoSearchValue = (value: string) => {
    try {
        value = value.trim();
        if (value.length === 0) return { owner: undefined, repo: undefined };
        value = value.replace(/(https:\/\/)?(github.com\/)?/g, "");

        const tempList = value.split("/");
        if (tempList.length > 2) return { owner: undefined, repo: undefined };
        if (tempList.length === 2)
            return { owner: tempList[0], repo: tempList[1] };
        return { owner: tempList[0], repo: undefined };
    } catch (error) {
        console.error("Error parsing search value:", error);
        return { owner: undefined, repo: undefined };
    }
};
