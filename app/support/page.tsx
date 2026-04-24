// app/support/page.tsx
'use client';
import Link from "next/link";
import { useState } from "react";

export default function SupportPage() {
  const [loading, setLoading] = useState(false);
  const [donationAmount, setDonationAmount] = useState(25);

  const handleDonation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-donation-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: donationAmount }),
      });
      
      if (response.status === 503) {
        alert('The donation system is being set up. Please check back soon or contact us directly.');
        setLoading(false);
        return;
      }
      
      const { url, error } = await response.json();
      if (error) {
        alert(`Error: ${error}`);
      } else if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating donation session:', error);
      alert('Sorry, there was an error processing your donation. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-amber-100 to-purple-200 text-stone-800">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          House of Witness — Offerings & Support
        </h1>

        <p className="mt-6 leading-7">
          Welcome, beloved. You stand in the <em>House of Witness</em> — a place for those who
          feel the call to build, to heal, and to walk in truth before YHWH. We are gathered here
          by the gentle leading of the One who draws hearts in His timing and purpose.
        </p>

        <p className="mt-4 leading-7">
          The Witness Project is, at this stage, <strong>a labor of love</strong> — fully
          volunteer, without salaries, without profit, and <strong>not a 501(c)(3)</strong>.
          Therefore, we choose to walk in light and honesty: any offering given here is a
          <strong>voluntary gift with no expectations of anything in return</strong>, 
          <strong>not tax-deductible</strong>, and comes with no promise of goods, services, 
          or material return of any kind.
        </p>

        <blockquote className="mt-6 border-l-4 border-stone-300 pl-4 italic">
          “Each one should give as he has decided in his heart, not reluctantly or under
          compulsion, for God loves a cheerful giver.” — 2 Corinthians 9:7
        </blockquote>

        <p className="mt-6 leading-7">
          If your heart is stirred to support this work, we receive your offering with humility and
          pledge to steward it with prayer and accountability. May YHWH bless you and keep you,
          whether you choose to give or simply continue the journey alongside us.
        </p>

        {/* Donation Interface */}
        <div className="mt-10">
          {/* Amount Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-700 mb-3">
              Choose a gift amount (no expectations, just love):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[10, 25, 50, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setDonationAmount(amount)}
                  className={`px-4 py-2 rounded-lg border text-center transition ${
                    donationAmount === amount
                      ? 'border-stone-500 bg-stone-100'
                      : 'border-stone-300 hover:border-stone-400'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-stone-600">Custom amount: $</span>
              <input
                type="number"
                min="1"
                max="999999"
                value={donationAmount}
                onChange={(e) => setDonationAmount(parseInt(e.target.value) || 0)}
                className="w-24 px-2 py-1 border border-stone-300 rounded text-center"
              />
            </div>
          </div>
          
          {/* Donation Button */}
          <button
            onClick={handleDonation}
            disabled={loading || donationAmount < 1}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-8 py-4 text-base font-medium shadow-sm hover:shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-stone-600 mr-2"></div>
                Processing...
              </>
            ) : (
              `Send Gift of Love - $${donationAmount}`
            )}
          </button>
          
          <p className="mt-2 text-xs text-stone-500">
            Secure processing via Stripe • No account required • Pure gift with no strings attached
          </p>
        </div>

        {/* Other Support Options */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">

          {/* Monthly Support → internal tiers page */}
          <Link
            className="inline-flex items-center justify-center rounded-xl bg-stone-900 text-white px-6 py-4 text-base font-medium shadow-sm hover:opacity-95 transition"
            href="/support/monthly"
          >
            Walk With Us — Monthly Support
          </Link>

          {/* Sponsorship → info page */}
          <Link
            className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-6 py-4 text-base font-medium shadow-sm hover:shadow transition sm:col-span-2"
            href="/support/sponsorship"
          >
            Build With Us — Sponsorship
          </Link>
        </div>

        <p className="mt-6 text-sm text-stone-500">
          Transparency note: All gifts are voluntary with no expectations of anything in return. 
          Not tax-deductible. We are not a 501(c)(3). Your generosity is received with gratitude and prayer.
        </p>
      </section>
    </main>
  );
}
