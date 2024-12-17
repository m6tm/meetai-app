### Format des messages de commits

Pour éviter des erreurs du type:

```
git commit -m "Le message de commit ici ..."
✔ Preparing lint-staged...
✔ Running tasks for staged files...
✔ Applying modifications from tasks...
✔ Cleaning up temporary files...
⧗   input: Le message de commit ici ..."
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 2 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint
```

Il faut utiliser l'un des types suivant:

-   feat (fonctionnalité)
-   fix (correction)
-   docs (documentation)
-   style (formatage)
-   refactor (refactorisation)
-   build, chore, ci, perf, refactor, revert, test

La description doit être courte et explicative. Ne doit pas commencer par une majuscule.

Exemple:
`{type}: {description}`

`fix: correction d'un bug dans la validation des formulaires`
