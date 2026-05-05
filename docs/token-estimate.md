# Build history and token estimate

The README keeps this point high-level. This note preserves the detailed estimate for anyone who wants to understand the tracked Codex build pass behind the starter.

## Estimate

From the local Codex session history associated with this repo:

- total tokens: about 15,179,918
- input tokens: about 15,118,845
- cached input tokens: about 14,428,928
- fresh non-cached input tokens: about 689,917
- output tokens: about 61,073
- reasoning output tokens: about 26,995
- fresh non-cached plus output and reasoning: about 777,985

## How to read this

The raw total is large because the session reused cached context heavily. Cached input represented about 95.4 percent of all input tokens in that tracked build pass.

For that reason, the most useful number for a savings narrative is usually the fresh-work estimate, not only the raw total. A fair plain-English summary is:

- the tracked major build pass consumed about 15.2M total Codex tokens
- the fresh work inside that pass was closer to 778k tokens

## Caveats

- This is an estimate from local Codex session history, not a billing export.
- It reflects the latest major tracked build pass tied to this repo, not necessarily every token ever spent across the repo's full lifetime.
- Different agents, prompts, verification depth, and caching behavior will change the number substantially.

## README wording

The front-page README intentionally keeps this short:

> This starter packages roughly 778k fresh agent-work tokens of solved product and integration work. Starting here means you do not have to spend that work rediscovering the NestJS/React Router seams, workspace wiring, docs, and verification loop from scratch.
