# HUD Web Archive Viewer

This project provides a simple web application to view WACZ (Web ARChiveZip) files using the [replayweb.page](https://replayweb.page/) library. Its primary purpose is to host static web archives that can be used as stable testing environments for browser-based AI agents, particularly those developed with the [HUD SDK](https://github.com/hud-evals/hud-sdk).

## Features

*   Displays WACZ files directly in the browser.
*   Uses clean URLs for accessing different archives (e.g., `/my-archive` loads `archives/my-archive.wacz`).
*   Supports a `?page=<url-encoded-page-in-archive>` query parameter to open a specific page within an archive.
*   Supports a `?debug=true` query parameter to show the full `replayweb.page` UI for debugging.
*   Archives can have a default `startPage` defined in `archives/archive_list.json`.
*   Includes a GitHub Actions workflow for easy deployment to GitHub Pages, making archives web-accessible.

## Using Archives with the HUD SDK

Web archives provide consistent, offline-first environments for testing web-based agents. Once this `page-archives` repository is deployed to GitHub Pages (see [GitHub Pages Deployment](#github-pages-deployment) section below), the archived sites become accessible via stable URLs.

You can then use these URLs in your `hud-sdk` tasks. For example, if you have an archive named `my-test-site` deployed here, it might be accessible at `https://hud-evals.github.io/page-archives/my-test-site`. If this archive contains a page `https://originalsite.com/login.html`, its archived version would be loaded by `replayweb.page` at that URL.

Here's how you might use it in a `hud.Task`:

```python
from hud.task import Task

login_task = Task(
    prompt="Log into the website using username 'testuser' and password 'password123'.",
    gym="hud-browser", # Or your relevant browser-based gym
    setup=(
        "goto", 
        "https://hud-evals.github.io/page-archives/my-test-site
    ),
    evaluate=(
        "page_contains", 
        "Welcome, testuser!"
    )
)

# You can then run this task with your agent:
# from hud import run_job, YourAgent
# await run_job(YourAgent, [login_task], "my-archived-site-login-test")
```

This allows you to create reliable test scenarios for your agents against specific, unchanging versions of web pages.

## How to Create Web Archives (WACZ files)

To create the `.wacz` files that this viewer uses, you can use the [ArchiveWeb.page](https://archiveweb.page/) browser extension or desktop application. It allows you to interactively capture websites as you browse.

*   **Full Guide:** For detailed instructions on creating archives, please refer to the official [ArchiveWeb.page User Guide](https://archiveweb.page/guide).
*   **Basic Steps with ArchiveWeb.page extension:**
    1.  Install the [ArchiveWeb.page extension](https://chrome.google.com/webstore/detail/archivewebpage/hcljodaidirhcnllmjbconnllaibbfdp) (Chromium-based browsers).
    2.  Open the extension and create a new collection.
    3.  Start an archiving session.
    4.  Browse the web pages you want to capture.
    5.  Stop the session.
    6.  Download your collection. It will typically download as a `.wacz` file.

For automated, large-scale crawling, consider [Browsertrix](https://github.com/webrecorder/browsertrix-crawler).

## Adding Your Archives

1.  **Place WACZ Files:**
    *   Put your `.wacz` files into the `archives/` directory.
    *   For example, if your archive is named `my-cool-site.wacz`, place it in `archives/my-cool-site.wacz`.
2.  **Update `archives/archive_list.json`:**
    *   This file provides a list of your archives for the homepage and can define a default starting page for each.
    *   Edit `archives/archive_list.json` and add an entry for each of your archives. The `name` field **must** match the WACZ filename without the `.wacz` extension.
    *   **Example `archives/archive_list.json` entry:**
        ```json
        {
            "archives": [
                {
                    "name": "my-cool-site",
                    "displayName": "My Cool Site Archive",
                    "startPage": "https://my-cool-site.com/index.html" // Optional: URL of start page within this WACZ
                },
                {
                    "name": "another-one",
                    "displayName": "Another Great Archive"
                    // No startPage, will use archive's default
                }
                // ... other archives
            ]
        }
        ```
    *   The `displayName` is what appears in the list on the homepage.
    *   The `startPage` is optional. If provided, accessing `/my-cool-site` will attempt to open this specific page from the archive. If omitted (or if a `?page=` URL parameter is used), the archive's default page or the `?page=` parameter will be used.

## Local Development Setup

1.  **Prerequisites:**
    *   [Node.js and npm](https://nodejs.org/) installed.
2.  **Clone the repository:**
    ```bash
    git clone https://github.com/hud-evals/page-archives.git
    cd page-archives
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start an Express.js server (usually at `http://localhost:3000`) that handles the clean URLs.

## Viewing Archives Locally

*   **Homepage (List of Archives):** `http://localhost:3000/`
*   **Specific Archive (using its default or `startPage`):** `http://localhost:3000/my-cool-site`
*   **Specific Page within an Archive:** `http://localhost:3000/my-cool-site?page=https%3A%2F%2Fmy-cool-site.com%2Fspecific-article.html` (ensure the page URL is URL-encoded).
*   **Debug Mode (shows ReplayWeb.page UI):** `http://localhost:3000/my-cool-site?debug=true`

Enjoy creating and viewing your web archives for robust agent testing!