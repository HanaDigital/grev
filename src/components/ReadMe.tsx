import { FC } from "react";
import { CloseIcon } from "../lib";
import "../sass/ReadMe.scss";
import shortURLImg from "../assets/guide/short_url.png";
import searchOwnerIMG from "../assets/guide/search_owner.png";
import bookmarkIMG from "../assets/guide/bookmark.png";
import bookmarksIMG from "../assets/guide/bookmarks.png";
import olderVersionsIMG from "../assets/guide/older_versions.png";

const ReadMe: FC<{ setShowReadMe: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setShowReadMe }) => {

    return (
        <div className="readMe" onClick={() => setShowReadMe(false)}>
            <div className="readMeWrapper" onClick={(e) => e.stopPropagation()}>
                <div className="control"></div>
                <h1>HOW TO GUIDE v2.0<div className="divider"></div><CloseIcon width={28} height={28} resetState={() => setShowReadMe(false)} /></h1>
                <p className="readMeDisc">These are some handy tip & tricks to help you use this tool more efficiently.</p>
                <div className="guides">

                    <div className="guide">
                        <h3>Short Search URL</h3>
                        <p>You don't need to type the whole github URL and can just type: 'owner/repo'</p>
                        <img src={shortURLImg} alt="Short URL" />
                    </div>

                    <div className="guide">
                        <h3>Search Owners</h3>
                        <p>You can search for a repository owner directly and get a list of their repositories.</p>
                        <img src={searchOwnerIMG} alt="Search Owner" />
                    </div>

                    <div className="guide">
                        <h3>Bookmarks</h3>
                        <p>You can now bookmark upto 6 repositories of your choice! Just visit any repository and click the star icon.</p>
                        <div className="imgs">
                            <img src={bookmarkIMG} alt="Bookmark button" />
                            <img src={bookmarksIMG} alt="Bookmarks" />
                        </div>
                    </div>

                    <div className="guide">
                        <h3>Older version statistics</h3>
                        <p>You can click on older versions of a repository to see their details.</p>
                        <div className="imgs">
                            <img src={olderVersionsIMG} alt="Older version" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReadMe;
