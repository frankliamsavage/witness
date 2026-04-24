"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

/* ---------------------------------------------------
   Simple collapsible section component
--------------------------------------------------- */
function Section({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="w-full max-w-5xl mx-auto bg-amber-50/80 border border-amber-200 rounded-2xl shadow-lg my-6 overflow-hidden backdrop-blur-sm">
      <header
        onClick={() => setOpen(!open)}
        className="cursor-pointer select-none flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-200 via-red-100 to-purple-100 hover:from-orange-300 hover:to-purple-200 transition-all"
      >
        <h2 className="text-lg sm:text-xl font-bold text-slate-800">
          {title}
        </h2>
        <span className="text-2xl text-slate-600">
          {open ? "−" : "+"}
        </span>
      </header>
      {open && <div className="px-6 py-6 text-slate-800 leading-relaxed whitespace-pre-wrap">{children}</div>}
    </section>
  );
}

/* ---------------------------------------------------
   Reflection / Ask box
--------------------------------------------------- */
function ReflectionBox() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("sending");
    try {
      await fetch("/api/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
      });
      setStatus("sent");
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatus("idle");
    }
  }

  if (!isLoaded) {
    return (
      <div className="text-center text-slate-700 bg-white/70 border rounded-xl p-4 shadow-md mt-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700 mx-auto mb-2"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isSignedIn)
    return (
      <div className="text-center text-slate-700 bg-white/70 border rounded-xl p-4 shadow-md mt-10">
        Please{" "}
        <Link href="/sign-in" className="underline font-medium">
          sign in
        </Link>{" "}
        to share your reflections or questions.
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 bg-white/70 border border-orange-200 rounded-xl p-4 shadow-md"
    >
      <h3 className="font-semibold text-slate-800 mb-2">
        Reflect / Ask as {user?.username || user?.firstName}
      </h3>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your reflection or question..."
        className="w-full p-3 border border-orange-300 rounded-lg resize-none focus:ring focus:ring-orange-300 min-h-[100px]"
      />
      <button
        disabled={status !== "idle"}
        className="mt-3 px-5 py-2 bg-gradient-to-r from-orange-400 to-purple-400 text-white rounded-lg font-semibold shadow hover:opacity-90 disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : status === "sent" ? "Sent!" : "Submit"}
      </button>
    </form>
  );
}

