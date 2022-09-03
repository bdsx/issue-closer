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
    - name: Autoclose issues that did not follow issue template
      uses: karikera/issue-closer@v1.1
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
```

forked from https://github.com/roots/issue-closer-action
