// Official Meta rate card, EUR, effective 1 July 2026.
// Source: "Cost per message in EUR on the WhatsApp Business Platform, effective July 1, 2026"
// (CSV linked from https://developers.facebook.com/docs/whatsapp/pricing#rate-cards), downloaded 28 Sep 2026.
// [marketing, utility, authentication] in EUR per delivered message (list price, before volume tiers).
// From 1 Oct 2026 service messages cost the same as utility/authentication in each market:
// https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages
export const RATE_CARD = {
  currency: 'EUR',
  effective: '2026-07-01',
  retrieved: '2026-09-28',
  sourceUrl: 'https://developers.facebook.com/docs/whatsapp/pricing#rate-cards',
  serviceRuleUrl: 'https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages',
  markets: {
    'Spain': [0.0585, 0.0166, 0.0166],
    'Mexico': [0.0253, 0.0071, 0.0071],
    'Colombia': [0.0104, 0.0008, 0.0008],
    'Argentina': [0.0512, 0.0216, 0.0216],
    'Chile': [0.0736, 0.0166, 0.0166],
    'Peru': [0.0582, 0.0166, 0.0166],
    'Brazil': [0.0518, 0.0056, 0.0056],
    'Rest of Latin America': [0.0612, 0.0094, 0.0094],
    'United Kingdom': [0.0526, 0.0182, 0.0182],
    'France': [0.0712, 0.0248, 0.0248],
    'Germany': [0.1131, 0.0456, 0.0456],
    'Italy': [0.0658, 0.0248, 0.0248],
    'Netherlands': [0.1323, 0.0414, 0.0414],
    'Rest of Western Europe': [0.0490, 0.0142, 0.0142],
    'North America': [0.0207, 0.0028, 0.0028],
  },
};
