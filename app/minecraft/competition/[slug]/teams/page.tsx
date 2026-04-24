'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface PublicTeam {
  teamId: string;
  teamName: string;
  memberList: string[];
  status: 'applied' | 'approved' | 'building' | 'submitted' | 'disqualified' | 'winner';
  appliedAt: Date;
  cashEligible: boolean;
}

export default function CompetitionTeamsPage() {
  const params = useParams();
  const [teams, setTeams] = useState<PublicTeam[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for development
  useEffect(() => {
    const mockTeams: PublicTeam[] = [
      {
        teamId: '1',
        teamName: 'Diamond Builders',
        memberList: ['steve#1234', 'alex#5678'],
        status: 'building',
        appliedAt: new Date('2024-12-01'),
        cashEligible: true
      },
      {
        teamId: '2', 
        teamName: 'Redstone Engineers',
        memberList: ['redstone_master#9999', 'circuit_king#7777'],
        status: 'approved',
        appliedAt: new Date('2024-12-03'),
        cashEligible: false
      }
    ];
    
    setTimeout(() => {
      setTeams(mockTeams);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'building': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'submitted': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'disqualified': return 'bg-red-100 text-red-800 border-red-200';
      case 'winner': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'applied': return 'Application Pending';
      case 'approved': return 'Approved';
      case 'building': return 'Building';
      case 'submitted': return 'Submitted';
      case 'disqualified': return 'Disqualified';
      case 'winner': return 'Winner';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading teams...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href={`/minecraft/competition/${params.slug}`}
              className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
            >
              ← Back to Competition
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Competition Teams</h1>
          <p className="text-gray-600">Public transparency view of all registered teams</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{teams.length}</div>
            <div className="text-sm text-gray-600">Total Teams</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border">
            <div className="text-2xl font-bold text-green-600">{teams.filter(t => t.cashEligible).length}</div>
            <div className="text-sm text-gray-600">💰 Cash Eligible</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border">
            <div className="text-2xl font-bold text-red-600">{teams.filter(t => !t.cashEligible).length}</div>
            <div className="text-sm text-gray-600">🏅 Recognition Only</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border">
            <div className="text-2xl font-bold text-purple-600">{teams.filter(t => t.status === 'building').length}</div>
            <div className="text-sm text-gray-600">Currently Building</div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div key={team.teamId} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              
              {/* Team Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{team.teamName}</h3>
                <div className="flex items-center gap-2">
                  {team.cashEligible ? (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                      💰 Cash Eligible
                    </span>
                  ) : (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">
                      🏅 Recognition Only
                    </span>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(team.status)}`}>
                  {getStatusLabel(team.status)}
                </span>
              </div>

              {/* Members */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Members ({team.memberList.length})</h4>
                <div className="space-y-1">
                  {team.memberList.map((member, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded">
                      {member}
                    </div>
                  ))}
                </div>
              </div>

              {/* Applied Date */}
              <div className="text-xs text-gray-500">
                Applied: {team.appliedAt.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {teams.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Teams Yet</h3>
            <p className="text-gray-600 mb-6">Be the first to register for this competition!</p>
            <Link 
              href={`/apply/team?competition=${params.slug}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium inline-block"
            >
              Register Team
            </Link>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-sm text-blue-800">
              <strong>Transparency Notice:</strong> This page shows all registered teams for public transparency. 
              Team details, ages, and internal verification status are private and visible only to administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}