# MkDocs

## Setup
Check out the MkDocs [setup documentation](http://www.mkdocs.org/#installation)

## Developing
```bash
cd docs
mkdocs serve
```
Open up `http://127.0.0.1:8000/` in your browser.

## Building
```bash
mkdocs build --clean
```

## Deploying
```bash
## make sure all changes have been merged into master
git checkout master
ember github-pages:commit --message "<Commit Message>"
git push
```
