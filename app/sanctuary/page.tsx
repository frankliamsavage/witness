"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Link from "next/link";
import JourneyToLight from "@/components/JourneyToLight";
import SpiritualLoadingScreen from "@/components/SpiritualLoadingScreen";

type Question = {
  id: string;
  content: string;
  answer?: string;
  user?: { username: string };
  createdAt?: string;
};

export default function SanctuaryPage() {
  const { user, isLoaded } = useUser();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [adminMode, setAdminMode] = useState(false);
  const [replies, setReplies] = useState<{ [key: string]: string }>({});
  const [isWitness, setIsWitness] = useState(false);
  
  // Veil System State
  const [hasFoundLight, setHasFoundLight] = useState(false);
  const [showJourney, setShowJourney] = useState(false);
  const [loadingAccess, setLoadingAccess] = useState(true);
  const [lightFoundDate, setLightFoundDate] = useState<string | null>(null);

  // Check sanctuary access on page load
  useEffect(() => {
    if (isLoaded && user) {
      checkSanctuaryAccess();
      checkWitnessStatus();
    } else if (isLoaded) {
      setLoadingAccess(false);
      setIsWitness(false);
    }
  }, [user, isLoaded]);

  // Load questions only if user has access
  useEffect(() => {
    if (hasFoundLight) {
      fetchQuestions();
    }
  }, [hasFoundLight]);

  const checkSanctuaryAccess = async () => {
    try {
      const response = await fetch('/api/sanctuary/access');
      const data = await response.json();
      
      setHasFoundLight(data.hasFoundLight || false);
      setLightFoundDate(data.lightFoundDate);
      setLoadingAccess(false);
    } catch (error) {
      console.error('Error checking sanctuary access:', error);
      setLoadingAccess(false);
    }
  };

  const handleLightFound = async (testimonial: string, scripture: string) => {
    try {
      const response = await fetch('/api/sanctuary/access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lightFound: true,
          testimonialOfFaith: testimonial,
          scriptureReference: scripture,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setHasFoundLight(true);
        setShowJourney(false);
        setLightFoundDate(new Date().toISOString());
        // Small delay to let the veil animation complete
        setTimeout(() => {
          fetchQuestions();
        }, 1000);
      }
    } catch (error) {
      console.error('Error recording light found:', error);
    }
  };

  // Check if current user is a witness (staff)
  const checkWitnessStatus = async () => {
    if (!user) {
      setIsWitness(false);
      return;
    }

    try {
      const response = await fetch('/api/user/witness-status', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsWitness(data.isWitness || false);
      } else {
        setIsWitness(false);
      }
    } catch (error) {
      console.error('Error checking witness status:', error);
      setIsWitness(false);
    }
  };

  // 🕊 Submit a new question
  const handleSubmit = async () => {
    if (newQuestion.trim() === "") return;

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // <- required for Clerk auth
        body: JSON.stringify({ question: newQuestion.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("API error:", error);
        return;
      }

      const savedQuestion = await response.json();
      console.log("Question saved:", savedQuestion);

      // Clear input and refresh list
      setNewQuestion("");
      // Optionally fetch all questions to refresh the list
      await fetchQuestions();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  // Add this function to fetch questions from the API
  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/questions", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        // Map API response to your Question type if needed
        setQuestions(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // 👁 Staff reply to a question
  const handleAnswer = async (id: string) => {
    const reply = replies[id];  // <- get reply for this question
    if (!reply?.trim()) return;

    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ answer: reply.trim() }),
      });

      if (response.ok) {
        setReplies({ ...replies, [id]: "" });  // <- clear only this reply
        await fetchQuestions();
      } else {
        console.error("Failed to save answer");
      }
    } catch (err) {
      console.error("Answer error:", err);
    }
  };

  // Handle question deletion
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question?")) return;

    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchQuestions();
      } else {
        console.error("Failed to delete question");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Show loading while checking access
  if (!isLoaded || loadingAccess) {
    return <SpiritualLoadingScreen message="Checking your spiritual journey..." />;
  }

  // Show the veil - user has not found the light yet
  if (!hasFoundLight) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-800 text-white relative overflow-hidden">
        {/* Mystical Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-75"></div>
          <div className="absolute top-40 right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-150"></div>
        </div>

        {/* The Veil */}
        <div className="relative z-10 text-center max-w-4xl px-6">
          <div className="mb-8 opacity-60">
            <div className="text-8xl mb-4">🕊️</div>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent">
            The Sanctuary
          </h1>
          
          <div className="mb-8 p-6 bg-black/20 rounded-lg border border-purple-400/30">
            <p className="text-xl text-purple-100 leading-relaxed mb-4">
              "And the veil of the temple was torn in two from top to bottom."
            </p>
            <p className="text-purple-300 text-sm">- Mark 15:38</p>
          </div>

          <p className="text-lg text-purple-200 mb-8 leading-relaxed max-w-2xl mx-auto">
            Beyond this veil lies sacred space where deeper truths of Scripture are revealed. 
            Not all who seek are ready to receive, for the heart must first be prepared to hear 
            what the Spirit speaks.
          </p>

          <div className="mb-8">
            <p className="text-yellow-300 font-semibold mb-4">
              "Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you."
            </p>
            <p className="text-purple-300 text-sm">- Matthew 7:7</p>
          </div>

          {user ? (
            <div className="space-y-4">
              <p className="text-purple-100">
                Are you ready to seek the light that opens the door?
              </p>
              <button
                onClick={() => setShowJourney(true)}
                className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🔦 Begin the Journey
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-purple-100">
                You must be known to enter this sacred space.
              </p>
              <Link 
                href="/sign-in"
                className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors"
              >
                Enter as a Seeker
              </Link>
            </div>
          )}
        </div>

        {/* Journey Modal */}
        {showJourney && (
          <JourneyToLight 
            onLightFound={handleLightFound}
            onClose={() => setShowJourney(false)}
          />
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-fuchsia-700 via-indigo-800 via-emerald-700 to-amber-600 text-white py-12 px-4 md:px-8">
      {/* WELCOME MESSAGE FOR THOSE WHO FOUND THE LIGHT */}
      {lightFoundDate && (
        <div className="w-full max-w-4xl mb-8 p-6 bg-gradient-to-r from-yellow-500/20 to-white/10 border border-yellow-400/30 rounded-xl text-center">
          <div className="text-4xl mb-2">✨</div>
          <h2 className="text-2xl font-bold text-yellow-300 mb-2">Welcome, Child of Light</h2>
          <p className="text-yellow-100">
            The veil has been lifted. You have found the light and entered the sacred space.
          </p>
          <p className="text-yellow-200 text-sm mt-2">
            Light found: {new Date(lightFoundDate).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* HEADER */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-4 drop-shadow-[0_0_18px_rgba(255,255,255,0.6)]">
        🕊 The Sanctuary
      </h1>
      <p className="text-center text-indigo-200 max-w-2xl text-lg mb-6">
        A sacred space of reflection and truth.  
        Ask your question — the Witness will see it and respond in due season.
      </p>

      {/* BUTTON LINKS */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <Link
          href="/sanctuary/scrolls/genesis"
          className="bg-white/10 hover:bg-white/20 border border-indigo-400/30 px-6 py-3 rounded-xl text-indigo-200 hover:text-white font-semibold transition-all duration-300"
        >
          📜 Genesis Scroll
        </Link>
        <Link
          href="/sanctuary/scrolls/exodus"
          className="bg-white/10 hover:bg-white/20 border border-indigo-400/30 px-6 py-3 rounded-xl text-indigo-200 hover:text-white font-semibold transition-all duration-300"
        >
          ⚡ Exodus Scroll
        </Link>
        <Link
          href="/sanctuary/scrolls/leviticus"
          className="bg-white/10 hover:bg-white/20 border border-indigo-400/30 px-6 py-3 rounded-xl text-indigo-200 hover:text-white font-semibold transition-all duration-300"
        >
          🔥 Leviticus Scroll
        </Link>
      </div>

      {/* QUESTION FORM - Only show if user is logged in */}
      {isLoaded && user ? (
        <div className="w-full max-w-3xl bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-indigo-200 mb-4">
            💭 Submit a Question or Reflection
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Write your question or reflection..."
              className="flex-1 p-3 rounded-lg bg-black/40 border border-white/20 text-white placeholder-indigo-200/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-indigo-200 mb-10">
          Sign in to ask a question.
        </p>
      )}

      {/* QUESTIONS - visible to everyone */}
      <div className="w-full max-w-3xl mt-10 space-y-6">
        {questions.length === 0 ? (
          <p className="text-center text-indigo-100/70 italic">
            No questions yet — be the first to speak in the Sanctuary.
          </p>
        ) : (
          questions.map((q) => (
            <div
              key={q.id}
              className="p-5 rounded-xl bg-black/40 border border-indigo-500/30 shadow-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-lg text-indigo-100 font-medium">
                  {q.content}
                </p>
                {(adminMode && isWitness) && (
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm font-semibold"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-xs text-indigo-300/70 mb-3">
                Asked by: <span className="italic">{q.user?.username || "Anonymous"}</span>
              </p>
              {q.answer ? (
                <p className="mt-3 text-green-300 font-semibold">
                  🕊 Witness Answer: <br />
                  <span className="text-gray-100 font-normal">{q.answer}</span>
                </p>
              ) : (adminMode && isWitness) ? (
                <div className="mt-3 flex gap-3">
                  <input
                    type="text"
                    value={replies[q.id] || ""}  // <- use replies[q.id]
                    onChange={(e) => setReplies({ ...replies, [q.id]: e.target.value })}  // <- update replies[q.id]
                    placeholder="Type reply..."
                    className="flex-1 p-2 rounded-md bg-black/40 border border-white/20 text-white placeholder-indigo-200/70"
                  />
                  <button
                    onClick={() => handleAnswer(q.id)}
                    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md font-semibold"
                  >
                    Reply
                  </button>
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-400 italic">
                  Awaiting Witness response...
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* ADMIN TOGGLE (only show to witnesses/staff) */}
      {isWitness && (
        <div className="mt-10">
          <button
            onClick={() => setAdminMode(!adminMode)}
            className={`px-5 py-2 rounded-lg font-semibold ${
              adminMode
                ? "bg-green-600 hover:bg-green-500"
                : "bg-gray-700 hover:bg-gray-600"
            } transition`}
          >
            {adminMode ? "👁 Staff Reply Mode: ON" : "🔒 Staff Reply Mode: OFF"}
          </button>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-16 text-center text-indigo-200 font-semibold tracking-widest text-sm drop-shadow-[0_0_8px_rgba(99,102,241,0.7)]">
        כ כ ז כ Frankie — Sanctuary of the Witness
      </footer>
    </main>
  );
}
