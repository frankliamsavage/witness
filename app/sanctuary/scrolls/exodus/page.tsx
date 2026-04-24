"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

/** Collapsible Scroll Section */
function ScrollSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="w-full max-w-4xl bg-gray-900/60 border border-indigo-700/40 rounded-xl shadow-[0_0_12px_rgba(79,70,229,0.6)] overflow-hidden transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-4 hover:bg-gray-900 text-left transition-colors"
      >
        <h2 className="text-xl md:text-2xl font-semibold text-indigo-300">{title}</h2>
        <span className="text-indigo-400 text-lg">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 text-gray-200 whitespace-pre-wrap leading-relaxed">
          {children}
        </div>
      )}
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
      <div className="text-center text-gray-300 bg-gray-900/70 border border-indigo-700/40 rounded-xl p-4 shadow-md mt-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400 mx-auto mb-2"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isSignedIn)
    return (
      <div className="text-center text-gray-300 bg-gray-900/70 border border-indigo-700/40 rounded-xl p-4 shadow-md mt-10">
        Please{" "}
        <Link href="/sign-in" className="underline font-medium text-indigo-400">
          sign in
        </Link>{" "}
        to share your reflections or questions.
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 bg-gray-900/70 border border-indigo-700/40 rounded-xl p-4 shadow-md"
    >
      <h3 className="font-semibold text-indigo-300 mb-2">
        Reflect / Ask as {user?.username || user?.firstName}
      </h3>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your reflection or question..."
        className="w-full p-3 border border-indigo-500/40 bg-gray-800/60 text-white placeholder-gray-400 rounded-lg resize-none focus:ring focus:ring-indigo-400 min-h-[100px]"
      />
      <button
        disabled={status !== "idle"}
        className="mt-3 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-semibold shadow hover:opacity-90 disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : status === "sent" ? "Sent!" : "Submit"}
      </button>
    </form>
  );
}

