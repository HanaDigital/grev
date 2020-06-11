import { Component } from '@angular/core';
import fetch from 'cross-fetch';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title: string = "View github release statistics.";
  url: string = "https://github.com/HanaDigital/NovelScraper";

  json: [];

  latestAssets: [];
  totalLatestUsers: number = 0;

  releases: [] = [];
  totalDownloads: number = 0;

  bannerHover: boolean = false;
  blink: boolean = true;
  blinker: string = "";

  constructor() {
    setInterval(() => {
      if (!this.blink) {
        this.blinker = "|";
        return;
      }
      if (this.blinker) { this.blinker = "" }
      else { this.blinker = "|" }
    }, 500)
  }

  search() {
    if (!this.url) { return; }

    if (!this.url.includes("github.com/")) {
      console.log("Error: Not a github URL.")
      return;
    }
    const urlArray: string[] = this.url.replace("https://", "").split("/");
    const username: string = urlArray[1];
    const repo: string = urlArray[2];

    if (!username || !repo) {
      console.log("Error: Invalid URL.")
      return;
    }

    this.wipe();
    this.changeTitle(repo);

    this.bannerHover = true;

    const apiURL = "https://api.github.com/repos/" + username + "/" + repo + "/releases";

    fetch(apiURL)
      .then(res => res.json())
      .then(json => {
        if (json.message === "Not Found") {
          console.log("Error: Invalid repository.");
          return;
        }
        this.json = json;
        this.getLatestUsers();
        this.getTotalDownloads();
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
      let downloads = 0;
      for (let x = 0; x < assets.length; x++) {
        downloads += assets[x].download_count;
      }
      this.totalDownloads += downloads;
      this.releases.push({ name: name, downloads: downloads });
    }
  }

  async changeTitle(name) {
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
}
