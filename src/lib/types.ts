export type ApiRateLimitT = {
    limit: number;
    remaining: number;
    reset: number;
    usedInLastCall?: number;
};

export type RepoReleaseAssetT = {
    id: number;
    name: string;
    label: string | null;
    content_type: string;
    state: string;
    size: number;
    download_count: number;
    created_at: string;
    updated_at: string;
};

export type RepoReleaseT = {
    url: string;
    id: number;
    author: {
        id: number;
        avatar_url: string;
        type: string;
    };
    tag_name: string;
    name: string | null;
    draft: boolean;
    prerelease: boolean;
    created_at: string;
    updated_at: string | null | undefined;
    published_at: string | null;
    assets: RepoReleaseAssetT[];
};

export type ApiHeadersT = {
    limit?: string;
    remaining?: string;
    reset?: string;
};
