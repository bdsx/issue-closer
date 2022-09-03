# GitHub action to automatically close issues

Automatically close issues whose body text does not match the specified regular expression pattern.
This is useful to enforce usage of issue templates.

## Installation

To configure the action simply add the following lines to your `.github/main.workflow` workflow file:

```yml
name: Autocloser
on: [issues]
jobs:
  autoclose:
    runs-on: ubuntu-latest
    steps:
      - name: checkout repo
        uses: actions/checkout@v3
      - name: check issue
        uses: karikera/issue-closer@HEAD
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

```

forked from https://github.com/roots/issue-closer-action
