import { FC, MouseEventHandler } from "react";

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchReleaseObj(url: string): Promise<ReleaseObj[] | undefined> {
  return await fetch(url).then<ReleaseObj[]>((response) => {
    if (response.ok) return response.json();
    throw response;
  }).catch(error => {
    console.error(error);
    return undefined;
  })
}

export function updateURL(repoOwner: string, repoName: string | undefined) {
  const newURL = `${window.location.protocol}//${window.location.host}/grev/?user=${repoOwner}&repo=${repoName ? repoName : ""}`;
  // eslint-disable-next-line no-restricted-globals
  history.pushState({ path: newURL }, '', newURL);
}

export function resetURL() {
  const newURL = `${window.location.protocol}//${window.location.host}/grev/`;
  // eslint-disable-next-line no-restricted-globals
  history.pushState({ path: newURL }, '', newURL);
}

export function parseTextLength(text: string, len = 29) {
  return text.length > len ? text.slice(0, len) + "..." : text;
}

export const ArrowIcon = () => {
  return (
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 60.47 58.46" xmlSpace="preserve">
      <path
        fill="#fff"
        d="M59.58,27.08l-2.78-2.78L33.39,0.89c-1.19-1.19-3.11-1.19-4.3,0l-2.78,2.78c-1.19,1.19-1.19,3.11,0,4.3
	l16.27,16.27H3.04C1.36,24.23,0,25.59,0,27.27v3.92c0,1.68,1.36,3.04,3.04,3.04h39.55L26.32,50.5c-1.19,1.19-1.19,3.11,0,4.3
	l2.78,2.78c1.19,1.19,3.11,1.19,4.3,0l23.42-23.42l2.78-2.78C60.77,30.19,60.77,28.27,59.58,27.08z"
      />
    </svg>
  );
};

export const GithubStarIcon = ({ size = 16 }) => {
  return (
    <svg
      aria-hidden="true"
      width={size} height={size}
      viewBox="0 0 16 16"
      version="1.1"
      data-view-component="true"
    >
      <path
        fillRule="evenodd"
        d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
      ></path>
    </svg>
  );
};

export const GithubFilledStarIcon = ({ size = 16 }) => {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 16 16" version="1.1" data-view-component="true">
      <path fillRule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path>
    </svg>
  );
};

export const GithubForkIcon = () => {
  return (
    <svg
      aria-hidden="true"
      height="16"
      viewBox="0 0 16 16"
      version="1.1"
      width="16"
      data-view-component="true"
    >
      <path
        fill="#696969"
        fillRule="evenodd"
        d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
      ></path>
    </svg>
  );
};

export const GithubIssueIcon = () => {
  return (
    <svg
      aria-hidden="true"
      height="16"
      viewBox="0 0 16 16"
      version="1.1"
      width="16"
      data-view-component="true"
    >
      <path fill="#696969" d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
      <path
        fill="#696969"
        fillRule="evenodd"
        d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
      ></path>
    </svg>
  );
};

export const BookmarkIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
      width="24" height="24"
      viewBox="0 0 24 24"
    >
      <path d="M 6 2 C 4.8444444 2 4 2.9666667 4 4 L 4 22.039062 L 12 19.066406 L 20 22.039062 L 20 20.599609 L 20 4 C 20 3.4777778 19.808671 2.9453899 19.431641 2.5683594 C 19.05461 2.1913289 18.522222 2 18 2 L 6 2 z M 6 4 L 18 4 L 18 19.162109 L 12 16.933594 L 6 19.162109 L 6 4 z"></path>
    </svg>
  );
};

export const CloseIcon: FC<{ resetState: MouseEventHandler<SVGSVGElement>, width: number, height: number }> =
  ({ resetState, width, height }) => {
    return (
      <svg
        onClick={resetState}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={width}
        height={height}
        className="closeIcon"
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path
          fill="#ce3a3a"
          d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
        />
      </svg>
    );
  };

export type parsedSearchObj = {
  owner: string | undefined;
  repo: string | undefined;
};

export interface RepoObj {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: OwnerObj;
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  forks_count: number;
  mirror_url: string | null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: LicenseObj | null;
  allow_forking: boolean;
  is_template: boolean;
  topics: string[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
}

interface OwnerObj {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

interface LicenseObj {
  key: string;
  name: string;
  spdx_id: string;
  url: string;
  node_id: string;
}

export interface ReleaseObj {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: Author;
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: Asset[];
  tarball_url: string;
  zipball_url: string;
  body: string;
  reactions: Reactions;
  mentions_count: number;
}

interface Reactions {
  url: string;
  total_count: number;
  "+1": number;
  "-1": number;
  laugh: number;
  hooray: number;
  confused: number;
  heart: number;
  rocket: number;
  eyes: number;
}

interface Asset {
  url: string;
  id: number;
  node_id: string;
  name: string;
  label: string;
  uploader: Author;
  content_type: string;
  state: string;
  size: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  browser_download_url: string;
}

interface Author {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface statsObj {
  repoOwner: string;
  repoName: string;
  totalDownloads: number;
  releases: releaseObj[];
}

export interface releaseObj {
  releaseName: string;
  releaseTotalDownloads: number;
  releaseAssets: releaseAssetsObj[];
}

export interface releaseAssetsObj {
  assetName: string;
  assetDownloads: number;
}

export interface bookmarkedReposObj {
  owner: string;
  name: string;
}
