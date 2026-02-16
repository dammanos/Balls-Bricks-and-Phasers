# Neon Odyssey — A Greek Mythology Brick Breaker

A **Phaser 3** neon-themed brick-breaker set in ancient Greek mythology, built for **Z01 Athens – Balls, Bricks and Phasers**.

For jam publishing copy and upload checklist, see [SUBMISSION.md](./SUBMISSION.md).
For launch/support assets, see [docs/launch](./docs/launch).

## How to play

- Break all bricks to clear a level.
- Don't let all balls fall below the paddle.
- Clear 3 temples (9 levels) to conquer Olympus.
- After each temple, choose a Divine Blessing upgrade.

## Controls

- Move paddle: **Left/Right Arrow**
- Launch ball: **Space** or **Left Click**
- Pause: **P**
- Restart: **R**

## Temples

1. **Temple of Athena** (Athens) — Blue bricks, golden accents
2. **Fortress of Ares** (Sparta) — Red bricks, bronze accents
3. **Summit of Zeus** (Olympus) — Gold bricks, purple accents

## Brick types

- **Normal**: 1 hit
- **Strong**: 2 hits (cross pattern)
- **Medusa**: explosive (damages nearby bricks on destroy)

## God Powers (powerups)

- ⚡ **Zeus**: Chain lightning — zaps 2 nearby bricks on each hit
- 🏹 **Artemis**: Triple ball — splits into 3 balls
- 🔥 **Hephaestus**: Fireball — ball passes through bricks for 5s
- 🛡 **Athena**: Wide shield — wider paddle for 10s
- 🪽 **Hermes**: Swift grace — boosts paddle movement speed for 7s

## Combo system

- Combo chains are timer-based and reward route planning
- Skilled paddle control can sustain combo windows between returns
- Pro mode increases combo pressure and score upside

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Credits / tools

- Framework: **Phaser 3**
- Build tool: **Vite**
- Font: **Cinzel** (Google Fonts)
- Assets + SFX + BGM: generated at runtime in code (no third-party art/audio files)
- AI assistance: implementation support by GitHub Copilot
