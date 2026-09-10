# random_project

Simple static project containing a single page site.

Files
- `mainpage.html` — entry point
- `css/` — styles
- `script.js` — client-side logic

Usage

Open `mainpage.html` in your browser, or serve the folder with a simple HTTP server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/mainpage.html
```

Contributing

Feel free to open issues or pull requests.
Git Commands Used
-----------------

Below are the Git / GitHub commands used while initializing and pushing this project, with short explanations.

- `git init` : Initialize a new (or reinitialize an existing) Git repository in the current directory.
- `git add .` : Stage all changes in the working directory for the next commit.
- `git add .gitignore README.md` : Stage specific files (used when adding just the new files).
- `git commit -m "Initial commit"` : Create a commit with a message describing the changes.
- `git commit -m "Add .gitignore and README"` : Example of committing staged changes with a descriptive message.
- `git branch -M main` : Rename the current branch to `main` (recommended default branch name).
- `git remote add origin <REPO_URL>` : Add a remote named `origin` pointing to the GitHub repository URL.
	- Example used: `git remote add origin https://github.com/anushkabala244/random_project.git`
- `git push -u origin main` : Push the `main` branch to the `origin` remote and set it to track the remote branch.
- `git push` : Push any local commits to the configured remote branch (shorthand when upstream is set).
- `git pull --rebase origin main` : Fetch remote changes and replay local commits on top (keeps history linear).
- `git pull origin main` : Fetch and merge remote changes (used as a fallback merge strategy).

Notes
- When a push was rejected due to remote commits already existing, we fetched the remote history and rebased local commits using `git pull --rebase origin main`, then pushed again.
- If you prefer merging instead of rebasing, `git pull origin main` will merge remote changes into your local branch.
# random_project