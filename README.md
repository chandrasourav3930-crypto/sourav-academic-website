# Sourav Chakraborty — Academic Website

Responsive multi-page academic portfolio with eight starter science posts, three featured publications, and separate Experience, Education, Research, Publications, and Contact pages. Blog cards and article pages are driven by `posts.json`, so the Pages CMS editor can add/edit posts without manually creating an HTML file for each post.

## Deploy free on GitHub Pages

1. Download and unzip this project.
2. In GitHub, create a **public** repository named exactly `YOUR-GITHUB-USERNAME.github.io`.
3. Upload the **contents** of the `sourav-academic-site` folder to the repository root. The root should contain `index.html`, `posts.json`, `.pages.yml`, and folders such as `assets/`.
4. Open repository **Settings → Pages**. Under Build and deployment, choose **Deploy from a branch**, select `main` and `/(root)`, then Save. GitHub Pages is available for public repositories on GitHub Free.
5. Wait for deployment, then visit `https://YOUR-GITHUB-USERNAME.github.io`.

## Set up the private browser editor (Pages CMS)

1. Open https://app.pagescms.org/ and sign in with GitHub.
2. Install/authorize the Pages CMS GitHub App for **only this website repository** when prompted.
3. Select the repository and its `main` branch. Pages CMS reads `.pages.yml` at the repository root.
4. Open **Blog posts**. Create or edit posts with title, slug, category, summary, cover image, and body. The image field uploads into `assets/uploads/`.
5. Save the post. Pages CMS commits the content change to GitHub; GitHub Pages then republishes the static site.

## Important publishing notes

- Use unique URL slugs made of lowercase letters, numbers, and hyphens, e.g. `my-new-science-note`.
- Keep `posts.json` as a JSON array. Do not delete the `slug` or `title` fields.
- The homepage shows the first four entries in `posts.json`; the blog page shows all entries. Put newest posts first.
- Images must be appropriate to publish publicly and you must have permission to use them.
- GitHub Pages content is public. Do not commit passwords, tokens, private lab data, unpublished confidential research, or personal information you do not want public. Never place GitHub access tokens in website files.
- Pages CMS provides an authenticated editing interface, but anyone with write access to the repository can also edit the website. Keep repository access limited to trusted collaborators.

## Citation metrics

The citation values are intentionally not fabricated. Google Scholar profile: https://scholar.google.com/citations?user=HJpumigAAAAJ&hl=en. Enter verified metrics manually or configure a suitable third-party workflow later.

## Preview locally

Run `python3 -m http.server 8000` in this folder and visit `http://localhost:8000`. Opening `index.html` directly as a file may prevent the browser from loading `posts.json`.
