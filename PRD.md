# CardIQ — Product Requirements Document

**Author:** Harsha  
**Status:** Draft  
**Platform:** Mobile (iOS / Android)  
**Target users:** College students / young adults  
**Version:** 1.0

---

## Problem

Credit cards are financially powerful but deeply confusing for young adults. Most 18–25 year olds have at least one card but don't know what their rewards are worth in real dollars, which card to use for which purchase, or what fees they're actually paying. The result: money left on the table, underutilized rewards, and anxiety around a product that should be working for them.

---

## Target Users

**The beginner** — Just got their first card. Doesn't understand APR, fees, or rewards. Overwhelmed by fine print. Wants to do it right without reading a textbook.

**The optimizer** — Has 2–3 cards. Knows rewards exist but can't keep track across apps. Suspects they're leaving value on the table but doesn't know how much.

---

## Goals

- Help users understand which card to use for each spending category
- Translate points, miles, and cashback into real dollar values
- Surface fees and APR in plain english — no fine print
- Recommend the best redemption path based on user goals
- Reduce the number of apps users need to manage their cards

---

## Features

### Card Dashboard `P0`

| Feature | Description |
|---|---|
| Card overview | See all connected cards in one place with key stats — rewards balance, APR, annual fee |
| Swipe recommendation | For a given purchase category (dining, travel, groceries), recommends the highest-earning card to use |
| Fee breakdown | Translates card terms into plain english — annual fee, foreign transaction fee, late payment penalty |

### Rewards Hub `P0`

| Feature | Description |
|---|---|
| Unified rewards balance | Aggregates points, miles, and cashback across all cards into a single real-dollar value |
| Redemption recommender | Based on user goals (flights, cashback, gift cards), surfaces the highest-value redemption option |
| Expiration alerts | Notifies users when rewards are at risk of expiring so they don't lose value |

### Card Finder `P1`

| Feature | Description |
|---|---|
| Personalized recommendations | Based on spending habits, recommends cards the user doesn't have yet that would earn them more |
| Issuer-agnostic comparison | Surfaces the best card objectively across all issuers — ranked purely on user value |

---

## Success Metrics

| Metric | Type |
|---|---|
| Rewards redemption rate | North star |
| DAU / MAU ratio | Engagement |
| Cards connected per user | Activation |
| 30-day retention rate | Retention |

---

## Assumptions & Risks

- Users are willing to connect their card accounts (trust / privacy barrier)
- Points-to-dollar conversion rates are public or can be reasonably estimated
- Young adults are motivated enough to act on redemption recommendations
- Regulatory requirements around financial data aggregation (Plaid-style)

---

## Out of Scope (v1)

- Direct redemption — users still redeem through their issuer's app
- Debit cards, bank accounts, or investment accounts
- Credit score tracking or improvement tools
