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
        className="cursor-pointer select-none flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-200 via-sky-100 to-fuchsia-100 hover:from-amber-300 hover:to-fuchsia-200 transition-all"
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
      className="mt-10 bg-white/70 border border-amber-200 rounded-xl p-4 shadow-md"
    >
      <h3 className="font-semibold text-slate-800 mb-2">
        Reflect / Ask as {user?.username || user?.firstName}
      </h3>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your reflection or question..."
        className="w-full p-3 border border-amber-300 rounded-lg resize-none focus:ring focus:ring-amber-300 min-h-[100px]"
      />
      <button
        disabled={status !== "idle"}
        className="mt-3 px-5 py-2 bg-gradient-to-r from-amber-400 to-fuchsia-400 text-white rounded-lg font-semibold shadow hover:opacity-90 disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : status === "sent" ? "Sent!" : "Submit"}
      </button>
    </form>
  );
}

/* ---------------------------------------------------
   Main Genesis Page
--------------------------------------------------- */
export default function GenesisScroll() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 via-emerald-100 via-sky-200 via-indigo-200 to-fuchsia-200 text-slate-900 px-4 sm:px-10 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          📜 Genesis Scroll
        </h1>
        <p className="text-lg mt-2 text-slate-700 italic">
          From Creation to Covenant — Witness Study Edition
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <Link
          href="/sanctuary"
          className="bg-white/10 hover:bg-white/20 border border-amber-400/30 px-6 py-3 rounded-xl text-amber-700 hover:text-amber-900 font-semibold transition-all duration-300"
        >
          🕊 Return to Sanctuary
        </Link>
        <Link
          href="/sanctuary/scrolls/exodus"
          className="bg-white/10 hover:bg-white/20 border border-amber-400/30 px-6 py-3 rounded-xl text-amber-700 hover:text-amber-900 font-semibold transition-all duration-300"
        >
          ⚡ Continue to Exodus →
        </Link>
        <Link
          href="/sanctuary/scrolls/leviticus"
          className="bg-white/10 hover:bg-white/20 border border-amber-400/30 px-6 py-3 rounded-xl text-amber-700 hover:text-amber-900 font-semibold transition-all duration-300"
        >
          🔥 Jump to Leviticus →
        </Link>
      </div>

      {/* ------------------  Genesis Sections ------------------ */}
      <Section title="📖 Genesis 1–6 — Master Brief (Lesson)" defaultOpen>
{`
📖 Genesis 1–6: Master Brief (Lesson)
⚖️ Case Summary

Genesis 1–6 records the beginning of humanity:

🌍 Creation of the world.

🐍 The Fall into sin.

🔪 The first murder.

📜 Generations from Adam to Noah.

⚔️ The corruption of the earth through both human wickedness and heavenly rebellion.

Three witnesses stand out:

👤 Adam — who saw life before and after sin.

🚶‍♂️ Enoch — who walked with God even while born into sin.

🌊 Noah — who survived judgment, but should have lived daily like Enoch.

🌍 Genesis 1 – Creation (Genesis 1:1–31; 2:1–3)

🕊️ Six days of creation: light, sky, land, plants, sun, moon, stars, animals, and mankind.

✨ Seventh day: God rested.

💡 Humanity was created to walk Spirit-led, in harmony with God.

🌱 Genesis 2 – The Garden (Genesis 2:7–25)

👤 Adam formed from dust, life breathed into him by YHWH.

🪴 Placed in Eden with every tree except the Tree of Knowledge.

💞 Eve created as companion.

Key Principle: The forbidden tree = not just fruit, but a shift from Spirit → intellect autopilot.

🐍 Genesis 3 – The Fall (Genesis 3:1–24)

🐍 Serpent deceives Eve.

🍎 Adam and Eve eat the fruit.

👁️ Eyes opened → shame, fear, hiding from God.

🌄 Expelled from Eden.

Key Principle: Sin wasn’t eating fruit — it was awakening self-consciousness: shame, pride, and reasoning against God.

🔪 Genesis 4 – Cain & Abel (Genesis 4:1–16)

🌾 Cain (farmer) and 🐑 Abel (shepherd) offer gifts.

✨ God accepts Abel’s, rejects Cain’s.

💢 Cain kills Abel out of jealousy.

❌ Cain marked to wander.

Key Principle: First fruit of intellect’s corruption = envy, comparison, violence.

📜 Genesis 5 – Generations of Adam (Genesis 5:1–32)

👤 Adam lived 930 years.

📖 Seth through Jared carried the line.

🚶‍♂️ Enoch (AM 622–987) walked with God → God took him (no death).

🕰️ Methuselah lived until the year of the Flood (969 yrs).

👶 Lamech fathered Noah.

Timeline Overlaps:

⏳ Adam (AM 0–930) & Enoch (AM 622–987) overlapped 308 years.

Adam could tell Enoch firsthand about Eden.

Enoch proved that walking with God is still possible even with sin’s DNA.

Noah later heard of Enoch’s walk through his father Lamech and grandfather Methuselah.

🌊 Genesis 6 – Corruption & Sons of God (Genesis 6:1–9)

👫 “Sons of God” took human wives → produced the Nephilim (giants, heroes of old).

💔 Humanity’s wickedness grew.

⏳ Lifespans limited to 120 years.

🌊 God prepared the flood. Only Noah found favor.

Key Principle:

The longer man lives, the deeper corruption sets in.

Evil matures with age; it doesn’t fade.

Noah was righteous, but his model should have been Enoch’s daily walk.

⚔️ The Sons of God & World Mythologies

👼 “Sons of God” = heavenly beings who crossed into human women.

🗿 Offspring = Nephilim, giants, mighty men.

📜 YHWH acknowledged their existence but condemned them as corruption.

🌍 Cultural Echoes:

🪓 Norse: Odin, Thor, jötnar (giants).

🏛️ Greek: Zeus, Hercules, demigods.

🏺 Mesopotamian: Gilgamesh.

Truth:

Mythology = mankind’s twisted memory of the Nephilim.

Scripture = YHWH’s verdict: they existed, but they were rebellion, not blessing.

✨ Spiritual Thread

Adam (Genesis 2–3; 5:3–5) → Witness of what was lost.

Enoch (Genesis 5:21–24) → Witness of what can be regained.

Noah (Genesis 6:9; 7:6) → Witness of survival, but should have walked like Enoch.

Sons of God (Genesis 6:1–4) → Their corruption explains mythologies, acknowledged but condemned by YHWH.

🧾 Case Conclusion

Genesis 1–6 shows a full pattern:

🌍 Creation in harmony.

🐍 Fall into intellect and self-consciousness.

🔪 Sin spreads (envy, murder, violence).

📜 Adam warns of what was lost.

🚶‍♂️ Enoch proves fellowship with God is still possible.

🌊 Noah survives judgment.

⚔️ Sons of God explain myths but are exposed as rebellion.

👉 Lesson: YHWH calls us not just to survive like Noah, but to walk like Enoch — Spirit-led even while born into sin.
`}
      </Section>

      <Section title="📜 Genesis 7–9 — Judgment • Wandering • Covenant">
{`
📜 Genesis 7–9 — Judgment, Wandering, Covenant
🌊 Gen 7 — Flood Begins

Noah, family, animals enter Ark (7:1–9).

7 days → waters come (7:10).

40 days/nights of rain (7:12).

All outside Ark perish (7:21–23).
Case Note: Cain — Mark protected him (4:15) but not from torment. For 40 days he suffered storm & wreckage, unable to die swiftly. Curse remained.
Reading: Flood = judgment, Ark = salvation. Cain = living proof YHWH’s words endure.

🌿 Gen 8 — Waters Recede

God remembers Noah (8:1). Ark rests Ararat (8:4).

Dove w/ olive leaf (8:11).

Noah exits, builds altar (8:20).

God promises: no more curse on ground by flood (8:21–22).
Case Note: Cain cursed the ground w/ Abel’s blood; Noah sanctifies it by clean offering. Vengeance vs. Mercy.
Reading: Olive leaf = hope. Noah = new Adam. Cain still wandering, curse unlifted. Nothing forgotten.

🌈 Gen 9 — Covenant w/ Noah

Blessing: “Be fruitful, multiply, fill the earth” (9:1).

Eat animals, not blood (9:3–4).

Covenant: no more global flood (9:11).

Sign: Rainbow (9:12–17).
Case Note: Cain’s mark = curse+mercy; Rainbow = mercy restraining wrath. Both eternal signs.
Rainbow Defined: 7 colors — ❤️Red (blood), 🧡Orange (strength), 💛Yellow (light), 💚Green (life), 💙Blue (heaven), 💜Indigo (mystery), 💟Violet (royalty).
True rainbow = YHWH’s bow of war hung in peace. Counterfeits twist colors/order or claim it for man’s pride.
Reading: Covenant restraint, not end of judgment. Cain still wandering. Only Yeshua’s blood can lift curse — but only by faith + fruits. Cain never did.

📊 Timeline

Cain: Mark → Flood suffering → Still wandering → Curse unlifted.
Noah: Righteous → Ark preserved → Altar mercy → Rainbow covenant.

✨ Takeaway

Sin unrepented = wandering (Cain).

Faithful obedience = covenant blessing (Noah).

Rainbow = YHWH’s covenant sign, not man’s.

Christ opens redemption, but only for those who walk in Him.

⚖️ Seal: The covenant stands, the curse remains, and the choice is ours — wander with Cain or walk with Christ.
`}
      </Section>

      <Section title="📜 Genesis 10–11 — Nations • Babel • Abram’s Line">
{`
🌍 Gen 10 — Table of Nations
    •    Descendants of Noah: Japheth, Ham, Shem (10:1).
    •    70 nations listed (10:32).
    •    Nimrod (Ham’s line): mighty hunter, built Babel & Nineveh (10:8–12).
Case Note: Cain built 1st city (4:17) to hide his wandering; Nimrod repeats this spirit → empire & rebellion.
Reading: Nations scatter, but Shem’s line carries covenant seed. Cain’s restless city-spirit lives on in Nimrod.

🏗️ Gen 11 — Tower of Babel
    •    People: “Let’s build a city & tower to make a name” (11:4).
    •    YHWH confuses language, scatters them (11:7–9).
    •    Genealogy of Shem → Abram (11:10–26).
    •    Abram introduced: son of Terah, husband of Sarai, uncle to Lot (11:27–32).
Case Note: Cain feared being hidden from God’s face; Babel climbs back without Him. Both reject God’s way.
Reading: Tower = human pride. Pentecost later unites languages by Spirit (Acts 2). Abram chosen as God’s answer.

📊 Timeline (Anno Mundi / AM)
    •    Noah b.1056, d.2006. Flood: AM 1656.
    •    Shem b.1558, d.2158. Alive in Abram’s day.
    •    Arphaxad b.1658, d.2096.
    •    Shelah b.1693, d.2126.
    •    Eber b.1723, d.2187 (“Hebrews” named from him).
    •    Peleg b.1757, d.1996 (“division” in his days).
    •    Reu b.1787, d.2026.
    •    Serug b.1819, d.2049.
    •    Nahor b.1849, d.1997.
    •    Terah b.1878, d.2083.
    •    Abram b.1948; call begins age 75 → AM 2023.

✨ Takeaway
    •    Humanity repeated Cain’s rebellion: building prideful cities apart from YHWH.
    •    Nimrod & Babel = fruit of wandering pride.
    •    God scattered man but preserved Shem’s line.
    •    Abram introduced: not to make his own “name,” but to walk in YHWH’s Name.

⚖️ Seal: The nations scattered, Babel fell, but Shem’s line endured — proving man’s towers fall, but God’s covenant stands.
`}
      </Section>

      <Section title="📜 Genesis 12–15 — The Call & Covenant">
{`
📜 Genesis 12–15 — The Call & Covenant (Timeline w/ Ages & AM Years)
⭐ Gen 12 — Abram Called

Event: YHWH calls Abram to leave Haran.

Abram 75 (AM 2023).

Abram departs Haran with Sarai & Lot.

Famine → Egypt; Abram calls Sarai his sister; Pharaoh takes her but YHWH intervenes.

Abram 75–76 (AM 2023–2024).

Case Note: Cain wandered cursed; Abram wanders chosen. Both left home, but only Abram walked in promise.

🐑 Gen 13–14 — Lot & the Kings

Abram & Lot separate: Lot to Sodom, Abram remains in Canaan.

Abram 76–77 (AM 2024–2025).

War of the kings → Abram rescues Lot.

Abram 77–78 (AM 2025–2026).

Melchizedek, king-priest of Salem, blesses Abram.

Abram 77–78 (AM 2025–2026).

Case Note: Cain gave no proper offering; Abram gives a tenth to Melchizedek, showing faith.

👑 Melchizedek — King & Priest of Righteousness

Appears suddenly in Gen 14:18–20.

Abram 77–78 (AM 2025–2026).

📌 Why He Matters

First priesthood in Scripture — long before Moses.

Holds both crown & priesthood — roles later separated in Israel.

Name = King of Righteousness, City = Peace.

Psalm 110:4 → “You are a priest forever after the order of Melchizedek.” Applied to Messiah (Hebrews 5–7).

Abram honors him by faith — covenant flows from faith, not law.

⚖️ Case Note: Cain withheld his best and was cursed. Abram freely gave to Melchizedek and was blessed.

✨ Messiah Connection: Yeshua is the greater High Priest-King, forever in the order of Melchizedek — uniting righteousness, sacrifice, blessing, and peace in one eternal role.

🌌 Gen 15 — Covenant Confirmed

YHWH: “Fear not Abram, I am your shield, your reward.”

Promise: Descendants like the stars; land from Egypt to Euphrates.

Covenant sealed with sacrifice and smoking firepot.

Abram 78 (AM 2027–2028).

Case Note: Abel’s blood cried vengeance; Abram’s covenant blood declares promise.

🔥 Firepot Explained

Hebrew: תַּנּוּר (tannur) = oven, furnace, brazier.

Always a clay vessel for burning coals — never a smoking pipe.

Symbol:

Smoke = hidden presence of YHWH.

Torch = light of revelation.

Passing between sacrifices = God sealing covenant by Himself, while Abram slept.

⚖️ Seal: The firepot and torch show Abram’s covenant rests not on man’s strength, but God’s presence alone.

📷 (look at the photos attached)

📊 Timeline — Abram’s Age & AM Year

Abram 75 (AM 2023): Call out of Haran.

Abram 75–76 (AM 2023–2024): Famine → Egypt.

Abram 76–77 (AM 2024–2025): Separation from Lot.

Abram 77–78 (AM 2025–2026): War of Kings & Melchizedek blesses Abram.

Abram 78 (AM 2027–2028): Covenant of Firepot.

Overlapping Witnesses:

Noah: 1056–2006 (just passed).

Shem: 1558–2158 (alive, 465 yrs when Abram called).

Eber: 1723–2187 (alive, witness of Abram).

🕊 Where Does Job Fit?

Likely alive in the same generation as Abram.

Served as priest for his family (Job 1:5).

Lived in Uz, a Shemite region.

Lifespan (Job 42:16) fits patriarchal era.

Ezekiel 14:14 pairs him with Noah — a righteous man outside covenant line.

👉 Job = a parallel witness of righteousness outside Abram’s household, alive in the same era.

✨ Takeaway

Abram’s call shows wandering can be redeemed: curse turns to covenant.

Melchizedek points to Messiah — priest & king of righteousness.

Job shows God’s witness extended even beyond Abram’s line.

Covenant of stars proves God’s promise is bigger than man’s fear.

Our faith, not our works, secures covenant blessing.

⚖️ Seal

Cain wandered in curse; Abram wandered in promise — proving exile becomes destiny when walked with YHWH.
`}
      </Section>

      <Section title="📜 Genesis 16–20 — Hagar • Sodom • Abimelech">
{`
🌿 Gen 16 — Hagar & Ishmael (AM 2091)

Sarai gives Hagar → Hagar conceives Ishmael (Gen 16:1–4).

Sarai mistreats Hagar → she flees (Gen 16:5–6).

Angel of YHWH promises Ishmael a great line; “wild donkey of a man” (Gen 16:7–12).

Hagar calls YHWH El Roi (“God who sees me”) (Gen 16:13–14).

AM 2091: Ishmael born, Abram 86 (Gen 16:15–16).

📌 Case Note: Human impatience creates lasting conflict.
📌 Ishmael’s Legacy: Father of 12 princes (Gen 25:12–18). Ancestor of Arab peoples.

Isaac → covenant → Judaism & Christianity.

Ishmael → great nation → Islam.

✨ Gen 17 — Covenant of Circumcision (AM 2104)

Abram 99 → YHWH appears, confirms covenant (Gen 17:1–2).

Abram → Abraham; Sarai → Sarah (Gen 17:5,15).

Promise: Isaac to be born within 1 year (Gen 17:16–19).

Covenant sign: circumcision for all males (Gen 17:9–14).

Abraham circumcises all males same day (Gen 17:23–27).

📌 Case Note: Covenant sealed in flesh. Isaac, not Ishmael, = chosen heir.

🔥 Gen 18 — Three Visitors (AM 2105)

Abraham at Mamre, hosts 3 men (Gen 18:1–8).

Sarah laughs at promise of a son (Gen 18:9–15).

YHWH: “Is anything too hard for Me?” (Gen 18:14).

Abraham intercedes for Sodom (50 → 10 righteous) (Gen 18:22–33).

📌 Case Note: Abraham models intercession. Isaac’s name = “he laughs.”

⚖️ Gen 19 — Sodom & Gomorrah Destroyed (AM 2105)

Two angels enter Sodom; Lot welcomes them (Gen 19:1–3).

Men demand abuse → struck blind (Gen 19:4–11).

Lot, wife, daughters flee (Gen 19:12–22).

YHWH rains fire & brimstone on Sodom & Gomorrah (Gen 19:23–25).

Lot’s wife looks back → pillar of salt (Gen 19:26).

Lot’s daughters bear:

Moab → Moabites (Gen 19:37).

Ben-Ammi → Ammonites (Gen 19:38).

📌 Case Note: Sodom’s corruption judged; Lot spared for Abraham’s sake.
📌 Lot’s Wife: Judgment restructured her into salt. 4,000 yrs erosion erased features. Dead Sea pillars = reminders, not her literal body.

👑 Gen 20 — Abraham & Abimelech (AM 2105–2106)

Abraham calls Sarah his “sister” (Gen 20:2).

Abimelech takes her → YHWH warns him in dream (Gen 20:3–7).

Abimelech returns Sarah, rebukes Abraham, compensates him (Gen 20:8–16).

Abraham intercedes → YHWH heals Abimelech’s household (Gen 20:17–18).

📌 Case Note: Abraham repeats weakness; YHWH still preserves covenant line.

🗓️ Timeline

AM 2091: Ishmael born (Abram 86).

AM 2104: Covenant of circumcision (Abraham 99).

AM 2105: Isaac promised (Abraham 100 / Sarah 90).

AM 2105: Sodom destroyed; Lot’s wife → salt. Moab & Ammon born.

AM 2105–2106: Abraham with Abimelech.

📌 Master Brief

Gen 16 (AM 2091) → Ishmael born → legacy split: Isaac = covenant, Ishmael = nations.

Gen 17 (AM 2104) → Covenant sealed, Isaac promised.

Gen 18 (AM 2105) → Abraham hosts YHWH, intercedes.

Gen 19 (AM 2105) → Sodom judged; Lot’s wife = salt sign; Moab & Ammon born.

Gen 20 (AM 2105–2106) → Abraham & Abimelech → Sarah preserved for covenant.
`}
      </Section>

      <Section title="📜 Genesis 21–25 — Promise Fulfilled • Legacy Continues">
{`
🍼 Gen 21 — Isaac’s Birth & Ishmael Sent Away

AM 2108 → Isaac born when Abraham is 100 (Gen 21:1–7).
AM ~2122–2124 → Ishmael (teen ~14–16 yrs) mocks Isaac; Sarah demands they leave (Gen 21:8–10).
God confirms: Isaac = covenant heir; Ishmael = great nation too (Gen 21:11–13).
Hagar & Ishmael wander in desert; God provides water & promise (Gen 21:14–21).

Case Note: Isaac = Promise ✨ | Ishmael = Flesh 🌍.
Separation marks covenant vs non-covenant nations.

🔥 Gen 22 — The Test of Abraham

AM ~2133 → Isaac ~25 yrs when Abraham is tested (Gen 22:1–2).
Abraham prepares to sacrifice Isaac on Mount Moriah (Gen 22:3–10).
God stops him, provides ram instead → substitution (Gen 22:11–14).
Covenant promise renewed to Abraham’s offspring (Gen 22:15–18).

Case Note: Foreshadows Messiah’s sacrifice 🙌.
Name of the place: YHWH-Yireh = The LORD will provide.

⚰️ Gen 23 — Sarah’s Death & Burial

AM 2145 → Sarah dies at 127 yrs (Gen 23:1–2).
Abraham purchases Machpelah cave for burial (Gen 23:3–20).

Case Note: First land in Canaan legally owned → faith in promise of inheritance.

💍 Gen 24 — Isaac & Rebekah

AM 2148 → Isaac 40 yrs old when he marries Rebekah (Gen 24:62–67).
Servant prays for a sign at the well; Rebekah fulfills it (Gen 24:12–20).
Family agrees, Rebekah chooses to go immediately (Gen 24:55–58).
Marriage brings comfort after Sarah’s death (Gen 24:62–67).

Case Note: Rebekah = type of the Church 🕊.
The Father’s servant (Holy Spirit) leads the bride to the Son.

👑 Gen 25 — Abraham’s Final Years & the Twins

Abraham marries Keturah; has more children (Gen 25:1–6).
AM 2183 → Abraham dies at 175 yrs, buried in Machpelah (Gen 25:7–10).
Ishmael’s genealogy = 12 princes (Gen 25:12–18).
AM 2168 → Jacob & Esau born when Isaac is 60 (Gen 25:19–26).
Prophecy: “Two nations… older will serve younger” (Gen 25:23).
Esau despises birthright, sells it for stew (Gen 25:27–34).

Case Note: God chooses Jacob (Israel) → covenant line continues.
Esau = warning about despising spiritual inheritance.

🕰 Timeline (Anno Mundi)

AM 2108 → Isaac born (Gen 21:1–7).
AM ~2122 → Ishmael sent away (Gen 21:8–21).
AM ~2133 → Abraham tested with Isaac (Gen 22).
AM 2145 → Sarah dies (Gen 23:1–2).
AM 2148 → Isaac marries Rebekah (Gen 24:62–67).
AM 2168 → Jacob & Esau born (Gen 25:26).
AM 2183 → Abraham dies (Gen 25:7).

📌 Key Themes

Promise vs Flesh → Isaac & Ishmael.
Substitutionary Sacrifice → Ram for Isaac.
Land Promise → Machpelah burial site.
Bride of Promise → Isaac & Rebekah.
Sovereignty of God → Jacob chosen over Esau.
`}
      </Section>

      <Section title="📜 Genesis 26–30 — Isaac • Jacob • 12 Tribes Forming">
{`
🌾 Gen 26 — Isaac in Gerar

AM ~2170s → Famine strikes; God tells Isaac not to go to Egypt but stay in Canaan (Gen 26:1–6).
Isaac repeats Abraham’s mistake → says Rebekah is his sister (Gen 26:7–11).
Isaac prospers greatly; Philistines envy him, stop his wells (Gen 26:12–16).
Moves to Beersheba; God reaffirms covenant (Gen 26:23–25).
Covenant of peace made with Abimelek (Gen 26:26–33).
Esau at 40 marries Hittite women, bringing grief to Isaac and Rebekah (Gen 26:34–35).

Case Note: Blessings flow by obedience, not by fleeing famine.

🍲 Gen 27 — Jacob Steals the Blessing

AM 2188 → Isaac, old and nearly blind, plans to bless Esau (Gen 27:1–4).
Rebekah instructs Jacob to disguise himself; Jacob deceives Isaac and receives the blessing (Gen 27:5–29).
Esau returns too late, weeps bitterly; vows to kill Jacob (Gen 27:30–41).
Rebekah sends Jacob to her brother Laban in Haran (Gen 27:42–46).

Case Note: God’s sovereignty stands — blessing goes to Jacob as foretold (Gen 25:23).

🌌 Gen 28 — Jacob’s Ladder & Esau’s Marriage

AM 2188 → Isaac blesses Jacob, sends him to Paddan-Aram to find a wife (Gen 28:1–5).
Esau, seeing this, marries Mahalath, Ishmael’s daughter (Gen 28:6–9).

This intermarriage tied Esau’s line (Edom) with Ishmael’s line (Arab tribes).

These bloodlines later influenced Arabian nations, tied historically to Islam.
On his journey, Jacob dreams of a ladder reaching heaven with angels ascending/descending (Gen 28:10–12).
God reaffirms covenant: land, descendants, blessing to all nations (Gen 28:13–15).
Jacob sets up stone pillar at Bethel, vows a tithe if God protects him (Gen 28:16–22).

Case Note: Jacob encounters God personally. Bethel = “House of God.”

💍 Gen 29 — Jacob Marries Leah & Rachel

AM 2195 → Jacob arrives in Haran, meets Rachel at the well (Gen 29:1–14).
Agrees to work 7 yrs for Rachel, but Laban deceives him → gives Leah instead (Gen 29:15–25).
Marries Rachel also, agrees to work 7 more yrs (Gen 29:26–30).
Leah bears 4 sons: Reuben, Simeon, Levi, Judah (Gen 29:31–35).

Case Note: Jacob once deceived his father Isaac (Gen 27). Now Laban deceives him — a lesson in God’s justice and discipline: we often reap what we sow.

👶 Gen 30 — Jacob’s Growing Family

AM ~2200s → Rachel barren; gives Bilhah → Dan & Naphtali (Gen 30:1–8).
Leah gives Zilpah → Gad & Asher (Gen 30:9–13).
Leah bears more: Issachar, Zebulun, daughter Dinah (Gen 30:14–21).
God remembers Rachel → Joseph is born (Gen 30:22–24).
Jacob makes deal with Laban; flocks multiply through selective breeding (Gen 30:25–43).

Case Note: Foundation of 12 tribes begins forming; Joseph’s birth is a turning point.

🕰 Timeline (Anno Mundi)

AM ~2170s → Isaac in Gerar (Gen 26).
AM 2188 → Jacob deceives Isaac & flees; Esau marries Ishmael’s daughter (Gen 27–28).
AM 2195 → Jacob arrives at Haran, marries Leah & Rachel (Gen 29).
AM ~2200s → Sons of Jacob born; Joseph enters the scene (Gen 30).

📌 Key Themes

Promise confirmed through Isaac → blessings by obedience.
Jacob chosen, Esau rejected — God’s sovereignty.
Jacob’s Bethel dream → heaven’s ladder → covenant renewed.
Esau unites with Ishmael’s line → foundation of non-covenant nations.
Family of Israel begins → 11 sons + Dinah; Joseph foreshadows deliverance.
`}
      </Section>

      <Section title="📜 Genesis 31–36 — Jacob Returns • Becomes Israel">
{`
🐏 Gen 31 — Jacob Flees from Laban

AM ~2205–2210 → Jacob prospers greatly, Laban’s sons grow hostile (Gen 31:1–2).
God commands Jacob to return to Canaan (Gen 31:3).
Jacob secretly departs with wives, children, and flocks (Gen 31:17–21).
Rachel steals Laban’s household idols (Gen 31:19).
Laban pursues; God warns him in a dream not to harm Jacob (Gen 31:24).
They make covenant at Mizpah, swearing peace (Gen 31:43–55).

Case Note: God protects Jacob from Laban → covenant of peace formed, showing God fights for His chosen.

👼 Gen 32 — Jacob Prepares to Meet Esau

AM ~2210 → Jacob sends messengers to Esau, who approaches with 400 men (Gen 32:3–6).
Fears Esau; prays to God for deliverance (Gen 32:9–12).
Sends gifts ahead as peace offering (Gen 32:13–21).
That night Jacob wrestles with a divine man/angel until dawn (Gen 32:24–30).

His name changed to Israel = “He struggles with God.”

Walks with limp as reminder of encounter.

Case Note: Transformation of Jacob → from deceiver to Israel. Victory comes by clinging to God.

🤝 Gen 33 — Jacob Meets Esau

Jacob divides family in groups, bows before Esau (Gen 33:1–7).
Esau runs to embrace Jacob; reconciliation instead of violence (Gen 33:4).
Jacob offers gifts; Esau accepts reluctantly (Gen 33:8–11).
Esau returns to Seir; Jacob settles near Shechem, builds altar “El Elohe Israel” (Gen 33:18–20).

Case Note: God turns Esau’s heart from wrath to peace. Jacob learns reconciliation is possible when God intervenes.

⚔️ Gen 34 — Dinah & Shechem

Dinah, daughter of Leah, is violated by Shechem son of Hamor (Gen 34:1–2).
Shechem desires to marry her; offers bride-price (Gen 34:3–12).
Jacob’s sons deceitfully demand all males be circumcised (Gen 34:13–17).
On 3rd day, Simeon & Levi slaughter the men of Shechem (Gen 34:25–29).
Jacob fears reprisal from Canaanites (Gen 34:30).

Case Note: Shows danger of deceit and vengeance. Israel’s reputation in Canaan is damaged.

🕊 Gen 35 — Return to Bethel & Deaths

God commands Jacob to return to Bethel and build an altar (Gen 35:1).
Jacob buries foreign idols under oak at Shechem (Gen 35:2–4).
God reaffirms Jacob’s name as Israel and renews covenant promises (Gen 35:9–15).
Rachel dies giving birth to Benjamin, buried near Bethlehem (Gen 35:16–20).
Reuben sins by sleeping with Bilhah (Gen 35:22).
AM 2228 → Isaac dies at 180 yrs; Jacob & Esau bury him at Machpelah (Gen 35:27–29).

Case Note: Bethel encounter renews covenant; but family strife continues. Rachel’s death marks transition into new generation.

📜 Gen 36 — Esau’s Descendants (Edom)

Lists Esau’s wives, children, and chiefs (Gen 36:1–43).
Esau settles in Seir, becomes father of Edomites.
Kings of Edom listed — established before Israel had kings.

Case Note: God fulfills His word: Esau also becomes a great nation. But Edom is outside the covenant.

🕰 Timeline (Anno Mundi)

AM ~2205–2210 → Jacob flees Laban, covenant at Mizpah (Gen 31).
AM ~2210 → Jacob wrestles with God, name changed to Israel (Gen 32).
AM ~2210 → Jacob reconciles with Esau, settles near Shechem (Gen 33).
AM ~2210s → Dinah violated; Simeon & Levi slaughter Shechem (Gen 34).
AM 2228 → Isaac dies at 180 yrs, buried by Jacob & Esau (Gen 35:28–29).
AM 2200s–2230s → Esau’s line grows into Edom (Gen 36).

📌 Key Themes

God protects Jacob → covenant line secured.
Jacob becomes Israel → new identity by wrestling with God.
Esau reconciles → God can turn wrath to peace.
Dinah’s tragedy → human sin damages testimony.
Rachel dies, Isaac dies → covenant passes fully into hands of Israel’s 12 sons.
Esau’s nation (Edom) grows, but outside covenant.
`}
      </Section>

      <Section title="📜 Genesis 37–41 — Joseph Season Pt. 1">
{`
🌙 Gen 37 — Joseph’s Dreams & Betrayal

AM ~2240 → Joseph is 17, Jacob’s favorite son (Gen 37:2–3).
Joseph dreams his brothers bow to him; they hate him (Gen 37:5–11).
Brothers plot to kill him; Reuben convinces them not to (Gen 37:18–22).
They sell Joseph to Ishmaelite traders → taken to Egypt (Gen 37:25–28).
Brothers deceive Jacob with Joseph’s coat dipped in goat’s blood (Gen 37:31–35).

Case Note: Pattern of jealousy & betrayal. Joseph = type of Messiah: rejected by his own, yet destined to rule.

💔 Gen 38 — Judah & Tamar

Judah leaves brothers, marries Canaanite woman (Gen 38:1–5).
His sons Er & Onan die for wickedness (Gen 38:6–10).
Tamar disguises herself as a prostitute, conceives by Judah (Gen 38:13–18).
She bears Perez & Zerah (Gen 38:27–30).

Perez becomes ancestor of King David and Messiah (Ruth 4:18–22; Matt 1:3).

Case Note: Even in human sin, God preserves covenant line → Perez = link to Messiah.

🏠 Gen 39 — Joseph in Potiphar’s House

Joseph serves Potiphar in Egypt; God prospers him (Gen 39:1–6).
Potiphar’s wife tries to seduce Joseph; he refuses (Gen 39:7–12).
She falsely accuses him → Joseph imprisoned (Gen 39:13–20).
God grants Joseph favor with prison warden (Gen 39:21–23).

Case Note: Joseph stands righteous under pressure; false accusation parallels Yeshua’s later suffering.

🍷 Gen 40 — Joseph Interprets Dreams

Pharaoh’s cupbearer & baker imprisoned with Joseph (Gen 40:1–3).
Each dreams a dream; Joseph interprets (Gen 40:5–19).

Cupbearer restored.

Baker executed.
Cupbearer forgets Joseph for 2 years (Gen 40:23).

Case Note: Joseph’s gift (dream interpretation) begins to open doors, though waiting tests his faith.

🌾 Gen 41 — Pharaoh’s Dreams & Joseph’s Rise

AM ~2257 → Pharaoh dreams of 7 fat cows, 7 lean cows; 7 full heads of grain, 7 thin heads (Gen 41:1–7).
Cupbearer remembers Joseph; he interprets dreams (Gen 41:9–32).
Meaning: 7 years of plenty → 7 years of famine.
Joseph advises storing grain.
Pharaoh elevates Joseph to 2nd in command over Egypt (Gen 41:38–44).
Joseph marries Asenath, daughter of Egyptian priest (Gen 41:45).
Two sons born: Manasseh & Ephraim (Gen 41:50–52).
Famine begins; all nations come to Egypt for food (Gen 41:53–57).

Case Note: Joseph exalted from prison to palace. Symbol of Messiah: humiliation → exaltation to save nations.

🕰 Timeline (Anno Mundi)

AM ~2240 → Joseph 17, sold into slavery (Gen 37).
AM ~2240s → Judah & Tamar, Perez born (Gen 38).
AM ~2240s → Joseph in Potiphar’s house → prison (Gen 39).
AM ~2245 → Dreams of cupbearer & baker (Gen 40).
AM ~2257 → Pharaoh’s dreams; Joseph exalted at 30 (Gen 41:46).

📌 Key Themes

God uses betrayal to bring salvation.
Judah’s failure → yet Perez leads to Messiah.
Joseph resists temptation → faithful in prison.
Dreams = divine communication guiding nations.
God exalts the humble → Joseph raised to rule Egypt.
`}
      </Section>

      <Section title="📜 Genesis 37–50 — Joseph Season Full Lesson & Egypt’s 18th Dynasty">
{`
🌙 Gen 37 — Joseph’s Dreams & Betrayal

AM ~2240 → Joseph is 17, Jacob’s favorite son (Gen 37:2–3).
Joseph dreams of ruling over his brothers (Gen 37:5–11).
Brothers sell him to Ishmaelites → Egypt (Gen 37:25–28).
Jacob deceived by bloody coat (Gen 37:31–35).

Case Note: Joseph = type of Messiah: rejected by brothers, destined to save them.

💔 Gen 38 — Judah & Tamar

Judah leaves brothers; Tamar conceives twins by him (Gen 38:1–30).
Perez born → ancestor of King David & Messiah (Ruth 4:18–22; Matt 1:3).

Case Note: God preserves covenant line even through sin.

🏠 Gen 39 — Joseph in Potiphar’s House

Joseph prospers, resists Potiphar’s wife (Gen 39:1–12).
Falsely accused → imprisoned (Gen 39:13–20).
God gives him favor in prison (Gen 39:21–23).

Case Note: Joseph faithful under trial → foreshadows Yeshua’s innocence.

🍷 Gen 40 — Prison Dreams

Joseph interprets dreams of cupbearer & baker (Gen 40:1–22).
Cupbearer restored, baker executed.
Cupbearer forgets Joseph (Gen 40:23).
🌾 Gen 41 — Pharaoh’s Dreams & Joseph’s Rise

AM ~2257 → Pharaoh dreams of 7 fat cows/lean cows, 7 full heads/thin heads (Gen 41:1–7).
Joseph interprets: 7 years of plenty → 7 years of famine (Gen 41:25–32).
Pharaoh makes Joseph 2nd in command (Gen 41:38–44).
Joseph marries Asenath; has sons Manasseh & Ephraim (Gen 41:50–52).
Famine begins; all nations come to Egypt (Gen 41:53–57).

Case Note: Joseph exalted from prison to palace. Messiah type: humiliation → exaltation.

🌾 Gen 42–45 — Brothers Tested & Reconciliation

Brothers come for grain; Joseph tests them (Gen 42–44).
Judah offers himself in place of Benjamin (Gen 44:33–34).
Joseph reveals himself → “God meant it for good” (Gen 45:5–8).

Case Note: Forgiveness heals betrayal; Judah transformed into a leader of sacrifice.
🚚 Gen 46–47 — Jacob Moves to Egypt

Jacob and 70 family members migrate to Egypt (Gen 46:1–27).
Joseph reunites with Jacob in Goshen (Gen 46:28–34).
Jacob blesses Pharaoh (Gen 47:7–10).
Israel preserved in Goshen; prophecy of 400 years begins (Gen 47:27–31).

👑 Gen 48–49 — Jacob’s Final Blessings

Jacob blesses Joseph’s sons → Ephraim over Manasseh (Gen 48:13–20).
Blesses his 12 sons with prophetic words (Gen 49).
Tribal destinies set: Judah’s line will hold kingship until Messiah (Gen 49:10).

⚰️ Gen 50 — Death of Jacob & Joseph

Jacob dies at 147, buried in Machpelah (Gen 50:1–14).
Joseph assures brothers of forgiveness (Gen 50:15–21).
Joseph dies at 110, requests his bones be carried back to Canaan (Gen 50:22–26).

Case Note: Joseph’s bones later carried in Exodus → faith that God keeps promises.
`}
      </Section>

      <Section title="📖 Thus Ends Genesis — From the Fall to Pharaoh">
{`
🌍 The Fall of Man (Gen 3)

AM 0 → Adam & Eve created.

Disobedience → sin enters world; death begins.

Expulsion from Eden → humanity now walks under curse.

🧬 Early Generations (Gen 4–11)

AM 130 → Seth born.

AM 930 → Adam dies.

AM 1656 → Noah’s Flood.

AM 2000s → Tower of Babel → nations scattered.

🐪 Abraham’s Covenant (Gen 12–25)

AM 2008 → Abram born.

AM 2108 → Isaac born.

AM 2168 → Jacob & Esau born.

AM 2183 → Abraham dies.

God promises land, seed, blessing → covenant family established.

🌙 Jacob & Joseph (Gen 26–50)

AM 2240 → Joseph 17, sold to Egypt.

AM 2257 → Joseph 30, rises to power.

AM 2260 → Famine; Jacob’s family (70 souls) enters Egypt.

AM 2290s → Jacob dies.

AM 2360s → Joseph dies at 110.

Israel multiplies in Goshen → prophecy of foreign sojourn (Gen 15:13) begins.

🏺 Egyptian History Connection

18th Dynasty (1550–1292 BC) → Longest native dynasty.

Ahmose I → “new king who knew not Joseph” (Exod 1:8).

Thutmose I → Pharaoh at Moses’ birth.

Hatshepsut → Pharaoh’s daughter who may have raised Moses.

Thutmose III → Pharaoh of oppression.

Amenhotep II → Strong candidate for Pharaoh of the Exodus (~1446 BC).

📌 Grand Timeline From Fall → Exodus Setup

AM 0 (Creation & Fall)

AM 1656 (Flood of Noah)

AM 2000s (Babel, Nations scattered)

AM 2108 (Birth of Isaac)

AM 2168 (Birth of Jacob & Esau)

AM 2240 (Joseph sold into Egypt)

AM 2257 (Joseph rises to power)

AM 2260 (Israel enters Egypt)

AM 2360s (Joseph dies, Exodus setup begins)

⚖️ Conclusion:
Genesis began with the Fall of Man and ends with Israel in Egypt under the 18th Dynasty Pharaohs.
From Eden to Egypt — we now turn the page from covenant promises → to covenant deliverance.

👉 Next scroll begins: Exodus 1–15 — Slavery, Moses, and the Plagues of Egypt.
`}
      </Section>

      {/* Reflection Box */}
      <ReflectionBox />

      <footer className="text-center text-slate-700 text-sm mt-16 mb-6">
        <p>© 2025 WitnessProject.net | Book of Life Scroll Series I — Genesis</p>
      </footer>
    </div>
  );
}
