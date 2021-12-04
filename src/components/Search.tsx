import { FC, useEffect, useRef, useState } from "react";
import "../sass/Search.scss";
import {
  parsedSearchObj,
  sleep,
  RepoObj,
  CloseIcon,
  ReleaseObj,
  statsObj,
  releaseAssetsObj,
  fetchReleaseObj,
  ArrowIcon,
  updateURL,
  resetURL,
  parseTextLength,
  bookmarkedReposObj,
  GithubFilledStarIcon,
  GithubStarIcon,
} from "../lib";
import RepoCard from "./RepoCard";
import RepoStats from "./RepoStats";

const Search: FC<{ setShowReadMe: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setShowReadMe }) => {
  const searchBarRef = useRef<HTMLInputElement>(null);

  const defaultOwner = "GITHUB RELEASE VIEWER";
  const defaultName = "View github release statistics.";
  const [owner, setOwner] = useState(defaultOwner);
  const [repo, setRepo] = useState(defaultName);

  const [repoList, setRepoList] = useState<RepoObj[]>();

  // Input
  const [searchInput, setSearchInput] = useState("");

  // UI state
  const [isUIDisabled, setIsUIDisabled] = useState(false);
  const [isDataShown, setIsDataShown] = useState(false);
  const [isProfileShown, setIsProfileShown] = useState(false);
  const [isRepoShown, setIsRepoShown] = useState(false);
  const [isEmptyRepo, setIsEmptyRepo] = useState(false);
  const [isEmptyProfile, setIsEmptyProfile] = useState(false);
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [errorText, setErrorText] = useState("Something went wrong!");

  const [repoStats, setRepoStats] = useState<statsObj>({ repoOwner: "", repoName: "", totalDownloads: 0, releases: [] });

  const storageKey = "recentViews"
  const [bookmarkedRepos, setBookmarkedRepos] = useState<bookmarkedReposObj[]>([]);

  useEffect(() => {
    // Load path
    let variables = window.location.search;
    if (variables) {
      variables = variables.replace(/\?user=|repo=/g, "");
      const paths = variables.split("&");
      changeTitle(`${paths[0]}/${paths[1]}`);
    } else {
      const paths = window.location.pathname.split('/')
        .filter((path) => path !== "" && path !== "grev");
      if (paths.length !== 0) {
        if (paths.length === 1) changeTitle(paths[0]);
        else if (paths.length === 2) changeTitle(`${paths[0]}/${paths[1]}`);
        else failedLoadingState("Invalid URL!");
      }
    }

    // Load recently viewed repos
    const storage = localStorage.getItem(storageKey);
    if (storage) setBookmarkedRepos(JSON.parse(storage));

  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(bookmarkedRepos));
  }, [bookmarkedRepos]);

  // Parse user input
  const parseSearchInput = (tempSearch: string): parsedSearchObj => {
    if (tempSearch.length === 0) return { owner: undefined, repo: undefined };
    if (tempSearch.includes("https://"))
      tempSearch = tempSearch.replace("https://", "");
    if (tempSearch.includes("github.com/"))
      tempSearch = tempSearch.replace("github.com/", "");

    const tempList = tempSearch.split("/");
    if (tempList.length > 2) return { owner: undefined, repo: undefined };
    if (tempList.length === 2) return { owner: tempList[0], repo: tempList[1] };
    return { owner: tempList[0], repo: undefined };
  };

  // Animate change of repo name on the UI
  const changeRepoName = async (name: string) => {
    for (let i = 0; i < repo.length; i++) {
      await sleep(20);
      setRepo((name) => name.slice(0, name.length - 1));
    }
    for (let i = 0; i < name.length; i++) {
      setRepo(() => name.slice(0, i + 1));
      await sleep(20);
    }
  };

  // Hide & Disable UI
  const startLoadingState = () => {
    setIsUIDisabled(true);
    setIsDataShown(false);
    setIsProfileShown(false);
    setIsRepoShown(false);
    setIsEmptyRepo(false);
    setIsEmptyProfile(false);
    setIsErrorShown(false);
  };

  // Show & Enable UI
  const endLoadingState = () => {
    setIsDataShown(true);
    setIsUIDisabled(false);
    setIsErrorShown(false);
  };

  const failedLoadingState = (msg: string) => {
    setErrorText(msg);
    setIsDataShown(false);
    setIsUIDisabled(false);
    setIsErrorShown(true);
    document.title = "GREV"
    searchBarRef.current?.focus();
  };

  const resetState = () => {
    setSearchInput("");
    changeTitle("");
    document.title = "GREV"
    resetURL();
    searchBarRef.current?.focus();
  };

  const changeTitle = async (search: string) => {
    // Hide UI
    startLoadingState();

    if (search === "") {
      setOwner(defaultOwner);
      if (repo !== defaultName) changeRepoName(defaultName);
      setIsUIDisabled(false);
      return;
    }

    const parsedSearch = parseSearchInput(search);
    let repoOwner = parsedSearch.owner;
    let repoName = parsedSearch.repo;

    // Parse repo owner
    if (!repoOwner) {
      setOwner(defaultOwner);
      if (repo !== defaultName) changeRepoName(defaultName);
      failedLoadingState("Invalid username!");
      return;
    }
    setOwner(repoOwner);

    // Parse repo
    if (repoName) {
      setSearchInput(`${repoOwner}/${repoName}`);
      await changeRepoName(repoName);
    } else {
      setSearchInput(`${repoOwner}`);
      if (repo !== defaultName) await changeRepoName(defaultName);
    }

    if (repoName) await loadRepo(repoOwner, repoName);
    else await loadProfile(repoOwner);
  };

  // Load Owner's Repositories
  const loadProfile = async (repoOwner: string) => {
    setIsRepoShown(false);
    const url = `https://api.github.com/users/${repoOwner}/repos`;
    await fetch(url)
      .then((response) => {
        if (response.ok) return response.json();
        throw response;
      })
      .then((data) => {
        setRepoList(data as RepoObj[]);
        document.title = `GREV | ${repoOwner}`;
        updateURL(repoOwner, undefined);
        endLoadingState();
        if (data.length === 0) {
          setIsEmptyProfile(true);
          setIsDataShown(false);
          return;
        }
        setIsProfileShown(true);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        failedLoadingState("Invalid username!");
      });
  };

  // Load Repository Data
  const loadRepo = async (repoOwner: string, repoName: string) => {
    startLoadingState();

    let repoTempStats: statsObj = ({ repoOwner, repoName, totalDownloads: 0, releases: [] });

    let failed = false;
    let page = 1;
    for (let i = 0; i < 50; i++) {
      const url = `https://api.github.com/repos/${repoOwner}/${repoName}/releases?page=${page}&per_page=100`;

      let index = 0;
      let pageDownloadCount = 0;
      const data: ReleaseObj[] | undefined = await fetchReleaseObj(url);
      if (!data) {
        failedLoadingState("No repository found!");
        failed = true;
        break;
      }
      for (const release of data) {
        index++;
        let currDownloadCount = 0;
        let assets: releaseAssetsObj[] = [];
        for (const asset of release.assets) {
          currDownloadCount += asset.download_count;
          assets.push({ assetName: asset.name, assetDownloads: asset.download_count })
        }
        pageDownloadCount += currDownloadCount;

        repoTempStats.releases.push({
          releaseName: release.name,
          releaseTotalDownloads: currDownloadCount,
          releaseAssets: assets
        })
      }

      repoTempStats.totalDownloads += pageDownloadCount;
      if (index < 100 || failed) break;
      page++;
    }

    if (failed) return;

    document.title = `GREV | ${repoName}`;
    updateURL(repoOwner, repoName);
    endLoadingState();

    if (repoTempStats.releases.length === 0) {
      setIsEmptyRepo(true);
      setIsDataShown(false);
      return;
    }

    setRepoStats(repoTempStats);
    setIsRepoShown(true);
  };

  const bookmarkRepo = () => {
    const bookmark = isRepoBookmarked();
    if (bookmark) {
      setBookmarkedRepos(state => state.filter(stateRepo =>
        stateRepo.owner !== owner.toLowerCase()
        && stateRepo.name !== repo.toLowerCase())
      );
      return;
    }
    setBookmarkedRepos(state => [{ name: repo.toLowerCase(), owner: owner.toLowerCase() }, ...state]);
    if (bookmarkedRepos.length > 6) setBookmarkedRepos(state => state.slice(0, 6));
  }

  const isRepoBookmarked = () => {
    return bookmarkedRepos.find(bookedRepo =>
      bookedRepo.owner === owner.toLowerCase()
      && bookedRepo.name === repo.toLowerCase()
    );
  }

  return (
    <section className="Search">
      {/* Owner & Repo Heading */}
      <div className="repoTitle">
        <p
          className={`repoOwner ${owner !== defaultOwner ? "clickable" : ""}`}
          onClick={() => owner !== defaultOwner ? changeTitle(owner) : ""}
        >{parseTextLength(owner)}</p>
        <h1 className="repoName">{parseTextLength(repo, 31)}</h1>
      </div>

      <div className="repoSearch">
        <button
          className={`bookmark ${isRepoShown ? "showBookmark" : ""} ${isRepoBookmarked() ? "isBookmarked" : ""}`}
          onClick={() => bookmarkRepo()}
        >
          {
            isRepoBookmarked()
              ? <GithubFilledStarIcon size={28} />
              : <GithubStarIcon size={28} />
          }
        </button>
        <div className="repoSearchBarWrapper">
          {/* Search Bar */}
          <input
            type="text"
            className={`repoSearchBar ${isUIDisabled ? "disabledBar" : ""} ${isErrorShown ? "searchError" : ""}`}
            spellCheck="false"
            autoFocus
            placeholder="github.com/user/repo"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" ? changeTitle(searchInput) : null
            }
            disabled={isUIDisabled}
            ref={searchBarRef}
          />
          {!isUIDisabled && searchInput !== "" && <CloseIcon width={24} height={24} resetState={resetState} />}
        </div>
        {/* Search Button */}
        <button
          className={`repoSearchButton ${isUIDisabled ? "disabledButton" : ""}`}
          onClick={() => changeTitle(searchInput)}
          disabled={isUIDisabled}
        >
          {!isUIDisabled && <ArrowIcon />}
          {isUIDisabled && <div className="loader"></div>}
        </button>

        {/* Error Text */}
        {!isDataShown &&
          <div className="infoUI">
            {
              !isUIDisabled &&
              !isErrorShown &&
              <p className="infoMsg infoHelp">New features & shortcuts! Learn <span onClick={() => setShowReadMe(true)}>how to use</span></p>
            }
            {
              isErrorShown &&
              <p className="infoMsg infoError">{errorText} Check <span onClick={() => setShowReadMe(true)}>how to use</span> guide.</p>
            }
            {
              isEmptyRepo &&
              <p className="infoMsg infoNotify">This repository has no releases.</p>
            }
            {
              isEmptyProfile &&
              <p className="infoMsg infoNotify">This user has no repositories.</p>
            }
            {
              !isUIDisabled &&
              bookmarkedRepos.length > 0 &&
              <div className="bookmarks">
                <h2>BOOKMARKS</h2>
                <div className="bookmarkWrapper">
                  {bookmarkedRepos.map(repo =>
                    <div
                      className="bookmarkedRepo"
                      key={`${repo.owner}/${repo.name}`}
                      onClick={() => changeTitle(`${repo.owner}/${repo.name}`)}
                    >
                      <p className="repoOwner">{parseTextLength(repo.owner, 20)}</p>
                      <h1 className="repoName">{parseTextLength(repo.name, 16)}</h1>
                    </div>
                  )}
                </div>
              </div>
            }
          </div>
        }
      </div>

      {/* Show Owner Profile */}
      <div
        className={`wrapper profileWrapper ${isProfileShown ? "wrapperOpen" : ""}`}
        style={{
          height:
            isProfileShown && repoList
              ? window.innerWidth > 887
                ? `${Math.ceil(repoList.length / 2) * 13.8}em`
                : `${Math.ceil(repoList.length / 2) * 27}em`
              : 0,
        }}
      >
        {isProfileShown && (
          <div className="view profile">
            {repoList?.map((repo) =>
              <RepoCard repo={repo} changeTitle={changeTitle} />)}
          </div>
        )}
      </div>

      {/* Show Repo Stats */}
      <div
        className={`wrapper repoWrapper ${isRepoShown ? "wrapperOpen" : ""}`}
        style={{ height: isRepoShown ? window.innerWidth > 820 ? "25em" : "52em" : "0" }}
      >
        {isRepoShown && !isEmptyRepo && <RepoStats isRepoShown={isRepoShown} stats={repoStats} />}
      </div>
    </section>
  );
};

export default Search;