/* ---------------------------------------------------
   Main Leviticus Page
--------------------------------------------------- */
export default function LeviticusScroll() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-orange-200 via-red-100 via-purple-100 via-pink-200 to-rose-200 text-slate-900 px-4 sm:px-10 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          🔥 Leviticus Scroll
        </h1>
        <p className="text-lg mt-2 text-slate-700 italic">
          The Holiness of YHWH — Sacrifice, Priesthood & Sacred Living
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <Link
          href="/sanctuary/scrolls/genesis"
          className="bg-white/10 hover:bg-white/20 border border-orange-400/30 px-6 py-3 rounded-xl text-orange-700 hover:text-orange-900 font-semibold transition-all duration-300"
        >
          📜 ← Back to Genesis
        </Link>
        <Link
          href="/sanctuary/scrolls/exodus"
          className="bg-white/10 hover:bg-white/20 border border-orange-400/30 px-6 py-3 rounded-xl text-orange-700 hover:text-orange-900 font-semibold transition-all duration-300"
        >
          ⚡ ← Back to Exodus
        </Link>
        <Link
          href="/sanctuary"
          className="bg-white/10 hover:bg-white/20 border border-purple-400/30 px-6 py-3 rounded-xl text-purple-700 hover:text-purple-900 font-semibold transition-all duration-300"
        >
          🕊 Return to Sanctuary
        </Link>
      </div>

      {/* ------------------  Leviticus Sections ------------------ */}
      <Section title="🔥 Leviticus 1–7 — The Sacrificial System" defaultOpen>
{`
🔥 Leviticus 1–7: The Sacrificial System
⚖️ Master Brief

Leviticus 1–7 establishes the sacrificial system through which Israel approaches YHWH:

🔥 Burnt Offering (Olah) — Complete consecration and worship
🌾 Grain Offering (Minchah) — Dedication of life's work  
✌️ Peace Offering (Shelem) — Fellowship and communion
❌ Sin Offering (Chattat) — Atonement for unintentional sin
⚖️ Guilt Offering (Asham) — Restitution for specific wrongs

Three principles govern all offerings:

🩸 Blood — Life given for life
🔥 Fire — YHWH's consuming holiness  
👐 Laying on of hands — Identification and substitution

🔥 Leviticus 1 — The Burnt Offering (Olah)

🐂 Bull, 🐏 ram, or 🕊 bird offered entirely to YHWH (Lev 1:3-17).
Offerer lays hands on animal → identification (Lev 1:4).
Blood sprinkled around altar (Lev 1:5).
Entire animal burned → sweet aroma to YHWH (Lev 1:9).

Key Principle: Complete surrender — nothing held back from YHWH.

🌾 Leviticus 2 — The Grain Offering (Minchah)

🌾 Fine flour, oil, frankincense — no honey or leaven (Lev 2:1-2, 11).
Memorial portion burned; rest given to priests (Lev 2:3).
🧂 Salted with covenant salt (Lev 2:13).

Key Principle: Daily work and provision dedicated to YHWH.

✌️ Leviticus 3 — The Peace Offering (Shelem)

🐂 Cattle, 🐏 sheep, or 🐐 goat — male or female (Lev 3:1).
Fat and organs burned; meat shared between offerer and priests (Lev 3:3-4).
Fellowship meal celebrating restored relationship.

Key Principle: Communion with YHWH and community.

❌ Leviticus 4 — The Sin Offering (Chattat)

🏛 High Priest's sin — bull offered (Lev 4:3-12).
👥 Congregation's sin — bull offered (Lev 4:13-21).  
👑 Ruler's sin — male goat offered (Lev 4:22-26).
👤 Common person's sin — female goat or lamb (Lev 4:27-35).

Key Principle: Different levels of responsibility require different offerings.

⚖️ Leviticus 5–6:7 — The Guilt Offering (Asham)

🤐 Withholding testimony, touching unclean things (Lev 5:1-3).
🗣 Rash oaths (Lev 5:4-6).
💰 Defrauding neighbor — restitution plus 20% (Lev 6:1-7).

Key Principle: Sin against others requires both divine and human restitution.

🔥 Leviticus 6:8–7:38 — Instructions for Priests

🔥 Burnt offering burns continually — fire never goes out (Lev 6:12-13).
🌾 Grain offering eaten by priests in holy place (Lev 6:16).
❌ Sin offering blood brings holiness — or defiles (Lev 6:27).
✌️ Peace offering eaten same day or next; third day forbidden (Lev 7:15-18).

Key Principle: Holiness requires precise obedience and timing.

⚖️ Spiritual Fulfillment in Messiah

🔥 Burnt Offering → Yeshua's complete obedience (Phil 2:8).
🌾 Grain Offering → Yeshua as Bread of Life (John 6:35).
✌️ Peace Offering → Reconciliation through Yeshua (2 Cor 5:18-20).
❌ Sin Offering → "He who knew no sin became sin" (2 Cor 5:21).
⚖️ Guilt Offering → Restitution and restoration (Isa 53:10).

🔥 Case Conclusion

Leviticus 1–7 shows YHWH's way of approach:

🩸 Blood required for forgiveness.
🔥 Fire reveals His consuming holiness.
👐 Substitution — innocent for guilty.
⚖️ Justice satisfied, mercy extended.

👉 Lesson: No casual approach to YHWH — but through sacrifice, perfect fellowship is possible.
`}
      </Section>

      <Section title="🏛️ Leviticus 8–10 — Priesthood Established">
{`
🏛️ Leviticus 8–10: Priesthood Established
👑 Master Brief

Leviticus 8–10 records the consecration of Aaron's priesthood and the tragedy that followed:

🛠 Moses consecrates Aaron and his sons (Lev 8).
🔥 YHWH's fire consumes the first offerings (Lev 9).
⚡ Nadab and Abihu offer strange fire — killed instantly (Lev 10).

Three lessons emerge:

✋ Precise obedience required in YHWH's presence.
🔥 Holy fire vs. strange fire — there is a difference.
⚖️ Greater privilege brings greater responsibility.

🛠 Leviticus 8 — Consecration of the Priests

📯 Moses assembles all Israel to witness (Lev 8:3-4).
🚿 Aaron and sons washed with water (Lev 8:6).
👕 Aaron clothed with holy garments, anointed with oil (Lev 8:7-12).
👗 Sons clothed with tunics, caps, and girdles (Lev 8:13).
🐂 Sin offering, burnt offering, and ram of consecration (Lev 8:14-29).
🩸 Blood placed on right ear, thumb, and big toe (Lev 8:23-24).
🛡 Oil and blood sprinkled on them and their garments (Lev 8:30).
⏳ Seven days of consecration in the tabernacle (Lev 8:33-36).

Key Principle: Holiness requires complete dedication — body, clothing, time.

🔥 Leviticus 9 — The First Service

📅 Eighth day — Aaron begins his ministry (Lev 9:1).
🐂 Aaron offers sin offering for himself, then for the people (Lev 9:7-11).
🔥 Burnt offerings and peace offerings follow (Lev 9:12-21).
🙌 Aaron blesses the people; Moses and Aaron enter the tabernacle (Lev 9:22-23).
⚡ YHWH's fire comes out and consumes the offerings (Lev 9:24).
😱 People shout and fall on their faces (Lev 9:24).

Key Principle: When worship is offered correctly, YHWH manifests His presence powerfully.

⚡ Leviticus 10 — Nadab and Abihu's Strange Fire

🔥 Aaron's sons Nadab and Abihu offer strange fire before YHWH (Lev 10:1).
⚡ Fire from YHWH devours them instantly (Lev 10:2).
😶 Moses tells Aaron: "This is what YHWH meant: I will be sanctified" (Lev 10:3).
🤐 Aaron remains silent (Lev 10:3).
⚰️ Their cousins carry out the bodies still clothed (Lev 10:4-5).
🚫 Aaron and remaining sons forbidden to mourn outwardly (Lev 10:6-7).
🍷 YHWH commands: No wine or strong drink when serving (Lev 10:8-11).
📜 Instructions about eating the holy offerings (Lev 10:12-20).

What was "strange fire"?
🔥 Fire not taken from the altar (vs. Lev 16:12).
🕐 Offered at wrong time or wrong manner.
🍷 Possibly offered while intoxicated (Lev 10:8-9).
💭 Presumption — adding to YHWH's commands.

Key Principle: Familiarity with holy things can breed contempt. Privilege demands reverence.

⚖️ Spiritual Applications

🛠 Consecration (Lev 8):
New Testament believers are a "royal priesthood" (1 Pet 2:9).
We must be "washed by the water of the word" (Eph 5:26).
Our bodies are temples requiring holiness (1 Cor 6:19).

🔥 Holy Fire (Lev 9):
True worship brings YHWH's manifest presence.
"Our God is a consuming fire" (Heb 12:29).
Fire tests the quality of our service (1 Cor 3:13).

⚡ Strange Fire (Lev 10):
Will-worship and human traditions dishonor YHWH (Col 2:23).
"In vain do they worship Me, teaching as doctrines the commandments of men" (Matt 15:9).
Greater revelation brings greater responsibility (Luke 12:48).

🏛️ Case Conclusion

Leviticus 8–10 shows the establishment of priesthood:

🛠 Proper consecration brings YHWH's blessing.
🔥 True worship manifests His presence.
⚡ Presumptuous worship brings His judgment.
⚖️ Holiness demands reverence, not familiarity.

👉 Lesson: Draw near to YHWH — but draw near His way, not ours.
`}
      </Section>

      <Section title="🚫 Leviticus 11–15 — Clean and Unclean">
{`
🚫 Leviticus 11–15: Clean and Unclean
🧼 Master Brief

Leviticus 11–15 establishes laws of ritual purity that separate Israel as YHWH's holy people:

🍖 Clean and unclean animals (Lev 11).
👶 Childbirth purification (Lev 12).
🦠 Leprosy diagnosis and cleansing (Lev 13-14).
💧 Bodily discharges and purification (Lev 15).

Three principles govern cleanliness laws:

📜 Separation from death and disease.
🧼 Purification through washing and sacrifice.
⏳ Time required for restoration to community.

🍖 Leviticus 11 — Clean and Unclean Animals

🐄 Clean land animals: Split hoof AND chews cud (Lev 11:3).
✅ Permitted: Ox, sheep, goat, deer, gazelle (Lev 11:3-8).
❌ Forbidden: Pig (split hoof, no cud), rabbit (cud, no split hoof) (Lev 11:4-7).

🐟 Clean water creatures: Fins AND scales (Lev 11:9).
✅ Permitted: Most fish.
❌ Forbidden: Shellfish, lobster, eel (Lev 11:10-12).

🦅 Clean birds: Generally birds of prey forbidden (Lev 11:13-19).
✅ Permitted: Dove, quail, chicken.
❌ Forbidden: Eagle, vulture, owl, hawk.

🦗 Clean insects: Locusts, grasshoppers, crickets (Lev 11:21-22).

Key Principle: YHWH's people eat differently than the nations — distinctiveness in daily life.

👶 Leviticus 12 — Purification After Childbirth

👦 Male child: Mother unclean 7 days + 33 days purification (Lev 12:2-4).
👧 Female child: Mother unclean 14 days + 66 days purification (Lev 12:5).
🕊 Burnt offering and sin offering required (Lev 12:6-8).
🤱 Poor families may offer two doves (Lev 12:8).

Key Principle: Even life-giving creates ritual impurity — showing the pervasive nature of sin.

🦠 Leviticus 13 — Diagnosing Leprosy

👨‍⚕️ Priest examines suspicious skin conditions (Lev 13:2-3).
⏳ Seven-day quarantine for observation (Lev 13:4-6).
🔔 Confirmed lepers cry "Unclean! Unclean!" (Lev 13:45).
🏕 Live outside the camp until healed (Lev 13:46).
🧥 Garment and house mold also examined (Lev 13:47-59).

Key Principle: Spiritual uncleanness, like leprosy, spreads and requires isolation.

🧼 Leviticus 14 — Cleansing of Lepers

🕊 Two birds: One killed, one released over running water (Lev 14:4-7).
🪒 Shave all hair, wash clothes, bathe (Lev 14:8).
⏳ Seven days outside tent; repeat washing (Lev 14:8-9).
🐑 Eighth day: Guilt offering, sin offering, burnt offering (Lev 14:10-20).
🩸 Blood on right ear, thumb, big toe — like priest consecration (Lev 14:14).
🏠 Houses with mold require similar cleansing (Lev 14:33-53).

Key Principle: Restoration to community requires elaborate process — grace is costly.

💧 Leviticus 15 — Bodily Discharges

👨 Male discharges: Natural or diseased (Lev 15:2-18).
👩 Female discharges: Monthly cycle or abnormal (Lev 15:19-30).
🛏 Everything touched becomes unclean (Lev 15:4-12, 20-27).
🧼 Washing and offerings required for cleansing (Lev 15:13-15, 28-30).

Key Principle: Human sexuality and bodily functions, though natural, create ritual impurity in fallen world.

⚖️ Spiritual Applications

🍖 Dietary Laws:
Distinction in eating habits marks YHWH's people.
"Whether you eat or drink, do all to the glory of God" (1 Cor 10:31).
Spiritual discernment in what we "consume" (media, entertainment, influences).

🦠 Leprosy as Sin:
Sin starts small but spreads.
Requires recognition, confession, and isolation from holy things.
Cleansing is elaborate, costly, and involves substitutionary sacrifice.

🧼 Purification:
Spiritual uncleanness requires spiritual washing.
"Wash me, and I shall be whiter than snow" (Ps 51:7).
"Washed by the water of the word" (Eph 5:26).

🚫 Case Conclusion

Leviticus 11–15 shows YHWH's holiness affecting every aspect of life:

🍖 What we eat reflects who we serve.
🦠 Sin spreads like disease and requires drastic measures.
🧼 Purification is possible but costly.
⏳ Restoration takes time and process.
🏕 Community protection requires individual responsibility.

👉 Lesson: Holiness is not just for the tabernacle — it extends to kitchen, bedroom, and marketplace.
`}
      </Section>

      <Section title="🩸 Leviticus 16 — The Day of Atonement">
{`
🩸 Leviticus 16: The Day of Atonement (Yom Kippur)
⚖️ Master Brief

Leviticus 16 describes the most sacred day in Israel's calendar:

🏛 Once per year, the High Priest enters the Most Holy Place.
🐐 Two goats chosen: one sacrificed, one sent to the wilderness.
🩸 Blood atonement made for priest, people, and sanctuary itself.
🧼 Complete purification of Israel's sins from the past year.

This day foreshadows Messiah's ultimate atonement.

🛡 Leviticus 16:1-5 — Preparation for Entry

⚡ Context: After Nadab and Abihu's death (Lev 16:1).
🚫 Aaron cannot enter Most Holy Place at any time (Lev 16:2).
☁️ YHWH appears in the cloud above the mercy seat (Lev 16:2).
🐂 Aaron must bring sin offering (bull) and burnt offering (ram) (Lev 16:3).
👕 Special linen garments — not his usual golden attire (Lev 16:4).
🛁 Bathe before dressing in holy garments (Lev 16:4).

Key Principle: Even the High Priest needs atonement before approaching YHWH.

🐐 Leviticus 16:6-10 — The Two Goats

🐂 Bull offered as sin offering for Aaron and his house (Lev 16:6).
🐐🐐 Two goats brought before the tabernacle (Lev 16:7).
🎲 Lots cast: One goat "for YHWH," one goat "for Azazel" (Lev 16:8).
✂️ YHWH's goat sacrificed as sin offering (Lev 16:9).
🏜 Azazel's goat presented alive, later sent to wilderness (Lev 16:10).

Who is Azazel?
📜 Traditional view: "Scapegoat" — complete removal.
👹 Some scholars: Demonic being representing Satan.
🏜 Wilderness represents separation from YHWH's presence.

Key Principle: Sin must be both atoned for (sacrifice) and removed (scapegoat).

🔥 Leviticus 16:11-19 — The Blood Ritual

🐂 Aaron kills bull for his own sin offering (Lev 16:11).
🔥 Takes fire from altar and incense into Most Holy Place (Lev 16:12).
☁️ Incense cloud covers mercy seat so he won't die (Lev 16:13).
🩸 Bull's blood sprinkled on mercy seat: once on front, seven times before (Lev 16:14).
🐐 YHWH's goat killed; blood sprinkled same way (Lev 16:15).
🧼 Atonement made for Most Holy Place, Tent of Meeting, and altar (Lev 16:16-19).

Why does the sanctuary need cleansing?
🦠 Israel's sins have "contaminated" the holy places.
🧹 Blood purifies from defilement of human sin.
✨ Holiness restored to YHWH's dwelling place.

Key Principle: Sin affects not just people, but holy things touched by sinful people.

🏜 Leviticus 16:20-22 — The Scapegoat

👐 Aaron lays hands on live goat, confesses Israel's sins (Lev 16:21).
🚶‍♂️ Goat sent to wilderness by appointed man (Lev 16:21).
🏔 Goat carries all iniquities to "land of separation" (Lev 16:22).
🚫 Goat released — never to return (Lev 16:22).

Key Principle: Sin not only forgiven, but completely removed — "as far as east is from west" (Ps 103:12).

🧼 Leviticus 16:23-28 — Final Cleansing

👕 Aaron removes linen garments, bathes, puts on regular clothes (Lev 16:23).
🔥 Offers burnt offerings for himself and people (Lev 16:24).
💨 Fat of sin offering burned on altar (Lev 16:25).
🔥 Bull and goat bodies burned outside camp (Lev 16:27).
🧼 All participants must wash clothes and bathe (Lev 16:26, 28).

Key Principle: Cleansing affects everyone involved in the atonement process.

📅 Leviticus 16:29-34 — Perpetual Statute

🗓 Tenth day of seventh month (Tishrei) — Yom Kippur (Lev 16:29).
🚫 Afflict your souls — fasting and repentance (Lev 16:29, 31).
⚠️ Anyone who doesn't observe this is cut off (Lev 16:29).
⏳ Sabbath of Sabbaths — complete rest (Lev 16:31).
♾️ Eternal statute for all generations (Lev 16:34).

Key Principle: Atonement requires participation — self-humbling and ceasing from work.

⚖️ Messianic Fulfillment

🩸 High Priest → Yeshua our eternal High Priest (Heb 4:14-16).
🐂 Bull for priest → Yeshua's sinless sacrifice for Himself unnecessary.
🐐 YHWH's goat → Yeshua's death as sin offering (2 Cor 5:21).
🏜 Azazel goat → Sins removed completely (Col 2:14).
☁️ Mercy seat → Yeshua as propitiation (Rom 3:25).
🔄 Once per year → "Once for all" eternal sacrifice (Heb 9:26).

🩸 Case Conclusion

Leviticus 16 reveals YHWH's ultimate solution for sin:

🩸 Blood atonement satisfies justice.
🏜 Complete removal satisfies mercy.
🧼 Purification restores fellowship.
⏳ Annual repetition points to need for eternal solution.
👑 High Priest mediates between YHWH and people.

👉 Lesson: Yom Kippur pointed forward to Calvary — where justice and mercy meet perfectly in Messiah.
`}
      </Section>

      <Section title="📜 Leviticus 17–20 — The Holiness Code">
{`
📜 Leviticus 17–20: The Holiness Code
✨ Master Brief

Leviticus 17–20 is called the "Holiness Code" — practical laws showing how YHWH's people must live differently:

🩸 Proper handling of blood and sacrifice (Lev 17).
🚫 Forbidden sexual relationships (Lev 18).
⚖️ Social justice and neighbor love (Lev 19).
💀 Capital punishment for serious violations (Lev 20).

Central theme: "You shall be holy, for I YHWH your God am holy" (Lev 19:2).

🩸 Leviticus 17 — Blood and Sacrifice

🏕 All animals must be brought to tabernacle for slaughter (Lev 17:3-4).
❌ Killing animals elsewhere = bloodshed/murder (Lev 17:4).
🔥 Blood poured out to YHWH, not to demons (Lev 17:7).
🌍 Applies to foreigners living among Israel (Lev 17:8).
🍖 No eating blood — blood is the life (Lev 17:10-11).
🦆 Hunting animals: Must pour blood and cover with earth (Lev 17:13).
⚰️ No eating animals that died naturally or torn by beasts (Lev 17:15).

Key Principle: Life belongs to YHWH — blood represents the sacred nature of life.

🚫 Leviticus 18 — Sexual Purity

🏺 "Do not do as they do in Egypt or in Canaan" (Lev 18:3).
👨‍👩‍👧‍👦 Forbidden relationships with close relatives (Lev 18:6-18).
👩 No relations with woman and her daughter/granddaughter (Lev 18:17).
🚫 No adultery with neighbor's wife (Lev 18:20).
👶 No child sacrifice to Molech (Lev 18:21).
👨‍❤️‍👨 No homosexual relations (Lev 18:22).
🐄 No bestiality (Lev 18:23).
🤢 "The land vomited out its inhabitants" for these practices (Lev 18:25).

Key Principle: Sexual purity maintains covenant distinctiveness and protects family structure.

⚖️ Leviticus 19 — Social Justice and Love

✨ "You shall be holy, for I YHWH your God am holy" (Lev 19:2).
👨‍👩‍👧‍👦 Honor father and mother (Lev 19:3).
🗿 No idols or molten gods (Lev 19:4).
✌️ Peace offerings eaten properly (Lev 19:5-8).
🌾 Leave corners of fields for the poor (Lev 19:9-10).
🚫 No stealing, lying, or false dealing (Lev 19:11).
🤬 No false oaths in YHWH's name (Lev 19:12).
💰 Pay workers promptly (Lev 19:13).
🦻 Don't curse deaf or put stumbling block before blind (Lev 19:14).
⚖️ Judge righteously — no favoritism to poor or rich (Lev 19:15).
🗣 Don't go about as talebearer (Lev 19:16).
💔 Don't hate your brother; rebuke him instead (Lev 19:17).
❤️ "Love your neighbor as yourself" (Lev 19:18).
🐄 Don't crossbreed cattle or sow mixed seed (Lev 19:19).
👕 Don't wear mixed fabrics (linen + wool) (Lev 19:19).
🔮 No fortune telling or spiritism (Lev 19:26, 31).
💇 Don't round corners of beard or cut body for dead (Lev 19:27-28).
👵 Rise before gray hair and honor elders (Lev 19:32).
🌍 Love strangers dwelling among you (Lev 19:34).
⚖️ Just weights and measures in business (Lev 19:35-36).

Key Principle: Holiness affects every relationship — God, family, neighbors, business, even agriculture.

💀 Leviticus 20 — Capital Punishment

🔥 Child sacrifice to Molech — death by stoning (Lev 20:2).
🔮 Consulting mediums or spiritists — death (Lev 20:6, 27).
🤬 Cursing father or mother — death (Lev 20:9).
💏 Adultery — death for both parties (Lev 20:10).
👨‍👦 Incest with father's wife — death (Lev 20:11).
👨‍👩‍👧 Relations with daughter-in-law — death (Lev 20:12).
👨‍❤️‍👨 Homosexual relations — death (Lev 20:13).
👨‍👩‍👧‍👦 Marrying woman and her mother — burned with fire (Lev 20:14).
🐄 Bestiality — death for human and animal (Lev 20:15-16).
🩸 Relations during menstruation — cut off from people (Lev 20:18).
♾️ "You shall be holy to Me, for I YHWH am holy" (Lev 20:26).

Key Principle: Some sins are so destructive they require ultimate penalty to protect society.

⚖️ Spiritual Applications

🩸 Blood Laws (Lev 17):
Respect for life extends to animal life.
"The life is in the blood" — points to Messiah's blood atonement.
No participation in demonic practices through improper sacrifice.

🚫 Sexual Purity (Lev 18):
God's design for sexuality: marriage between one man and one woman.
Sexual sin defiles not just individuals but entire societies.
Child sacrifice = ultimate perversion — giving children to death instead of life.

⚖️ Social Holiness (Lev 19):
Love of God must express itself in love of neighbor.
Justice, honesty, and care for vulnerable mark God's people.
Even agriculture and clothing reflect separation unto YHWH.

💀 Capital Punishment (Lev 20):
Some sins threaten covenant community's existence.
Death penalty shows how seriously YHWH views violations of His order.
Warning of eternal consequences for unrepentant sin.

📜 Case Conclusion

Leviticus 17–20 shows holiness affecting every area:

🩸 Reverence for life in how we handle blood.
🚫 Purity in sexual relationships and family structure.
⚖️ Justice and love in social relationships.
💀 Recognition that some sins deserve ultimate penalty.

👉 Lesson: "Be holy as I am holy" — YHWH's character must be reflected in His people's conduct.
`}
      </Section>

      <Section title="🏛️ Leviticus 21–24 — Priestly Holiness & Sacred Seasons">
{`
🏛️ Leviticus 21–24: Priestly Holiness & Sacred Seasons
👑 Master Brief

Leviticus 21–24 addresses special holiness requirements:

🏛 Higher standards for priests (Lev 21).
👨‍⚕️ Physical requirements for priestly service (Lev 22).
🍞 Holy bread and lamp instructions (Lev 24:1-9).
⚖️ Blasphemy and equal justice (Lev 24:10-23).

Central principle: Greater privilege requires greater holiness.

🏛 Leviticus 21 — Priestly Holiness Standards

⚰️ Regular priests can't touch dead bodies except close family (Lev 21:1-4).
💇 No shaving head, trimming beard, or cutting flesh for mourning (Lev 21:5).
👰 Must marry virgin, not widow, divorced, or prostitute (Lev 21:7).
✨ "I YHWH make him holy" (Lev 21:8).

👨‍⚕️ High Priest Additional Requirements:
🛢 Never uncover head or tear clothes in mourning (Lev 21:10).
⚰️ Never go near any dead body — even parents (Lev 21:11).
🏛 Never leave sanctuary during consecration period (Lev 21:12).
👰 Must marry virgin from his own people (Lev 21:13-14).
👶 Offspring must not be defiled (Lev 21:15).

Key Principle: Higher calling demands higher separation from normal human activities.

👨‍⚕️ Leviticus 22 — Physical Standards and Eating Holy Food

🚫 Priests with physical defects cannot approach altar (Lev 22:17-25):
🦯 Blind, lame, disfigured, disproportioned.
🤕 Broken hand, foot, hunchback, dwarf.
👁 Eye defect, eczema, scabs, crushed testicles.

🍞 They may eat holy food but not approach altar (Lev 22:2-7).
🧼 Unclean priests must bathe before eating sacred portions (Lev 22:6-7).
👨‍👩‍👧‍👦 Priest's family may eat holy food; outsiders cannot (Lev 22:10-13).
💰 If layperson accidentally eats holy food, must repay plus 20% (Lev 22:14).

🐄 Acceptable Offerings:
✅ Perfect animals — no blemish or defect (Lev 22:18-25).
⏳ Calves, lambs, goats — minimum 7 days old (Lev 22:27).
🐄 Don't kill mother and offspring same day (Lev 22:28).
🕐 Thanksgiving offerings eaten same day (Lev 22:30).

Key Principle: What is offered to YHWH must be the best, without defect.

📅 Leviticus 23 — The Appointed Feasts

🗓 Seven major appointed times (mo'adim):

1️⃣ **Sabbath** — Every seventh day (Lev 23:3).

2️⃣ **Passover** — 14th day, 1st month (Lev 23:5).

3️⃣ **Unleavened Bread** — 7 days following Passover (Lev 23:6-8).

4️⃣ **Firstfruits** — First sheaf of harvest (Lev 23:9-14).

5️⃣ **Pentecost (Weeks)** — 50 days after Firstfruits (Lev 23:15-22).

6️⃣ **Trumpets (Rosh Hashanah)** — 1st day, 7th month (Lev 23:23-25).

7️⃣ **Day of Atonement** — 10th day, 7th month (Lev 23:26-32).

8️⃣ **Tabernacles (Sukkot)** — 15th-21st day, 7th month (Lev 23:33-43).

⏳ Messianic Pattern:
🐑 Passover → Messiah's death
🍞 Unleavened Bread → Sinless life buried
🌾 Firstfruits → Resurrection
🔥 Pentecost → Holy Spirit outpouring
📯 Trumpets → Second Coming call
💀 Day of Atonement → National repentance
🏕 Tabernacles → Messianic Kingdom

Key Principle: YHWH's calendar teaches His redemptive plan through sacred seasons.

🍞 Leviticus 24:1-9 — The Golden Lampstand & Showbread

🕯 Pure olive oil for continual burning (Lev 24:2).
✨ Aaron tends lamps from evening to morning (Lev 24:3-4).
🍞 Twelve loaves on golden table — one per tribe (Lev 24:5-6).
🧂 Pure frankincense on each row (Lev 24:7).
🔄 Fresh bread every Sabbath (Lev 24:8).
👨‍⚕️ Old bread eaten by priests in holy place (Lev 24:9).

Key Principle: Continual light and bread represent YHWH's constant provision and presence.

⚖️ Leviticus 24:10-23 — Blasphemy and Equal Justice

🤬 Half-Israelite son blasphemes YHWH's name (Lev 24:10-11).
🏛 Brought to Moses for judgment (Lev 24:12).
💀 YHWH commands: Death by stoning (Lev 24:13-16).
⚖️ Equal justice for citizen and foreigner (Lev 24:16, 22).

👁 Eye for eye, tooth for tooth principle (Lev 24:17-22):
💀 Life for life
🤕 Injury for injury  
🐄 Animal for animal

Key Principle: Proportional justice — punishment fits the crime exactly.

🏛️ Case Conclusion

Leviticus 21–24 shows escalating holiness requirements:

👨‍⚕️ Priests held to higher standards than people.
👑 High Priest held to highest standards of all.
🍞 Sacred food and light maintained continuously.
📅 Sacred calendar teaches YHWH's redemptive plan.
⚖️ Equal justice for all under YHWH's law.

👉 Lesson: "To whom much is given, much is required" — privilege brings responsibility.
`}
      </Section>

      <Section title="📖 Leviticus 25–27 — Jubilee • Redemption • Vows">
{`
📖 Leviticus 25–27: Jubilee, Redemption & Vows
🏠 Master Brief

The final chapters of Leviticus deal with long-term economic and spiritual principles:

🌾 Sabbatical year — land rest every 7th year (Lev 25:1-7).
🎺 Jubilee year — restoration every 50th year (Lev 25:8-55).
✨ Blessings for obedience, curses for disobedience (Lev 26).
💰 Redemption of vows and valuations (Lev 27).

Central theme: YHWH owns everything; we are stewards, not absolute owners.

🌾 Leviticus 25:1-7 — The Sabbatical Year

7️⃣ Every seventh year, land must rest (Lev 25:2-4).
🚫 No sowing, reaping, or pruning (Lev 25:4-5).
🍇 What grows naturally belongs to everyone (Lev 25:6-7).
👨‍👩‍👧‍👦 You, servants, hired workers, strangers, animals all eat freely (Lev 25:6).

Key Principle: Even the land needs Sabbath rest — YHWH's creation rhythm applies to agriculture.

🎺 Leviticus 25:8-55 — The Jubilee Year

📊 Count seven sabbatical cycles = 49 years (Lev 25:8).
📯 50th year proclaimed with trumpet on Day of Atonement (Lev 25:9).
🏠 "Proclaim liberty throughout the land" (Lev 25:10).

Three Jubilee Principles:

1️⃣ **Land Returns to Original Owners** (Lev 25:10, 13):
🏞 No permanent sale of land — only lease until Jubilee.
💰 Sale price calculated by years remaining until Jubilee (Lev 25:15-16).
🏘 Walled city houses — 1 year redemption period only (Lev 25:29-30).
🏕 Levite cities — perpetual redemption right (Lev 25:32-34).

2️⃣ **Servants Go Free** (Lev 25:39-55):
🚫 Hebrew servants not treated as slaves (Lev 25:39-43).
⏳ Serve only until Jubilee, then released with family (Lev 25:40-41).
🌍 Foreign slaves may be kept permanently (Lev 25:44-46).
💰 Hebrew may buy himself back anytime (Lev 25:47-55).

3️⃣ **Debts Forgiven**:
💸 All debts cancelled.
🔄 Fresh economic start for everyone.
⚖️ Prevents permanent poverty or extreme wealth concentration.

Key Principle: YHWH owns the land; humans are temporary stewards. Economic justice required every 50 years.

✨ Leviticus 26 — Blessings and Curses

**Blessings for Obedience** (Lev 26:3-10):
☔ Rain in season, abundant harvests (Lev 26:4-5).
🕊 Peace in the land, no wild beasts or war (Lev 26:6).
⚔️ Victory over enemies (Lev 26:7-8).
👨‍👩‍👧‍👦 Fruitfulness and population growth (Lev 26:9).
🏛 YHWH's presence among them (Lev 26:11-12).

**Curses for Disobedience** (Lev 26:14-39):
🦠 Disease, fever, consumption (Lev 26:16).
💔 Defeat by enemies, fled when not pursued (Lev 26:17).
☀️ Sky like iron, earth like bronze — drought (Lev 26:19).
🦴 Strength spent in vain, land yields nothing (Lev 26:20).
🐻 Wild beasts kill children and cattle (Lev 26:22).
⚔️ Sword, pestilence, famine (Lev 26:25-26).
🍖 Cannibalism in siege conditions (Lev 26:29).
🏛 High places destroyed, temples desolated (Lev 26:30).
🌍 Scattered among nations, land desolate (Lev 26:33).

**Hope for Restoration** (Lev 26:40-45):
💔 If they confess iniquity and humble hearts (Lev 26:40-41).
📜 YHWH remembers covenant with Abraham, Isaac, Jacob (Lev 26:42).
🌍 Land enjoys Sabbaths while desolate (Lev 26:43).
♾️ Covenant not broken despite judgment (Lev 26:44-45).

Key Principle: YHWH's blessings conditional on obedience; judgment certain but not final.

💰 Leviticus 27 — Valuations and Vows

👨 Persons dedicated to YHWH — redemption values (Lev 27:2-8):
💪 Male 20-60 years: 50 shekels
👩 Female 20-60 years: 30 shekels  
👦 Male 5-20 years: 20 shekels
👧 Female 5-20 years: 10 shekels
👴 Male over 60: 15 shekels
👵 Female over 60: 10 shekels
🍼 1 month to 5 years: Male 5 shekels, Female 3 shekels
💸 Poor may pay according to ability (Lev 27:8).

🏠 Houses dedicated — priest evaluates, add 20% to redeem (Lev 27:14-15).

🌾 Fields dedicated:
🌱 Ancestral land returns at Jubilee if not redeemed (Lev 27:16-21).
🛒 Purchased land returns to original owner at Jubilee (Lev 27:22-24).

🐄 Animals dedicated:
✅ Clean animals sacrificed or redeemed + 20% (Lev 27:11-13).
🥇 Firstborn already belongs to YHWH (Lev 27:26).
💀 Devoted things cannot be redeemed (Lev 27:28-29).

🌾 Tithe — 10% of produce and animals belongs to YHWH (Lev 27:30-33).

Key Principle: What is vowed to YHWH is sacred and must be honored or properly redeemed.

📖 Case Conclusion

Leviticus 25–27 shows YHWH's comprehensive social order:

🌾 Land needs rest — ecological wisdom.
🎺 Jubilee prevents permanent economic inequality.
✨ National blessing depends on national obedience.
💰 Vows to YHWH are sacred and binding.
🏠 Everything ultimately belongs to YHWH.

👉 Lesson: True freedom comes from recognizing YHWH's ownership and living within His economic and social order.

🔥 The End of Leviticus

Leviticus concludes the instruction given at Mount Sinai, preparing Israel for wilderness journey and eventual entry into the Promised Land. Every detail points toward holiness — not just ritual purity, but comprehensive life transformation that reflects YHWH's character in worship, relationships, economics, and justice.

"These are the commandments which YHWH commanded Moses for the children of Israel on Mount Sinai" (Lev 27:34).
`}
      </Section>

      {/* Reflection Box */}
      <ReflectionBox />

      <footer className="text-center text-slate-700 text-sm mt-16 mb-6">
        <p>© 2025 WitnessProject.net | Book of Life Scroll Series III — Leviticus</p>
      </footer>
    </div>
  );
}