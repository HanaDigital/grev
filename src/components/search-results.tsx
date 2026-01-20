"use client";

import {
    BookmarkedRepoAtomT,
    bookmarkedReposAtom,
    isLoadingDataAtom,
    repoFiltersAtom,
    repoReleasesAtom,
    RepoReleasesAtomT,
    searchInputValue,
    selectedRepoURLAtom,
} from "@/lib/store";
import { RepoReleaseT } from "@/lib/types";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
    AnimatePresence,
    motion,
    Transition,
    type Variants,
} from "motion/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AnimatedNumber } from "./ui/animated-number";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import {
    BookmarkIcon,
    BugIcon,
    FilterIcon,
    GhostIcon,
    PlusIcon,
    RotateCwIcon,
    SearchIcon,
    StarIcon,
} from "lucide-react";
import { getRepoData } from "@/lib/helper";
import { toast } from "sonner";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import {
    Dialog,
    DialogDescription,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "./ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useSession } from "next-auth/react";

dayjs.extend(relativeTime);

const resultVariants: Variants = {
    initial: {
        height: 0,
        opacity: 0,
        y: 50,
    },
    animate: {
        height: "fit-content",
        opacity: 1,
        y: 0,
    },
    exit: {
        height: 0,
        opacity: 0,
        y: 50,
    },
};

type SearchResultsUIProps = {
    handleSearch: (value: string) => void;
};
export function SearchResultsUI({ handleSearch }: SearchResultsUIProps) {
    const selectedRepoURL = useAtomValue(selectedRepoURLAtom);
    const repoReleases = useAtomValue(repoReleasesAtom);
    const isLoadingData = useAtomValue(isLoadingDataAtom);
    const [selectedRepoReleases, setSelectedRepoReleases] =
        useState<RepoReleasesAtomT>();
    const [bookmarkedRepos, setBookmarkedRepos] = useAtom(bookmarkedReposAtom);
    const [filteredBookmarkedRepos, setFilteredBookmarkedRepos] = useState<
        BookmarkedRepoAtomT[]
    >([]);
    const setSearchValue = useSetAtom(searchInputValue);
    const [selectedRepoReleaseIndex, setSelectedRepoReleaseIndex] = useState(0);
    const [cacheTimeFromNow, setCacheTimeFromNow] = useState("");
    const { data: session } = useSession();

    useEffect(() => {
        setFilteredBookmarkedRepos(Object.values(bookmarkedRepos));
    }, [bookmarkedRepos]);

    useEffect(() => {
        const handleChange = () => {
            if (!selectedRepoURL) {
                setSelectedRepoReleaseIndex(0);
                setSelectedRepoReleases(undefined);
                return;
            }
            const foundRepoReleases = repoReleases.find(
                (r) => r.url === selectedRepoURL,
            );
            if (!foundRepoReleases) {
                setSelectedRepoReleaseIndex(0);
                setSelectedRepoReleases(undefined);
                return;
            }
            setSelectedRepoReleases(foundRepoReleases);
        };
        handleChange();
    }, [selectedRepoURL, repoReleases]);

    useEffect(() => {
        const id = setInterval(() => {
            if (!selectedRepoReleases) return setCacheTimeFromNow("");
            setCacheTimeFromNow(
                dayjs(selectedRepoReleases.updatedOn).fromNow(),
            );
        }, 1000);

        return () => clearInterval(id);
    }, [selectedRepoReleases]);

    const handleReloadCache = async () => {
        if (!selectedRepoURL) return;
        const [owner, repoName] = selectedRepoURL.split("/");
        const { error } = await getRepoData(
            owner,
            repoName,
            false,
            session?.accessToken,
        );
        if (error) toast.error(error);
        else setCacheTimeFromNow(dayjs().fromNow());
    };

    const handleSearchBookmarkedRepos = (value: string) => {
        const filtered = Object.values(bookmarkedRepos).filter((repo) => {
            const repoURL = `${repo.owner}/${repo.repoName}`.toLowerCase();
            return repoURL.includes(value.toLowerCase());
        });
        setFilteredBookmarkedRepos(filtered);
    };

    const handleRemoveBookmark = (repoURL: string) => {
        setBookmarkedRepos((prev) => {
            const newBookmarks = { ...prev };
            delete newBookmarks[repoURL];
            return newBookmarks;
        });
    };

    return (
        <AnimatePresence>
            {!selectedRepoReleases && !!Object.keys(bookmarkedRepos).length && (
                <motion.div
                    key="bookmarkedReposContainer"
                    className="flex flex-col w-full gap-4 max-h-96 overflow-hidden"
                    variants={resultVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <div className="flex items-center justify-between gap-1 mb-1 max-h-96 overflow-hidden px-6">
                        <h2 className="text-lg font-semibold flex items-center gap-1 flex-1 text-nowrap">
                            <BookmarkIcon className="w-4" />
                            Bookmarked Repositories
                        </h2>
                        <div className="flex gap-2">
                            <Input
                                className="p-1! h-fit text-xs w-xs! px-2!"
                                placeholder="Search Bookmarks..."
                                onChange={(e) =>
                                    handleSearchBookmarkedRepos(e.target.value)
                                }
                            />
                            <Button
                                className=""
                                size="icon-sm"
                                variant="secondary"
                                onClick={() => {}}
                            >
                                <SearchIcon />
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 overflow-auto px-6">
                        <AnimatePresence>
                            {filteredBookmarkedRepos.map((repo) => {
                                const repoURL = `${repo.owner}/${repo.repoName}`;
                                return (
                                    <motion.div
                                        className="flex gap-2 w-full items-center"
                                        key={repoURL}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 50 }}
                                    >
                                        <Button
                                            variant="outline"
                                            className="justify-start flex-1"
                                            onClick={() => {
                                                setSearchValue(repoURL);
                                                handleSearch(repoURL);
                                            }}
                                        >
                                            {repo.owner}/{repo.repoName}
                                        </Button>
                                        <Button
                                            size="icon-sm"
                                            variant="secondary"
                                            onClick={() =>
                                                handleRemoveBookmark(repoURL)
                                            }
                                        >
                                            <StarIcon className="fill-blue-500" />
                                        </Button>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
            {selectedRepoReleases && !!selectedRepoReleases.data.length && (
                <motion.div
                    key="repoStatsContainer"
                    className="flex flex-col w-full gap-1 px-6"
                    variants={resultVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleReloadCache}
                            disabled={isLoadingData}
                        >
                            {isLoadingData ? <Spinner /> : <RotateCwIcon />}
                            Cache updated {cacheTimeFromNow}
                        </Button>
                        <FiltersDialogUI repoReleases={selectedRepoReleases} />
                    </div>
                    <div className="flex gap-4 flex-wrap">
                        <RepoReleasesCardUI
                            repoReleases={selectedRepoReleases}
                            selectedRepoReleaseIndex={selectedRepoReleaseIndex}
                            setSelectedRepoReleaseIndex={
                                setSelectedRepoReleaseIndex
                            }
                        />
                        <RepoReleaseCardUI
                            repoUrl={selectedRepoReleases.url}
                            repoRelease={
                                selectedRepoReleases.data[
                                    selectedRepoReleaseIndex
                                ]
                            }
                        />
                        <RepoReleasesGraphCardUI
                            repoReleases={selectedRepoReleases}
                        />
                    </div>
                </motion.div>
            )}
            {selectedRepoReleases && !selectedRepoReleases.data.length && (
                <motion.div
                    key="noStatsContainer"
                    className="flex flex-col w-full px-6"
                    variants={resultVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <Empty className="p-0!">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <GhostIcon />
                            </EmptyMedia>
                            <EmptyTitle>No Releases Found</EmptyTitle>
                            <EmptyDescription>
                                Try publishing a release first or report this is
                                as a bug.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <div className="flex gap-2">
                                <Button asChild>
                                    <a
                                        href={`https://github.com/${selectedRepoURL}/releases/new`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <PlusIcon /> Create a Release
                                    </a>
                                </Button>
                                <Button variant="outline" asChild>
                                    <a
                                        href="https://github.com/HanaDigital/grev/issues/new"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <BugIcon /> Report a Bug
                                    </a>
                                </Button>
                            </div>
                        </EmptyContent>
                    </Empty>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

type RepoReleasesCardUIProps = {
    repoReleases: RepoReleasesAtomT;
    selectedRepoReleaseIndex: number;
    setSelectedRepoReleaseIndex: Dispatch<SetStateAction<number>>;
};
function RepoReleasesCardUI({
    repoReleases,
    selectedRepoReleaseIndex,
    setSelectedRepoReleaseIndex,
}: RepoReleasesCardUIProps) {
    const repoFilters = useAtomValue(repoFiltersAtom);
    const repoFilter = repoFilters[repoReleases.url];

    const releasesInfo = repoReleases.data.map((r) => ({
        id: r.id,
        name: r.name,
        downloads: (repoFilter?.isEnabled && !!repoFilter?.assetFilterRegex
            ? r.assets.filter((a) => {
                  const isValid = new RegExp(repoFilter.assetFilterRegex).test(
                      a.name,
                  );
                  return repoFilter.isWhitelist ? isValid : !isValid;
              })
            : r.assets
        ).reduce((total, a) => (total += a.download_count), 0),
    }));
    const totalDownloads = releasesInfo.reduce(
        (total, r) => (total += r.downloads),
        0,
    );

    return (
        <div className="w-full lg:flex-1 rounded-lg border bg-card flex flex-col max-h-96 overflow-hidden">
            <div className="flex flex-col gap-4 p-4">
                <p className="font-bold">
                    Total Downloads{" "}
                    {repoFilter?.isEnabled && <Badge>Filtered</Badge>}
                </p>
                <div className="flex items-end">
                    <AnimatedNumber
                        className="inline-flex items-center font-mono text-6xl font-black text-primary"
                        springOptions={{
                            bounce: 0,
                            duration: 2000,
                        }}
                        value={totalDownloads}
                    />
                    <span className="font-light text-sm mb-2 mx-0.5">/</span>
                    <span className="font-light text-sm mb-2">downloads</span>
                </div>
            </div>
            <div className="flex flex-col overflow-y-auto p-4 mb-4">
                {releasesInfo.map((release, i) => (
                    <div
                        key={release.id}
                        className={`flex items-center justify-between gap-4 p-2 rounded-md font-medium cursor-pointer ${i === selectedRepoReleaseIndex ? "bg-primary text-white" : "hover:bg-muted"}`}
                        onClick={() => setSelectedRepoReleaseIndex(i)}
                    >
                        <p className="truncate flex-1">{release.name}</p>
                        <p className="font-mono">
                            {release.downloads.toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

type RepoReleaseCardUIProps = {
    repoUrl: string;
    repoRelease: RepoReleaseT;
};
function RepoReleaseCardUI({ repoUrl, repoRelease }: RepoReleaseCardUIProps) {
    const repoFilters = useAtomValue(repoFiltersAtom);
    const repoFilter = repoFilters[repoUrl];

    const totalDownloads = (
        repoFilter?.isEnabled && !!repoFilter?.assetFilterRegex
            ? repoRelease.assets.filter((a) => {
                  const isValid = new RegExp(repoFilter.assetFilterRegex).test(
                      a.name,
                  );
                  return repoFilter.isWhitelist ? isValid : !isValid;
              })
            : repoRelease.assets
    ).reduce((total, a) => (total += a.download_count), 0);

    return (
        <div className="flex-1 rounded-lg border bg-card flex flex-col max-h-96 overflow-hidden">
            <div className="flex flex-col gap-4 p-4">
                <p className="font-bold">
                    {repoRelease.name}{" "}
                    {repoFilter?.isEnabled && <Badge>Filtered</Badge>}
                </p>
                <div className="flex items-end">
                    <AnimatedNumber
                        className="inline-flex items-center font-mono text-6xl font-black text-primary"
                        springOptions={{
                            bounce: 0,
                            duration: 2000,
                        }}
                        value={totalDownloads}
                    />
                    <span className="font-light text-sm mb-2 mx-0.5">/</span>
                    <span className="font-light text-sm mb-2">downloads</span>
                </div>
            </div>
            <div className="flex flex-col overflow-y-auto p-4 mb-4">
                {repoRelease.assets.map((asset) => {
                    const isIncluded = repoFilter?.isEnabled
                        ? (() => {
                              const isValid = new RegExp(
                                  repoFilter.assetFilterRegex,
                              ).test(asset.name);
                              return repoFilter.isWhitelist
                                  ? isValid
                                  : !isValid;
                          })()
                        : true;

                    return (
                        <div
                            key={asset.id}
                            className={`flex items-center justify-between gap-4 p-2 rounded-md font-medium relative hover:bg-muted ${isIncluded ? "" : "opacity-50"}`}
                        >
                            {!isIncluded && (
                                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 rounded-full bg-muted-foreground"></div>
                            )}
                            <p className="truncate flex-1">{asset.name}</p>
                            <p className="font-mono">
                                {asset.download_count.toLocaleString()}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const chartConfig = {
    downloads: {
        label: "Downloads",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;
type RepoReleasesGraphCardUIProps = {
    repoReleases: RepoReleasesAtomT;
};
function RepoReleasesGraphCardUI({
    repoReleases,
}: RepoReleasesGraphCardUIProps) {
    const repoFilters = useAtomValue(repoFiltersAtom);
    const repoFilter = repoFilters[repoReleases.url];
    const chartData = repoReleases.data
        .map((release) => ({
            name: release.name,
            downloads: release.assets.reduce(
                (total, a) => (total += a.download_count),
                0,
            ),
        }))
        .reverse();
    return (
        <div className="w-full rounded-lg border bg-card flex flex-col max-h-96 overflow-hidden">
            <div className="flex flex-col gap-4 p-4">
                <p className="font-bold">
                    Release Downloads Chart{" "}
                    {repoFilter?.isEnabled && <Badge>Filtered</Badge>}
                </p>
            </div>
            <div className="flex flex-col overflow-x-auto p-4 mb-4">
                <ChartContainer
                    config={chartConfig}
                    className="h-64"
                    // height={256}
                >
                    <AreaChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={true}
                            axisLine={false}
                            tickMargin={8}
                            interval="preserveStartEnd"
                            // ticks={chartTicks}
                            // tickFormatter={(value) => value.slice(0, 3)}
                            // textAnchor="start"
                            // hide
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Area
                            dataKey="downloads"
                            type="natural"
                            fill="var(--chart-1)"
                            fillOpacity={0.4}
                            stroke="var(--chart-1)"
                        />
                    </AreaChart>
                </ChartContainer>
            </div>
        </div>
    );
}

const filterVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.95,
        y: 40,
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 40,
    },
};
const filterTransition: Transition = {
    type: "spring",
    bounce: 0,
    duration: 0.25,
};
type FiltersDialogUIProps = {
    repoReleases: RepoReleasesAtomT;
};
function FiltersDialogUI({ repoReleases }: FiltersDialogUIProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [repoFilters, setRepoFilters] = useAtom(repoFiltersAtom);
    const repoFilter = repoFilters[repoReleases.url];
    const [isFiltersEnabled, setIsFiltersEnabled] = useState(false);
    const [regexFilter, setRegexFilter] = useState("");
    const [isWhitelist, setIsWhitelist] = useState(false);

    useEffect(() => {
        if (repoFilter) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsFiltersEnabled(repoFilter.isEnabled);
            setRegexFilter(repoFilter.assetFilterRegex);
            setIsWhitelist(repoFilter.isWhitelist);
        } else {
            setIsFiltersEnabled(false);
            setRegexFilter("");
            setIsWhitelist(false);
        }
    }, [repoFilter, isOpen]);

    // create a set of asset names from the repo releases
    const assetNamesSet: Set<string> = new Set();
    repoReleases.data.forEach((release) => {
        release.assets.forEach((asset) => {
            assetNamesSet.add(asset.name);
        });
    });
    const assetNames = Array.from(assetNamesSet);

    let acceptedNames: string[] = [];
    const rejectedNames: string[] = [];
    if (isFiltersEnabled) {
        if (regexFilter) {
            let regex: RegExp;
            try {
                regex = new RegExp(regexFilter);
            } catch (e) {
                regex = /.^/; // Matches nothing
            }
            assetNames.forEach((name) => {
                if (regex.test(name)) {
                    if (isWhitelist) acceptedNames.push(name);
                    else rejectedNames.push(name);
                } else {
                    if (isWhitelist) rejectedNames.push(name);
                    else acceptedNames.push(name);
                }
            });
        } else {
            acceptedNames = assetNames;
        }
    }

    const handleSaveFilters = () => {
        setRepoFilters((prev) => {
            const newFilters = { ...prev };
            newFilters[repoReleases.url] = {
                isEnabled: isFiltersEnabled,
                assetFilterRegex: regexFilter,
                isWhitelist: isWhitelist,
            };
            return newFilters;
        });
        setIsOpen(false);
    };

    return (
        <Dialog
            variants={filterVariants}
            transition={filterTransition}
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogTrigger
                variant={repoFilter?.isEnabled ? "default" : "outline"}
                size="sm"
            >
                <FilterIcon /> Filters
            </DialogTrigger>
            <DialogContent className="w-full max-w-lg p-4">
                <DialogHeader className="flex flex-col">
                    <DialogTitle className="mb-0">Filters</DialogTitle>
                    <DialogDescription>
                        Adjust how the statistics are calculated.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 mt-6">
                    <div className="flex gap-2">
                        <Label>Enable Filters</Label>
                        <Switch
                            checked={isFiltersEnabled}
                            onCheckedChange={setIsFiltersEnabled}
                        />
                    </div>
                    <div
                        className={`flex flex-col gap-1 ${!isFiltersEnabled ? "opacity-50" : ""}`}
                    >
                        <Label htmlFor="filterAssets">
                            Filter Assets (regex)
                        </Label>
                        <Input
                            id="filterAssets"
                            type="search"
                            placeholder="random_file_.*?.exe"
                            value={regexFilter}
                            onChange={(e) => setRegexFilter(e.target.value)}
                            disabled={!isFiltersEnabled}
                        />
                        <div className="flex items-center gap-1">
                            <Switch
                                checked={isWhitelist}
                                onCheckedChange={setIsWhitelist}
                                disabled={!isFiltersEnabled}
                            />{" "}
                            <span className="text-sm">
                                {isWhitelist ? "Whitelist" : "Blacklist"}
                            </span>
                        </div>
                        <div className="flex gap-2 w-full">
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-medium mt-2">
                                    Accepted Assets ({acceptedNames.length})
                                </p>
                                <div className="max-h-24 overflow-y-auto overflow-x-hidden rounded-md border bg-card p-2 text-sm">
                                    {acceptedNames.length ? (
                                        acceptedNames.map((name) => (
                                            <div
                                                key={name}
                                                className="truncate"
                                            >
                                                {name}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-muted-foreground">
                                            No accepted assets
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-medium mt-2">
                                    Rejected Assets ({rejectedNames.length})
                                </p>
                                <div className="max-h-24 overflow-y-auto overflow-x-hidden rounded-md border bg-card p-2 text-sm">
                                    {rejectedNames.length ? (
                                        rejectedNames.map((name) => (
                                            <div
                                                key={name}
                                                className="truncate"
                                            >
                                                {name}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-muted-foreground">
                                            No rejected assets
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button onClick={handleSaveFilters}>Save</Button>
                </div>
                <DialogClose />
            </DialogContent>
        </Dialog>
    );
}
