export function isLiveCheckoutEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_LIVE_CHECKOUT === "true";
}

export function isPayoutLegalReviewApproved() {
  return process.env.NEXT_PUBLIC_PAYOUTS_LEGAL_APPROVED === "true";
}
