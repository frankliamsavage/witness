'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'Can minors enter competitions?',
    answer: 'Yes! Players aged 13 and older can participate in all gameplay aspects of competitions. However, only adult team members (18+) are eligible for cash prizes. Mixed-age teams receive recognition and cosmetic rewards instead.',
    category: 'Eligibility'
  },
  {
    id: '2', 
    question: 'Can mixed-age teams win?',
    answer: 'Absolutely! Mixed-age teams can win competitions and receive full recognition, rankings, and non-monetary prizes. Only cash prizes are restricted to adult-only teams for legal compliance.',
    category: 'Eligibility'
  },
  {
    id: '3',
    question: 'How are cash prizes paid?',
    answer: 'Cash prizes are paid via individual 1099 tax forms to each eligible team member, or as a single payment to the team captain who coordinates internal distribution. Payment method is selected during team registration.',
    category: 'Prizes'
  },
  {
    id: '4',
    question: 'What happens if my team wins?',
    answer: 'Winning teams receive their selected prize (cash for eligible adults, cosmetics for others), permanent recognition in the archive, special titles, and their build may become part of the official server experience.',
    category: 'Prizes'
  },
  {
    id: '5',
    question: 'Can we reuse our build elsewhere?',
    answer: 'Yes! You retain ownership of your creative work. Witness Project receives a license to use submissions within our server, but you can use your build anywhere else.',
    category: 'Legal'
  },
  {
    id: '6',
    question: 'How many people can be on a team?',
    answer: 'Teams can have 1-4 members. Solo builders are welcome, and team collaboration is encouraged. All members must be listed during registration.',
    category: 'Teams'
  },
  {
    id: '7',
    question: 'Can I join multiple teams?',
    answer: 'No, each participant can only be on one team per competition to ensure fair resource allocation and prevent conflicts of interest.',
    category: 'Teams'
  },
  {
    id: '8',
    question: 'What if someone on my team drops out?',
    answer: 'Contact an admin immediately. Depending on the competition phase, you may continue with remaining members, add a replacement, or receive guidance on next steps.',
    category: 'Teams'
  },
  {
    id: '9',
    question: 'How long do competitions last?',
    answer: 'Competition length varies by challenge. The Hub Build Competition runs for approximately 3-4 months from approval to submission deadline. Check specific competition pages for exact dates.',
    category: 'Timeline'
  },
  {
    id: '10',
    question: 'Can we visit other teams\' builds?',
    answer: 'During the building phase, each team gets a private world. Builds are revealed publicly only during judging to ensure fair evaluation without external influence.',
    category: 'Building'
  },
  {
    id: '11',
    question: 'What tools and resources are provided?',
    answer: 'Teams receive a private Minecraft world, creative mode access, and basic building tools. WorldEdit and other plugins may be available depending on the competition - check specific rules.',
    category: 'Building'
  },
  {
    id: '12',
    question: 'Are there any building restrictions?',
    answer: 'Builds must be family-friendly, original work optimized for server performance. No copyrighted content, offensive material, or excessive lag-causing elements. See full rules for details.',
    category: 'Building'
  },
  {
    id: '13',
    question: 'Who judges the competitions?',
    answer: 'Competitions are judged by Witness Server staff and designated community judges using published criteria like creativity, technical skill, functionality, and theme adherence.',
    category: 'Judging'
  },
  {
    id: '14',
    question: 'How are winners selected?',
    answer: 'Winners are selected based on published judging criteria, scored independently by multiple judges. The process is transparent with results explained after announcement.',
    category: 'Judging'
  },
  {
    id: '15',
    question: 'Can I appeal a judging decision?',
    answer: 'Yes, formal appeals can be submitted within 7 days of results. Appeals are reviewed by uninvolved staff members and must cite specific concerns about process or criteria application.',
    category: 'Disputes'
  }
];

const categories = ['All', 'Eligibility', 'Prizes', 'Teams', 'Building', 'Judging', 'Timeline', 'Legal', 'Disputes'];

export default function CompetitionFAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const filteredFAQs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      
      {/* Header */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Competition FAQ
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            Answers to common questions about Witness Minecraft competitions.
          </p>
          
          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link 
              href="/minecraft/competitions"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              View Rules
            </Link>
            <Link 
              href="/minecraft/competition"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium"
            >
              Active Competitions
            </Link>
            <Link 
              href="/apply/team"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Register Team
            </Link>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-lg border shadow-sm">
                <button
                  onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                      {faq.category}
                    </span>
                    <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                  </div>
                  <div className={`transform transition-transform ${
                    openFAQ === faq.id ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </div>
                </button>
                
                {openFAQ === faq.id && (
                  <div className="px-6 pb-4 border-t border-gray-100">
                    <p className="text-gray-700 pt-4 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-blue-100 mb-6">
              Can't find what you're looking for? Our community team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/discord"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Ask on Discord
              </Link>
              <Link 
                href="/support"
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}