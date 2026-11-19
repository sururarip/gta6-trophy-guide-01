[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/sururarip/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/sururarip/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Trophy Guide — GTA VI

An offline guide and tracker for all **55 Grand Theft Auto VI trophies** on PlayStation 5 (1 platinum, 2 gold, 6 silver, 46 bronze). Built for the [make.fun bounty gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01).

## What it is

- **Tracker** — a checklist of every trophy with its official name, description and grade. Progress saves in the browser (localStorage), with export to a file and import back.
- **Roadmap to the platinum** — five stages in play order: story, strangers & side missions, activities & challenges, collectibles & money, cleanup & platinum.
- **Missable flags** — 9 trophies tied to one-time moments or fail conditions, flagged with why, and how to replay them.
- **Cited guides** — every trophy has a guide in original words, each citing its source (the official trophy description via Exophase / PSNProfiles, and the in-game menus it points to).
- **Filters & spoiler mode** — filter by kind (story, missable, collectibles, activities, online), grade, or search; spoiler-free mode hides story trophy names and descriptions until earned.
- **Fully offline** — static files under `app/`, no build step, no network at run time.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the kit's vendored `buildDossier`.

## Sources

- Official trophy names, descriptions and grades: PlayStation, as listed by Exophase and PSNProfiles.
- Requirements and counts: the official trophy descriptions, plus the in-game Challenges, Activities and collection menus.
- Every guide is original writing for this entry — drawn from the official descriptions, never copied from another guide.

Unofficial fan guide. Not affiliated with, endorsed by or connected to Rockstar Games or PlayStation. GTA VI and Grand Theft Auto are trademarks of their owners. This guide shows no Rockstar logo or official artwork.

## License

MIT — see [LICENSE](LICENSE).
