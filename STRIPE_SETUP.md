# Stripe Setup Instructions for The Witness Project Donations

## 🎯 **What You Need To Do**

### 1. Create Your Stripe Account
1. Go to https://stripe.com
2. Click "Start now" and create your account
3. Complete the business verification process

### 2. Get Your API Keys
1. Once logged in, go to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable key** (starts with `pk_live_` or `pk_test_`)
3. Copy your **Secret key** (starts with `sk_live_` or `sk_test_`)

### 3. Update Your Environment Variables
In your `.env.local` file, replace these placeholders:
```
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_STRIPE_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_STRIPE_SECRET_KEY_HERE
```

### 4. Set Up Webhooks (Important for tracking donations)
1. In Stripe Dashboard, go to "Webhooks"
2. Click "Add endpoint"
3. Enter this URL: `https://witnessproject.net/api/webhooks/stripe`
4. Select these events:
   - `checkout.session.completed`
5. Copy the webhook signing secret (starts with `whsec_`)
6. Update your `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_WEBHOOK_SECRET_HERE
```

### 5. Test Mode vs Live Mode
- **Test Mode**: Use for testing (keys start with `sk_test_` and `pk_test_`)
- **Live Mode**: Use for real donations (keys start with `sk_live_` and `pk_live_`)

Start with test mode, then switch to live mode when ready!

## 💰 **How It Works**

1. **Visitor Experience**: 
   - Goes to `/support`
   - Chooses donation amount ($10, $25, $50, $100, or custom)
   - Clicks "Send Gift of Love - $XX"
   - Redirected to secure Stripe checkout
   - After payment, sees beautiful thank you page

2. **Your Experience**:
   - Money goes directly to your Stripe account
   - All donations are logged in your database
   - You can see donation reports in Stripe dashboard

3. **Legal Protection**:
   - Clear messaging: "gifts with no expectations of anything in return"
   - Not tax-deductible disclaimers everywhere
   - Pure gift language throughout

## 🚀 **What's Already Built**

✅ Donation page with gift amounts
✅ Secure Stripe payment processing  
✅ Beautiful thank you page with blessings
✅ Database logging of all donations
✅ Clear legal language about gifts
✅ Webhook integration for tracking
✅ Mobile-responsive design

**Just add your Stripe keys and you're ready to receive gifts of love!** 💝

## 🔗 **Useful Links**

- Stripe Dashboard: https://dashboard.stripe.com
- Test Card Numbers: https://stripe.com/docs/testing#cards
- Your donation page: https://witnessproject.net/support