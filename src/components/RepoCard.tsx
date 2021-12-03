import { FC } from "react";
import "../sass/RepoCard.scss";
import {
    RepoObj,
    GithubStarIcon,
    GithubForkIcon,
    GithubIssueIcon,
} from "../lib";

const RepoCard: FC<{ repo: RepoObj, changeTitle: Function }> =
    ({ repo, changeTitle }) => {
        return (
            <div className="repoCard"
                key={repo.id}
                onClick={() => changeTitle(`${repo.owner.login}/${repo.name}`)}
            >
                <div className="repoInfo">
                    <h1>
                        {repo.name.length > 21
                            ? repo.name.slice(0, 22) + "..."
                            : repo.name}
                    </h1>
                    <p>
                        {repo.description && repo.description.length > 100
                            ? repo.description.slice(0, 101) + "..."
                            : repo.description}
                    </p>
                </div>
                <div className="repoData">
                    <div className="data stars">
                        <GithubStarIcon />
                        <p>{repo.stargazers_count}</p>
                    </div>
                    <div className="data forks">
                        <GithubForkIcon />
                        <p>{repo.forks_count}</p>
                    </div>
                    <div className="data issues">
                        <GithubIssueIcon />
                        <p>{repo.open_issues_count}</p>
                    </div>
                </div>
            </div>
        );
    };

export default RepoCard;
