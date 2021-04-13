import { Component, OnInit } from "@angular/core";
import fetch from "cross-fetch";
import { AngularFireAnalytics } from "@angular/fire/analytics";
import { Meta } from "@angular/platform-browser";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
	title: string = "View github release statistics.";
	url: string;

	cachedRepos = [];

	json = [];

	nameLength: number = 34;

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

	constructor(analytics: AngularFireAnalytics, private meta: Meta) {
		analytics.logEvent("Page Loaded!");
		setInterval(() => {
			if (!this.blink) {
				this.blinker = "|";
				return;
			}
			if (this.blinker) {
				this.blinker = "";
			} else {
				this.blinker = "|";
			}
		}, 500);

		// localStorage.clear();
		this.loadRepos();
	}

	ngOnInit() {
		this.meta.addTags(
			[
				{
					prefix: "og: http://ogp.me/ns#",
					property: "og:site_name",
					content: "GREV",
				},
				{
					prefix: "og: http://ogp.me/ns#",
					property: "og:title",
					content: "Github Release Viewer",
				},
				{
					prefix: "og: http://ogp.me/ns#",
					property: "og:description",
					content:
						"View statistics such as download count for your github releases.",
				},
				{
					prefix: "og: http://ogp.me/ns#",
					property: "og:image",
					content: "https://i.imgur.com/M9BylwW.png",
				},
				{
					prefix: "og: http://ogp.me/ns#",
					property: "og:url",
					content: "https://hanadigital.github.io/grev/",
				},
				{ property: "og:site_name", content: "GREV" },
				{ property: "og:title", content: "Github Release Viewer" },
				{
					property: "og:description",
					content:
						"View statistics such as download count for your github releases.",
				},
				{
					property: "og:image",
					content: "https://i.imgur.com/M9BylwW.png",
				},
				{
					property: "og:url",
					content: "https://hanadigital.github.io/grev/",
				},
				{ name: "og:site_name", content: "GREV" },
				{ name: "og:title", content: "Github Release Viewer" },
				{
					name: "og:description",
					content:
						"View statistics such as download count for your github releases.",
				},
				{
					name: "og:image",
					content: "https://i.imgur.com/M9BylwW.png",
				},
				{
					name: "og:url",
					content: "https://hanadigital.github.io/grev/",
				},
			],
			true
		);

		let url = new URL(window.location.href);
		let user = url.searchParams.get("user");
		let repo = url.searchParams.get("repo");
		if (user || repo) {
			this.url = user + "/" + repo;
			this.search();
		}
	}

	search(): void {
		const localURL = this.url;
		this.showError = false;
		this.showStats = false;
		this.wipe();

		const url =
			window.location.protocol +
			"//" +
			window.location.host +
			window.location.pathname;

		if (!this.url) {
			this.showError = false;
			this.showRepos = true;
			this.changeTitle("View github release statistics.");
			this.bannerHover = false;
			this.errorMsg = "";
			window.history.pushState({ path: url }, "", url);
			return;
		}

		const urlArray: string[] = localURL.replace("https://", "").split("/");

		if (!this.url.includes("github.com/") && urlArray.length !== 2) {
			setTimeout(() => {
				this.errorReset("Not a github URL");
			}, 0);
			return;
		}

		const username: string = urlArray[urlArray.length - 2];
		const repo: string = urlArray[urlArray.length - 1];
		const id: string = username.toLowerCase() + "/" + repo.toLowerCase();

		if (!username || !repo) {
			setTimeout(() => {
				this.errorReset("Invalid URL");
			}, 0);
			return;
		}

		var newURL = url + "?user=" + username + "&repo=" + repo;
		window.history.pushState({ path: newURL }, "", newURL);

		this.bannerHover = true;
		this.showRepos = false;

		this.getStats(id, repo, localURL);
	}

	async getStats(id: string, repo: string, localURL: string): Promise<void> {
		for (let i = 1; i < 10; i++) {
			let stop = false;
			let apiURL = `https://api.github.com/repos/${id}/releases?page=${i}&per_page=100`;
			console.log(apiURL);

			await fetch(apiURL)
				.then((res) => res.json())
				.then((json) => {
					this.json = [...this.json, ...json];
					if (json.length === 0 && this.json.length > 0) {
						stop = true;
						return;
					} else if (json.message === "Not Found") {
						this.errorReset("Invalid repository");
						return;
					} else if (json.length === 0) {
						this.errorReset(
							"This repository does not have any releases"
						);
						return;
					}
					console.log(`page: ${i}`);
				});

			if (stop) {
				this.changeTitle(repo);
				this.getLatestUsers();
				this.getTotalDownloads();
				this.showStats = true;

				this.cacheRepo({ id: id, name: repo, url: localURL });
				this.loadRepos();
				break;
			}
		}
	}

	getLatestUsers(): void {
		this.latestAssets = this.json[0].assets;
		for (let i = 0; i < this.latestAssets.length; i++) {
			this.totalLatestUsers += this.latestAssets[i].download_count;
		}
	}

	getTotalDownloads(): void {
		for (let i = 0; i < this.json.length; i++) {
			let assets = this.json[i].assets;
			let name: string = this.json[i].name ?? this.json[i].tag_name;
			var downloads: number = 0;
			for (let x = 0; x < assets.length; x++) {
				downloads += assets[x].download_count;
			}
			this.totalDownloads += downloads;
			if (name.length > this.nameLength)
				name = name.slice(0, this.nameLength) + "...";
			this.releases.push({ name: name, downloads: downloads });
		}
	}

	async changeTitle(name) {
		const titleText = "View github release statistics.";
		if (this.title === titleText && name === titleText) {
			return;
		}
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
		return new Promise((resolve) => setTimeout(resolve, ms));
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
		if (next === null) {
			next = "one";
			localStorage.setItem("next", next);
		}

		if (
			(localStorage.getItem("one") &&
				JSON.parse(localStorage.getItem("one")).id === repoObj.id) ||
			(localStorage.getItem("two") &&
				JSON.parse(localStorage.getItem("two")).id === repoObj.id) ||
			(localStorage.getItem("three") &&
				JSON.parse(localStorage.getItem("three")).id === repoObj.id)
		) {
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
		if (one !== null) {
			this.cachedRepos.push(JSON.parse(one));
		}
		if (two !== null) {
			this.cachedRepos.push(JSON.parse(two));
		}
		if (three !== null) {
			this.cachedRepos.push(JSON.parse(three));
		}
	}

	loadClickedRepo(repoURL) {
		this.url = repoURL;
		this.search();
	}
}
