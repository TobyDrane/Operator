## GRAPHITE COMMANDS CHEATSHEET

# Command Cheatsheet

Common tasks and their commands. Click any command to see full documentation in the [command reference](/command-reference).

## Viewing your stack

| Task                                                          | Command               | Short Form |
| ------------------------------------------------------------- | --------------------- | ---------- |
| See full information about all of your branches and their PRs | [`gt log`][log]       |            |
| See all of your branches                                      | [`gt log short`][log] | `gt ls`    |

## Creating and modifying branches

| Task                                                                  | Command                                                  | Short Form            |
| --------------------------------------------------------------------- | -------------------------------------------------------- | --------------------- |
| Create a new branch                                                   | [`gt create`][create]                                    | `gt c`                |
| Create a branch, stage all, commit with message                       | [`gt create --all --message "message"`][create]          | `gt c -am "message"`  |
| Amend staged changes to current branch                                | [`gt modify`][modify]                                    | `gt m`                |
| Stage all changes and amend them to current branch                    | [`gt modify --all`][modify]                              | `gt m -a`             |
| Add a new commit to current branch                                    | [`gt modify --commit`][modify]                           | `gt m -c`             |
| Stage all changes and add a new commit to current branch with message | [`gt modify --commit --all --message "message"`][modify] | `gt m -cam "message"` |

## Syncing and submitting

| Task                                                                           | Command                                     | Short Form |
| ------------------------------------------------------------------------------ | ------------------------------------------- | ---------- |
| Pull trunk, clean up merged branches, restack                                  | [`gt sync`][sync]                           |            |
| Push current branch and all downstack branches to remote and create/update PRs | [`gt submit`][submit]                       |            |
| Push all branches in current stack to remote and create/update PRs             | [`gt submit --stack`][submit]               | `gt ss`    |
| Only push branches and update PRs for branches that already have PRs open      | [`gt submit --stack --update-only`][submit] | `gt ss -u` |

## Navigating your stack

| Task                           | Command                              | Short Form         |
| ------------------------------ | ------------------------------------ | ------------------ |
| Switch to a specific branch    | [`gt checkout`][checkout]            | `gt co`            |
| Move up one branch             | [`gt up`][up]                        | `gt u`             |
| Move down one branch           | [`gt down`][down]                    | `gt d`             |
| Move up/down multiple branches | [`gt up 3`][up], [`gt down 2`][down] | `gt u 3`, `gt d 2` |
| Go to the top of the stack     | [`gt top`][top]                      | `gt t`             |
| Go to the bottom of the stack  | [`gt bottom`][bottom]                | `gt b`             |

## Reorganizing your stack

| Task                                                                         | Command                 | Short Form |
| ---------------------------------------------------------------------------- | ----------------------- | ---------- |
| Move branch to a new parent                                                  | [`gt move`][move]       |            |
| Fold branch into its parent                                                  | [`gt fold`][fold]       |            |
| Delete branch but keep changes in working tree                               | [`gt pop`][pop]         |            |
| Reorder branches in your stack                                               | [`gt reorder`][reorder] |            |
| Split branch into multiple branches                                          | [`gt split`][split]     | `gt sp`    |
| Squash all commits in branch into one                                        | [`gt squash`][squash]   | `gt sq`    |
| Distribute staged changes to downstack branches by amending relevant commits | [`gt absorb`][absorb]   | `gt ab`    |

## Recovery

| Task                                   | Command           | Short Form |
| -------------------------------------- | ----------------- | ---------- |
| Undo the most recent Graphite mutation | [`gt undo`][undo] |            |

## Tracking branches

| Task                                                | Command                 | Short Form |
| --------------------------------------------------- | ----------------------- | ---------- |
| Start tracking an existing Git branch with Graphite | [`gt track`][track]     | `gt tr`    |
| Stop tracking a branch                              | [`gt untrack`][untrack] | `gt utr`   |

## Collaborating

| Task                                        | Command                   | Short Form |
| ------------------------------------------- | ------------------------- | ---------- |
| Fetch a teammate's stack locally            | [`gt get`][get]           |            |
| Freeze a branch to prevent accidental edits | [`gt freeze`][freeze]     |            |
| Unfreeze a branch                           | [`gt unfreeze`][unfreeze] |            |

[log]: /command-reference#gt-log-%5Bcommand%5D
[create]: /command-reference#gt-create-%5Bname%5D
[modify]: /command-reference#gt-modify
[sync]: /command-reference#gt-sync
[submit]: /command-reference#gt-submit
[up]: /command-reference#gt-up-%5Bsteps%5D
[down]: /command-reference#gt-down-%5Bsteps%5D
[top]: /command-reference#gt-top
[bottom]: /command-reference#gt-bottom
[checkout]: /command-reference#gt-checkout-%5Bbranch%5D
[move]: /command-reference#gt-move
[fold]: /command-reference#gt-fold
[pop]: /command-reference#gt-pop
[reorder]: /command-reference#gt-reorder
[split]: /command-reference#gt-split
[squash]: /command-reference#gt-squash
[absorb]: /command-reference#gt-absorb
[track]: /command-reference#gt-track-%5Bbranch%5D
[untrack]: /command-reference#gt-untrack-%5Bbranch%5D
[get]: /command-reference#gt-get-%5Bbranch%5D
[freeze]: /command-reference#gt-freeze-%5Bbranch%5D
[unfreeze]: /command-reference#gt-unfreeze-%5Bbranch%5D
[undo]: /command-reference#gt-undo

---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://graphite-58cc94ce.mintlify.dev/docs/llms.txt
