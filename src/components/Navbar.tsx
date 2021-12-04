import { FC, useState } from "react";
import "../sass/Navbar.scss";

const Navbar: FC = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  return (
    <nav className="Navbar">
      <h1 className="logo">
        <div className="navMenuButton" onClick={() => { setIsOpenMenu(state => !state) }}>
          <div className="navMenuIcon"></div>
        </div>
        <a className="logoIcon" href="/grev/">
          G<span>RE</span>V
        </a>
      </h1>

      <div className="links">
        <a
          href="https://github.com/HanaDigital/grev"
          target="_blank"
          rel="noreferrer"
        >
          <span>Star on </span>
          Github
        </a>
        <a
          href="https://github.com/HanaDigital/grev/issues/new"
          target="_blank"
          rel="noreferrer"
        >
          Bug Report
        </a>
        {/* TODO: Update donation link */}
        <a
          className="donate"
          href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=2W7DADSP9HKQ8&source=url"
          target="_blank"
          rel="noreferrer"
        >
          Donate
        </a>
      </div>
      {
        isOpenMenu &&
        <div className="menu">
          <a
            href="https://github.com/HanaDigital/grev"
            target="_blank"
            rel="noreferrer"
          >
            <span>Star on </span>
            Github
          </a>
          <a
            href="https://github.com/HanaDigital/grev/issues/new"
            target="_blank"
            rel="noreferrer"
          >
            Bug Report
          </a>
        </div>
      }
    </nav>
  );
};

export default Navbar;
