// Monthly WhatsApp Business Platform cost, before and after the 1 Oct 2026 pricing change.
//
// Rules modelled (Meta docs, see rates.js):
// - Marketing, utility and authentication templates are charged per delivered message.
// - Until 30 Sep 2026: service messages (free-form replies in the 24 h window) and utility
//   templates sent inside an open window are free.
// - From 1 Oct 2026: both are charged; service uses the market's utility/authentication rate,
//   with no volume tiers.
// - Messages sent in the 72 h free entry point window (conversations started from a
//   Click-to-WhatsApp ad or Page CTA) stay free.
// Not modelled: utility/authentication volume tiers (they only lower the cost), VAT,
// provider (BSP) fees, and Meta Business Agent token pricing.

const clamp01 = (x) => Math.min(1, Math.max(0, Number(x) || 0));
const nonNeg = (x) => Math.max(0, Number(x) || 0);
const round2 = (x) => Math.round(x * 100) / 100;

/**
 * @param {[number, number, number]} rates  [marketing, utility, authentication] per message
 * @param {object} v monthly volumes
 * @param {number} v.marketing         marketing templates sent
 * @param {number} v.utilityOutside    utility templates sent with no open window
 * @param {number} v.utilityInside     utility templates sent inside an open 24 h window
 * @param {number} v.authentication    authentication templates sent
 * @param {number} v.conversations     customer-initiated conversations
 * @param {number} v.repliesPerConversation  business replies (service messages) per conversation
 * @param {number} v.freeEntryShare    share of conversations that start from a CTWA ad (0-1)
 * @param {boolean} after2026Oct       apply the rules in force from 1 Oct 2026
 */
export function monthlyCost(rates, v, after2026Oct) {
  const [rM, rU, rA] = rates;
  const paidShare = 1 - clamp01(v.freeEntryShare);
  const serviceMsgs = nonNeg(v.conversations) * nonNeg(v.repliesPerConversation) * paidShare;
  const utilityInsidePaid = nonNeg(v.utilityInside) * paidShare;

  const marketing = nonNeg(v.marketing) * rM;
  const authentication = nonNeg(v.authentication) * rA;
  const utility = (nonNeg(v.utilityOutside) + (after2026Oct ? utilityInsidePaid : 0)) * rU;
  const service = after2026Oct ? serviceMsgs * rU : 0;

  return {
    marketing: round2(marketing),
    utility: round2(utility),
    authentication: round2(authentication),
    service: round2(service),
    total: round2(marketing + utility + authentication + service),
    serviceMessages: Math.round(after2026Oct ? serviceMsgs : 0),
  };
}

/** Before/after comparison plus the saving from sending fewer replies per conversation. */
export function compare(rates, v, optimizedReplies) {
  const before = monthlyCost(rates, v, false);
  const after = monthlyCost(rates, v, true);
  const optimized = monthlyCost(rates, { ...v, repliesPerConversation: nonNeg(optimizedReplies) }, true);
  return {
    before,
    after,
    optimized,
    increase: round2(after.total - before.total),
    monthlySaving: round2(after.total - optimized.total),
    yearlySaving: round2((after.total - optimized.total) * 12),
  };
}