export default function ExodusScroll() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-black via-gray-900 to-black text-white py-12 px-4 md:px-8 gap-8">
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-400 text-center drop-shadow-[0_0_12px_rgba(99,102,241,0.8)]">
        ⚡ Exodus: The Deliverance of Israel
      </h1>

      {/* Top Navigation */}
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <Link
          href="/sanctuary/scrolls/genesis"
          className="bg-indigo-700/40 hover:bg-indigo-600/60 border border-indigo-500/40 px-6 py-3 rounded-xl text-indigo-200 hover:text-white font-semibold shadow-lg transition-all duration-300"
        >
          ← Back to Genesis
        </Link>
        <Link
          href="/sanctuary"
          className="bg-indigo-700/40 hover:bg-indigo-600/60 border border-indigo-500/40 px-6 py-3 rounded-xl text-indigo-200 hover:text-white font-semibold shadow-lg transition-all duration-300"
        >
          🕊 Return to Sanctuary
        </Link>
        <Link
          href="/sanctuary/scrolls/leviticus"
          className="bg-indigo-700/40 hover:bg-indigo-600/60 border border-indigo-500/40 px-6 py-3 rounded-xl text-indigo-200 hover:text-white font-semibold shadow-lg transition-all duration-300"
        >
          🔥 Continue to Leviticus →
        </Link>
      </div>

      {/* Exodus Posts */}
      <ScrollSection title="📜 Exodus (Chs. 1–4)" defaultOpen>
{`Bondage, Birth & Call of Moses

🔗 Timeline Continuity (Genesis ➝ Exodus)
- AM 2108 ➝ Abraham born (Gen 11:26–32)
- AM 2168 ➝ Covenant with Abraham (Gen 12; 15; 17)
- AM 2238 ➝ Isaac born (Gen 21:1–7)
- AM 2298 ➝ Jacob born (Gen 25:19–26)
- AM 2368 ➝ Joseph sold into slavery (Gen 37:1–36)
- AM 2399 ➝ Jacob’s family enters Egypt (Gen 46:1–7)
- AM 2430 ➝ A new Pharaoh arises who “knew not Joseph” (Exod 1:8)

🏺 Historical Possibilities (Pharaohs of Exodus) (Exod 1:8–14)
- 15th Century BC Date (Early Exodus view)
   • Pharaoh of the Oppression: Thutmose I (1506–1493 BC) or Thutmose III (1479–1425 BC)
   • Pharaoh of the Exodus: Amenhotep II (1450–1425 BC)
- 13th Century BC Date (Late Exodus view)
   • Pharaoh of the Oppression: Seti I (1290–1279 BC)
   • Pharaoh of the Exodus: Ramesses II (1279–1213 BC), linked to Raamses (Exod 1:11)

✡️ Jewish Tradition: Pharaoh of the decree (infant-killing) is separate from the Pharaoh of the Exodus.
✝️ Christian Tradition: Often casts Ramesses II as Pharaoh of both oppression & Exodus.
✅ Summary: The Bible does not name the Pharaoh. Historically strongest candidates are Amenhotep II (early) or Ramesses II (late).

🧱 Israel in Bondage
- Israel multiplies; Pharaoh fears revolt (Exod 1:7–10)
- Taskmasters enslave them with brick and mortar (Exod 1:11–14)
- Pharaoh’s decree: kill Hebrew boys (Exod 1:15–22)
📍 Timeline: AM 2430+ — Israel enters slavery.

Footnotes:
  1. Tomb of Rekhmire (15th c. BC) depicts slaves making bricks — matches Exod 5:7–19.  
  2. Papyrus Anastasi III mentions brick quotas without straw — echoing Israel’s burden.  
  3. Pi-Ramesses (Exod 1:11) built by Ramesses II — supports 13th c. BC dating.  
  4. Ipuwer Papyrus describes Nile blood, famine, and chaos — parallels Exodus themes.  
  5. Excavations at Tell el-Dab‘a show Semitic population growth (Exod 1:7).

👶 Birth & Adoption of Moses
- Hidden 3 months, placed in Nile; sister watches (Exod 2:1–4)
- Pharaoh’s daughter finds and adopts him (Exod 2:5–10)
📍 Timeline: Pharaoh’s decree active; act of mercy interrupts his plan.

⚔️ Moses Flees to Midian
- Kills Egyptian, flees to Midian, marries Zipporah (Exod 2:11–25)
- God hears Israel’s groaning.
📍 Timeline: AM 2490+ — Moses exiled in Midian (~40 yrs).

🔥 Call at the Burning Bush
- Bush burns unconsumed at Horeb (Exod 3:1–3)
- God reveals Name: YHWH — “I AM WHO I AM” (Exod 3:14–15)
- Commission to confront Pharaoh (Exod 3–4)
📍 Timeline: AM 2510 — Moses about 80 years old.

✨ Themes
- God preserves His people under oppression.
- Deliverer raised in divine timing.
- Covenant Name revealed: YHWH.
- Adam ➝ Abraham ➝ Joseph ➝ Moses — brink of redemption.`}
      </ScrollSection>

      <ScrollSection title="📜 Exodus (Chs. 5–12)">
{`The Plagues & The Passover

⚔️ Confrontation with Pharaoh — The Hardened Heart (Exod 5–11)
Pharaoh refuses to release Israel and intensifies labor.
📍 Timeline: AM 2511 — Early confrontations, Egypt unrepentant.
Footnote 1: Egyptian kings described as divine; Pharaoh’s hardened heart reflects defiance.

🌊 The Ten Plagues (Exod 7–11)
1. Water to blood (7:14–24)
2. Frogs (8:1–15)
3. Gnats (8:16–19)
4. Flies (8:20–32)
5. Death of livestock (9:1–7)
6. Boils (9:8–12)
7. Hail (9:13–35)
8. Locusts (10:1–20)
9. Darkness (10:21–29)
10. Death of firstborn (11:1–10; 12:29–30)

Footnotes:
  2. Each plague challenges an Egyptian deity — demonstrating YHWH’s supremacy.
  3. Ipuwer Papyrus mentions Nile blood, servants fleeing, darkness — parallel accounts.
  4. Goshen (Tell el-Dab‘a) evidence shows Semitic community distinct from Egyptians.

🩸 The First Passover (Exod 12)
- Lamb without blemish, blood on doorposts (12:1–14)
- Death angel passes; Israel spared (12:29–30)
📍 Timeline: AM 2512 — Night of redemption.

🚶 Departure from Egypt (Exod 12:31–41)
- Pharaoh commands release; 600,000 men depart after 430 years.
📍 Timeline: AM 2512 — Covenant promise fulfilled.`}
      </ScrollSection>

      <ScrollSection title="📜 Exodus (Chs. 13–15)">
{`The Crossing & The Song of Deliverance

🕊️ The Pillar and the Path (Exod 13:17–22)
- God leads by cloud and fire.
- Joseph’s bones carried (13:19).
📍 Timeline: AM 2512 — Journey to Sea of Reeds.

⚔️ Pharaoh’s Pursuit (Exod 14:5–9)
- Six hundred chosen chariots pursue Israel.
📍 Timeline: AM 2513 — Night before crossing.

🌊 The Parting of the Sea (Exod 14:21–31)
- Strong east wind parts waters.
- Israel crosses; Egyptians drowned.
📍 Timeline: AM 2513 — Deliverance through water.

🕯️ The Song of Moses and Miriam (Exod 15:1–21)
- Praise for victory: “Horse and rider He has thrown into the sea.”
📍 Timeline: First act of national worship.

⛺ Wilderness Beginnings (Exod 15:22–27)
- Bitter waters made sweet; Elim oasis found.
📍 Timeline: AM 2513 — Journey of testing.`}
      </ScrollSection>

      <ScrollSection title="📜 Exodus (Chs. 16–24)">
{`The Journey to Sinai & The Covenant

🌾 Manna & Quail (Exod 16)
- God provides daily bread and meat.
📍 Timeline: AM 2514 — One month after Exodus.

💧 Water from the Rock & War with Amalek (Exod 17)
- Moses strikes rock; Amalek defeated as his hands are raised.
📍 Timeline: AM 2514 — Israel’s first battle.

👴 Jethro Visits Moses (Exod 18)
- Advises on leadership structure.
📍 Timeline: AM 2515 — Before Sinai.

🌩️ Arrival at Sinai (Exod 19–20)
- Mountain quakes; God descends in fire.
- Ten Commandments given.
📍 Timeline: AM 2515 — Covenant revelation.

📜 Covenant Code & Confirmation (Exod 21–24)
- Civil and moral laws established.
- Blood sprinkled on people: “Behold the blood of the covenant.”
📍 Timeline: AM 2515 — Covenant sealed.`}
      </ScrollSection>

      <ScrollSection title="📜 Exodus (Chs. 25–31)">
{`🏗️ The Tabernacle & Priestly Blueprint

🏛️ The Pattern from Heaven (Exodus 25–27)

God says to Moses:
“Let them make Me a sanctuary, that I may dwell among them.
According to all that I show you — the pattern of the tabernacle and the pattern of all its furnishings — so you shall make it.” (Exod 25:8–9)

📍 Timeline: AM 2515–2516 — Revelation continues atop Sinai.

📦 The Ark of the Covenant (Exod 25:10–22)
- Made of acacia wood overlaid with pure gold.
- Within it: the Testimony (Tablets of the Law).
- Covered by the Mercy Seat (Kapporet) — two cherubim facing each other with wings overshadowing the throne.
- God says: “There I will meet with you.”
    🕊️ Meaning: The Ark represents the throne of God among His people — His justice (the Law) covered by mercy (atonement).

🍞 The Table of Showbread (Exod 25:23–30)
- Holds twelve loaves, representing the twelve tribes.
- Continuous presence before YHWH.
- Gold rim signifies sanctity.
    🕯️ Meaning: God’s provision and covenant fellowship — symbol of Messiah as “the Bread of Life.”

🔥 The Golden Lampstand (Menorah) (Exod 25:31–40)
- Crafted from one piece of pure gold with seven branches.
- Almond blossoms, buds, and flowers — imagery of life and resurrection.
    🌿 Meaning: Light of divine revelation — “The spirit of man is the lamp of YHWH” (Prov 20:27).

⛺ The Tabernacle Structure (Exod 26)
- Ten curtains of fine linen, blue, purple, and scarlet — cherubim woven in.
- Boards of acacia overlaid with gold.
- Covered by layers of goat hair, ram skins dyed red, and “tachash” (sea cow or dolphin skins).
    📜 Meaning: Outer coverings conceal inner glory — just as humanity veils divine presence in Messiah.

🕊️ The Bronze Altar & Courtyard (Exod 27:1–21)
- Bronze altar for burnt offerings; courtyard pillars of bronze and silver.
- Oil for the lamp to burn continually.
    🔥 Meaning: Atonement begins at the altar — forgiveness precedes fellowship.
Footnote 1: Ancient Egyptian portable shrines found at Karnak and Luxor parallel the concept of mobile sanctuaries, but only Israel’s Tabernacle centers on a moral God who desires covenant relationship, not appeasement.

🕯️ The Priesthood Established (Exodus 28–29)
God calls Aaron and his sons to minister before Him as priests — setting apart a lineage of mediation.
👕 Holy Garments for Glory and Beauty (Exod 28:1–43)
- Ephod: Gold, blue, purple, and scarlet threads — with onyx stones engraved with names of Israel’s tribes on each shoulder.
- Breastplate of Judgment: Twelve gemstones representing each tribe; the Urim and Thummim placed within — tools for discerning divine will.
- Robe of Blue: Hem adorned with golden bells and pomegranates — the sound signified the priest’s living presence before YHWH.
- Turban and Gold Plate: Inscribed “HOLY TO YHWH” (קֹדֶשׁ לַיהוָה).
    👑 Meaning: Every garment piece reflects purity, representation, and mediation — pointing to Messiah as the ultimate High Priest.

🩸 Consecration of the Priests (Exod 29:1–46)
- Seven-day ritual of washing, anointing, sacrifice, and atonement.
- Blood placed on the right ear, right thumb, and right toe — symbolizing holiness in hearing, service, and walk.
- Continual burnt offering of two lambs daily: one in the morning, one at twilight.
    🕯️ Meaning: Unceasing devotion sustains covenant fellowship; priesthood mirrors obedience and sanctification.

Footnote 2: Archaeological parallels at Mari and Ugarit show priestly initiation rites, but Exodus uniquely blends ritual with moral purity — holiness not just by ceremony, but by obedience.

🌿 The Anointing & Incense (Exodus 30–31)
💧 The Altar of Incense (Exod 30:1–10)
- Made of acacia wood overlaid with gold, placed before the veil.
- Incense burned morning and evening.
    🕊️ Meaning: Symbol of prayer — “Let my prayer rise before You as incense.” (Ps 141:2)

🪣 The Bronze Basin (Exod 30:17–21)
- Used for priestly washing — cleansing before entering the tent or approaching the altar.
    🩸 Meaning: Purity before presence — outward washing signified inward sanctification.

🪔 The Anointing Oil (Exod 30:22–33)
- Blend of myrrh, cinnamon, calamus, and cassia in olive oil.

- Used to consecrate the Tabernacle, Ark, vessels, and priests.
    ⚜️ Meaning: Anointing = consecration. God’s Spirit empowers all service.

🌺 The Holy Incense (Exod 30:34–38)
- Stacte, onycha, galbanum, and frankincense — blended pure and holy.
- Forbidden for personal use; reserved for God alone.
    🔥 Meaning: Worship must be holy — not borrowed or imitated.

👷 The Artisans Called (Exod 31:1–11)
- Bezalel of Judah and Oholiab of Dan filled with the Spirit of Wisdom, Understanding, and Knowledge.
- Craftsmanship becomes a form of worship.
    🛠️ Meaning: Divine creativity reflects the Creator — art is sacred when inspired by Spirit.

🕊️ The Sabbath Rest (Exod 31:12–17)
- Sign between God and Israel for all generations.
- Rest is sanctified time — a covenant reminder.
    📜 Meaning: Creation, Covenant, and Worship all revolve around rest in YHWH’s presence.

📜 The Tablets of the Covenant (Exod 31:18)
- Given directly to Moses, written “by the finger of God.”
- Symbol of divine authorship — not human invention.
    ⚖️ Meaning: The Law originates from Heaven; it reveals God’s nature, not man’s system.

Footnote 3: Ancient inscriptions from Sinai (Proto-Sinaitic script) date near the Exodus era — suggesting early Hebrew writing could indeed record such revelation.

✨ Summary — The Heavenly Pattern Revealed
- Structure: Outer court → Holy Place → Most Holy Place (progression of holiness).
- Mediation: Priesthood bridges human frailty and divine holiness.
- Symbolism: Every material, measurement, and color foreshadows the Messiah.
- Purpose: God’s dwelling among men — a preview of Emmanuel (“God with us”).

📍 Timeline: AM 2515–2516 — The Sanctuary Pattern received.`}
      </ScrollSection>

      <ScrollSection title="📜 Exodus (Chs. 32–34)">
{`The Golden Calf & Covenant Renewal

🩸 The Sin of the Calf (Exod 32)
- While Moses was on Mount Sinai forty days and nights, the people grew restless.
- They demanded a visible god, saying to Aaron, “Make us gods who will go before us.”
- Aaron fashioned a golden calf from their earrings, declaring, “This is your god, O Israel, who brought you up out of Egypt!”
- The people rose early, sacrificed burnt offerings, and engaged in revelry before the idol.

📜 The Breaking of the Tablets
- YHWH revealed to Moses the people’s corruption: “They have turned aside quickly from the way I commanded.”
- Moses descended the mountain carrying the tablets of the covenant — the work of God, written by His own finger.
- Seeing the calf and the dancing, his anger burned; he cast the tablets to the ground, breaking them at the foot of the mountain — symbolizing Israel’s broken covenant.
- He ground the calf to powder, scattered it upon the water, and made Israel drink of it — a bitter reminder of their sin.

⚖️ Judgment & Mercy
- Moses stood at the gate of the camp and cried, “Who is on YHWH’s side? Let him come unto me!”
- The sons of Levi gathered to him. At Moses’ command, they executed justice on the idolaters — about three thousand men fell that day.
- Yet even in wrath, God showed mercy: He did not destroy the nation, but removed His direct presence from the camp until repentance was complete.

Footnotes:
  1. The calf resembled Egyptian bull-god Apis — worshiped for fertility and strength.
  2. Its creation echoes Cain’s rebellion: rejecting invisible obedience for visible pride.
  3. Three thousand slain under Law contrasts Acts 2 — three thousand saved under Grace.

🙏 Moses’ Intercession (Exod 33)
- Moses ascended again to plead for the people, offering himself in substitution: “Blot me out of Your book if You will not forgive them.”
- YHWH refused to destroy Israel, but declared: “Whoever has sinned against Me, I will blot out of My book.”
- The Tent of Meeting was pitched outside the camp; there, Moses spoke to God “face to face, as a man speaks with his friend.”
- Moses prayed, “If Your Presence does not go with us, do not send us up from here.”  
- God answered: “My Presence shall go with you, and I will give you rest.”
- Moses dared ask, “Show me Your glory.” God sheltered him in a cleft of the rock, covering him with His hand as His glory passed by — revealing His goodness and Name, but not His face.

Footnotes:
  1. This is one of the deepest revelations of YHWH’s character in the Torah: mercy triumphing over judgment.
  2. The phrase “face to face” foreshadows Messiah — God made visible, presence among men.
  3. The cleft of the rock = image of refuge in Christ, the Rock of Ages.

✍️ Covenant Renewed (Exod 34)
- YHWH commanded Moses to cut two new tablets like the first, promising to write upon them again.
- Moses ascended Sinai once more for forty days and forty nights, fasting — no bread, no water.
- YHWH descended in the cloud and proclaimed His Name:  
  “YHWH, YHWH, merciful and gracious, slow to anger, abounding in steadfast love and faithfulness, keeping mercy for thousands, forgiving iniquity, transgression, and sin — yet by no means clearing the guilty.”
- Moses bowed low and worshiped, asking that YHWH’s Presence go with His people and that He take them as His inheritance.
- The covenant was renewed; laws concerning worship, Sabbath, and feasts were reestablished.
- When Moses descended, his face shone with the reflected glory of YHWH. The people feared to approach him, so he veiled his face — the veil later symbolizing Israel’s spiritual blindness until the unveiling in Messiah (2 Cor. 3:13–16).

📍 Timeline: AM 2516 — Grace reestablishes covenant.

✨ Themes & Witness Points
- Idolatry destroys covenant relationship; visible worship replaces trust.
- The Law condemns, but intercession opens the path of mercy.
- The golden calf = the heart’s rebellion when faith is delayed.
- The veil over Moses = the hidden glory of the New Covenant.
- Grace renewed the covenant even after Law was broken — a foreshadow of Yeshua restoring mankind’s bond with the Father.

⚖️ Seal Summary
The Law written in stone was shattered by sin; rewritten by grace.
The mountain that burned in wrath became the mountain where mercy shone.
Moses beheld God’s glory reflected — the same glory unveiled in Yeshua, the true Mediator of a better covenant.
`}

      </ScrollSection>

      <ScrollSection title="📜 Exodus (Chs. 35–40)">
{`The Tabernacle Built & Glory Descends

🧶 The Offering of the People (Exod 35–39)
- After the covenant was renewed, Moses gathered the entire congregation and declared YHWH’s command to build a sanctuary: “That I may dwell among them.”
- Every man and woman whose heart was stirred came willingly — bringing gold, silver, bronze, blue, purple, scarlet yarn, fine linen, goat hair, ram skins dyed red, acacia wood, precious stones, and oil for the light.
- The rulers brought onyx stones and gems for the ephod and breastplate; artisans and wise-hearted women spun cloth and wove with skill.
- The people brought so much that Moses had to command them to stop — for the material they already had was *more than enough* for all the work to be done.  
📜 Lesson: True generosity flows from gratitude, not compulsion.

🏗️ Bezalel & Oholiab
- Bezalel, filled with the Spirit of God in wisdom, understanding, and knowledge, oversaw the work — a divine prototype of Spirit-filled craftsmanship.
- Oholiab assisted him in teaching and artistry.
- Together they executed the divine blueprint shown to Moses on the mountain — every socket, curtain, and clasp according to heavenly pattern.

⚙️ Completion & Consecration (Exod 40:1–17)
- On the first day of the first month, in the second year after leaving Egypt, the Tabernacle was raised.
- The Ark of the Testimony was placed within the Most Holy Place; the veil was hung; the table of showbread, the lampstand, and the altar of incense were set in order.
- Moses anointed the Tabernacle and all its furnishings with sacred oil, consecrating them for divine service.
- Aaron and his sons were washed, clothed in priestly garments, and anointed for the priesthood.
- Thus the work was finished — just as YHWH had commanded Moses, so they did.

Footnotes:
  1. “According to all that YHWH commanded Moses” is repeated *seven times* — a number of completion.
  2. The construction took about six months (Exod 25–31 → 35–40).
  3. The anointing oil (Exod 30:22–33) symbolized divine separation — no imitation permitted.

🌩️ The Glory Fills the Tabernacle (Exod 40:34–38)
- When Moses finished the work, *a cloud covered the Tent of Meeting, and the glory of YHWH filled the Tabernacle*.
- The presence was so overwhelming that Moses could not enter — the divine fire and cloud resting visibly above the Mercy Seat.
- By day, the cloud covered it; by night, fire was in it — a visible sign of God’s indwelling among His people.
- Whenever the cloud lifted, Israel set out; when it did not, they stayed — divine presence now directing their journey.

📍 Timeline: AM 2517 — Presence dwells among Israel.

📜 Symbolism & Prophetic Foreshadowing
- The Tabernacle on earth mirrors the heavenly throne — God’s dwelling among men.
- Its layout (outer court, holy place, most holy) represents the path from flesh to spirit, from world to Presence.
- The Ark signifies covenant; the Mercy Seat — atonement; the lampstand — illumination; the table — fellowship; the altar — redemption.
- The cloud of glory (Hebrew: *Kavod YHWH*) reappears later in Solomon’s Temple (1 Kings 8:10–11) and in the transfiguration of Yeshua (Matt. 17:5).

🕊️ Closing Themes
- **Deliverance** — from bondage to freedom.  
- **Revelation** — God’s word and law revealed.  
- **Covenant** — broken yet renewed through grace.  
- **Habitation** — God’s glory dwelling among His people.

🌟 Prophetic Fulfillment
- The Tabernacle anticipates Emmanuel — “God with us.”
- The indwelling cloud prefigures the Holy Spirit filling believers (Acts 2).
- The tent of meeting becomes the living temple of hearts purified by the Spirit (1 Cor. 6:19).

🪶 Seal Summary
- Exodus begins with slavery and ends with glory.
- The same God who delivered from Egypt now *dwells among His redeemed*.
- The journey from dust to divine indwelling completes the pattern of Genesis and Exodus:
  **Adam → Abraham → Moses → Tabernacle → Nation → Messiah.**

📜 Witness Reflection
The Presence that once filled a tent will one day fill all creation.
Until then, every heart purified by obedience becomes a sanctuary where His glory rests.
`}

      </ScrollSection>

      {/* Reflection Box */}
      <ReflectionBox />

      {/* Seal */}
      <div className="text-center mt-12 text-indigo-400 font-semibold tracking-widest text-sm drop-shadow-[0_0_8px_rgba(99,102,241,0.7)]">
        כ כ ז כ Frankie — End of Book II
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-center mt-10 mb-16">
        <Link
          href="/word/leviticus"
          className="bg-indigo-700/40 hover:bg-indigo-600/60 border border-indigo-500/40 px-6 py-3 rounded-lg shadow-lg text-indigo-300 hover:text-white transition"
        >
          ➡️ Continue to Leviticus
        </Link>
      </div>
    </main>
  );
}
