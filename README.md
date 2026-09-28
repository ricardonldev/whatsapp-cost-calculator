# WhatsApp Business cost calculator (October 2026 change)

**Live:** https://ricardonldev.github.io/whatsapp-cost-calculator/

From **1 October 2026** Meta charges for *service messages*, the free-form replies a business sends inside the 24-hour customer service window. They used to be free. Utility templates sent inside that window also stop being free. For a business whose bot or team answers with many short messages, the bill can go from almost zero to hundreds of euros a month.

This calculator shows the monthly cost **before vs after** the change, and how much you save by answering with fewer messages per conversation. It works in Spanish and English.

## Data
- **Rates:** Meta's official EUR rate card, effective 1 July 2026 ([rate cards](https://developers.facebook.com/docs/whatsapp/pricing#rate-cards)), downloaded 28 Sep 2026. 15 markets in [`rates.js`](rates.js).
- **Rule:** from 1 Oct 2026 service messages cost the same as utility/authentication messages in each market, with no volume tiers; messages in the 72-hour free entry point window (Click-to-WhatsApp ads) stay free ([Meta docs](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages)).
- **Not modelled:** utility/authentication volume tiers (they only lower the cost), VAT, provider (BSP) fees, and Meta Business Agent, which is billed per token. It's an estimate; the Meta invoice is the final figure.
- Some blogs mention "1,000 free service messages per month". That is **not** in Meta's documentation, so it isn't used here.

## Example (Spain)
1,500 conversations/month × 6 replies each = 9,000 service messages × €0.0166 = **€149.40/month from October** (€0 before). Replying in 3 messages instead of 6 saves **€896.40/year**.

## Code
- [`calc.js`](calc.js): the pricing rules as pure functions.
- [`index.html`](index.html): the page (vanilla JS, no build step, no tracking).
- [`tests/calc.test.mjs`](tests/calc.test.mjs): 7 tests (`node --test tests/calc.test.mjs`) checking the official Spain rates, the before/after rules, the free entry point, and that bad input can't produce negative or NaN costs.

Built with Claude Code; directed, reviewed and tested by me. MIT licensed.
