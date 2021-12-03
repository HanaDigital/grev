import { FC, useState } from "react";
import { parseTextLength, releaseObj, statsObj } from "../lib";
import "../sass/RepoStats.scss";

const RepoStats: FC<{ isRepoShown: boolean, stats: statsObj }> = ({ isRepoShown, stats }) => {
    const [selectedRelease, setSelectedRelease] = useState<releaseObj>(stats.releases[0]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectRelease = (release: releaseObj, index: number) => {
        setSelectedRelease(release);
        setSelectedIndex(index);
    }

    return (
        <div className="view repoStats">
            <div
                className={`col leftCol ${isRepoShown ? "statsShown" : ""}`}
            >
                <h2>{selectedRelease.releaseName}</h2>
                <h1>{selectedRelease.releaseTotalDownloads}</h1>
                <div className="assets">
                    {selectedRelease.releaseAssets.map(asset =>
                        <div className="assetInfo" key={asset.assetName}>
                            <p>{parseTextLength(asset.assetName, 35)}</p>
                            <div className="divider"></div>
                            <p>{asset.assetDownloads}</p>
                        </div>
                    )}
                </div>
            </div>
            <div
                className={`col rightCol ${isRepoShown ? "statsShown" : ""}`}
            >
                <h2>Total Downloads</h2>
                <h1>{stats.totalDownloads}</h1>
                <div className="assets">
                    {stats.releases.map((release, index) =>
                        <div
                            className={`asset assetInfo ${index === selectedIndex ? "selectedAsset" : ""}`} key={release.releaseName}
                            onClick={() => selectRelease(release, index)}
                        >
                            <p>{
                                release.releaseName === ""
                                    ? "[UNKNOWN]"
                                    : parseTextLength(release.releaseName)
                            }</p>
                            <div className="divider"></div>
                            <p>{release.releaseTotalDownloads}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RepoStats;
