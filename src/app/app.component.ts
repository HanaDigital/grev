import { Component } from '@angular/core';
import fetch from 'cross-fetch';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title: string = "View github release statistics.";
  url: string;

  cachedRepos = [];

  json;

  latestAssets;
  totalLatestUsers: number = 0;

  releases = [];
  totalDownloads: number = 0;

  bannerHover: boolean = false;
  blink: boolean = true;
  blinker: string = "";

  showStats: boolean = false;
  showRepos: boolean = true;
  showError: boolean = false;
  errorMsg: string;

  constructor() {
    setInterval(() => {
      if (!this.blink) {
        this.blinker = "|";
        return;
      }
      if (this.blinker) { this.blinker = "" }
      else { this.blinker = "|" }
    }, 500);

    this.loadRepos();
  }

  search() {
    const localURL = this.url;
    this.showError = false;
    this.showStats = false;
    this.wipe();

    if (!this.url) {
      this.showError = false;
      this.showRepos = true;
      this.changeTitle("View github release statistics.");
      this.bannerHover = false;
      this.errorMsg = "";
      return;
    }

    if (!this.url.includes("github.com/")) {
      setTimeout(() => {
        this.errorReset("Not a github URL");
      }, 0);
      return;
    }
    const urlArray: string[] = this.url.replace("https://", "").split("/");
    const username: string = urlArray[1];
    const repo: string = urlArray[2];

    if (!username || !repo) {
      setTimeout(() => {
        this.errorReset("Invalid URL");
      }, 0);
      return;
    }

    this.bannerHover = true;
    this.showRepos = false;

    const apiURL = "https://api.github.com/repos/" + username + "/" + repo + "/releases";

    fetch(apiURL)
      .then(res => res.json())
      .then(json => {
        if (json.message === "Not Found") {
          this.errorReset("Invalid repository")
          return;
        } else if (json.length === 0) {
          this.errorReset("This repository does not have any releases")
          return;
        }
        this.json = json;
        this.changeTitle(repo);
        this.getLatestUsers();
        this.getTotalDownloads();
        this.showStats = true;

        this.cacheRepo({ name: repo, url: localURL });
        this.loadRepos();
      });
  }

  getLatestUsers() {
    this.latestAssets = this.json[0].assets;
    for (let i = 0; i < this.latestAssets.length; i++) {
      this.totalLatestUsers += this.latestAssets[i].download_count;
    }
  }

  getTotalDownloads() {
    for (let i = 0; i < this.json.length; i++) {
      let assets = this.json[i].assets;
      let name = this.json[i].name;
      var downloads: number = 0;
      for (let x = 0; x < assets.length; x++) {
        downloads += assets[x].download_count;
      }
      this.totalDownloads += downloads;
      this.releases.push({ name: name, downloads: downloads });
    }
  }

  async changeTitle(name) {
    const titleText = "View github release statistics.";
    if (this.title === titleText && name === titleText) { return; }
    this.blink = false;
    for (let i = this.title.length - 1; i >= 0; i--) {
      this.title = this.title.slice(0, i);
      await this.sleep(30);
    }

    for (let i = 0; i <= name.length; i++) {
      this.title = name.slice(0, i);
      await this.sleep(40);
    }
    this.blink = true;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  wipe() {
    this.json = [];

    this.latestAssets = [];
    this.totalLatestUsers = 0;

    this.releases = [];
    this.totalDownloads = 0;
  }

  errorReset(error: string) {
    this.errorMsg = error;
    this.showError = true;
    this.showRepos = true;
    this.changeTitle("View github release statistics.");
    this.bannerHover = false;
  }

  cacheRepo(repoObj) {
    let next = localStorage.getItem("next");
    console.log(next);
    if (next === null) {
      next = "one";
      localStorage.setItem("next", next);
    }

    if (JSON.parse(localStorage.getItem("one")).url.toLowerCase() === repoObj.url.toLowerCase()
      || JSON.parse(localStorage.getItem("two")).url.toLowerCase() === repoObj.url.toLowerCase()
      || JSON.parse(localStorage.getItem("three")).url.toLowerCase() === repoObj.url.toLowerCase()) {
      return;
    }

    switch (next) {
      case "one":
        localStorage.setItem(next, JSON.stringify(repoObj));
        localStorage.setItem("next", "two");
        break;
      case "two":
        localStorage.setItem(next, JSON.stringify(repoObj));
        localStorage.setItem("next", "three");
        break;
      case "three":
        localStorage.setItem(next, JSON.stringify(repoObj));
        localStorage.setItem("next", "one");
        break;
    }
  }

  loadRepos() {
    let one = localStorage.getItem("one");
    let two = localStorage.getItem("two");
    let three = localStorage.getItem("three");
    this.cachedRepos = [];
    if (one !== null) { this.cachedRepos.push(JSON.parse(one)); }
    if (two !== null) { this.cachedRepos.push(JSON.parse(two)); }
    if (three !== null) { this.cachedRepos.push(JSON.parse(three)); }
  }

  loadClickedRepo(repoURL) {
    this.url = repoURL;
    this.search();
  }
}
