'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Team {
  teamId: string;
  competitionId: string;
  teamName: string;
  captainUserId: string;
  memberList: string[];
  status: 'applied' | 'approved' | 'building' | 'submitted' | 'disqualified' | 'winner';
  worldId?: string;
  worldName?: string;
  submittedAt?: Date;
  notes?: string;
  appliedAt: Date;
  // Cash prize eligibility tracking
  cashEligible?: boolean;
  cashEligibilityChecked?: boolean;
  cashEligibilityCheckedAt?: Date;
  paymentMethod?: 'CAPTAIN_PAYOUT' | 'INDIVIDUAL_1099S' | 'NOT_ELIGIBLE';
  ineligibilityReason?: string;
}

export default function CompetitionAdminPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Mock data for development - replace with real API calls
  useEffect(() => {
    const mockTeams: Team[] = [
      {
        teamId: '1',
        competitionId: 'hub-build-2026',
        teamName: 'Test Team',
        captainUserId: 'frank#1234',
        memberList: ['frank#1234', 'builder#5678'],
        status: 'applied',
        appliedAt: new Date(),
        notes: 'First test application'
      }
    ];
    setTeams(mockTeams);
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

  // Check if team is eligible for cash prizes (all members 18+)
  const checkTeamCashEligibility = (team: Team) => {
    // In real implementation, check all member ages from database
    // For demo, randomly assign some teams as having minor members
    const hasMinors = Math.random() > 0.7; // 30% chance of having minors
    return !hasMinors;
  };

  const updateTeamStatus = (teamId: string, newStatus: Team['status']) => {
    setTeams(prev => prev.map(team => 
      team.teamId === teamId 
        ? { ...team, status: newStatus, submittedAt: newStatus === 'submitted' ? new Date() : team.submittedAt }
        : team
    ));
  };

  const assignWorld = (teamId: string, worldId: string, worldName: string) => {
    setTeams(prev => prev.map(team => 
      team.teamId === teamId 
        ? { ...team, worldId, worldName, status: team.status === 'approved' ? 'building' : team.status }
        : team
    ));
  };

  const updateTeamNotes = (teamId: string, notes: string) => {
    setTeams(prev => prev.map(team => 
      team.teamId === teamId ? { ...team, notes } : team
    ));
  };

  const updateMemberList = (teamId: string, memberList: string[]) => {
    setTeams(prev => prev.map(team => 
      team.teamId === teamId ? { ...team, memberList } : team
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Competition Admin Panel</h1>
              <p className="text-gray-600 mt-2">Manage teams, assign worlds, and track progress</p>
            </div>
            <Link 
              href="/minecraft/competition/hub-build"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              View Public Page
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {(['applied', 'approved', 'building', 'submitted', 'disqualified', 'winner'] as const).map(status => (
            <div key={status} className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-gray-900">
                {teams.filter(t => t.status === status).length}
              </div>
              <div className="text-sm text-gray-600 capitalize">{status}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Teams List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Teams ({teams.length})</h2>
            </div>
            
            <div className="divide-y max-h-96 overflow-y-auto">
              {teams.map((team) => (
                <div 
                  key={team.teamId}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedTeam?.teamId === team.teamId ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedTeam(team)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{team.teamName}</h3>
                    <div className="flex items-center gap-2">
                      {checkTeamCashEligibility(team) ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                          💰 Cash Eligible
                        </span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">
                          🚫 Recognition Only
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(team.status)}`}>
                        {team.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Captain: {team.captainUserId}</div>
                    <div>Members: {team.memberList.length}</div>
                    {team.worldName && <div>World: {team.worldName}</div>}
                  </div>
                </div>
              ))}
              
              {teams.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-2">🏗️</div>
                  <div>No teams registered yet</div>
                </div>
              )}
            </div>
          </div>

          {/* Team Details & Actions */}
          <div className="bg-white rounded-lg shadow">
            {selectedTeam ? (
              <>
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">{selectedTeam.teamName}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedTeam.status)}`}>
                      {selectedTeam.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  
                  {/* Team Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Team Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Team ID:</strong> {selectedTeam.teamId}</div>
                      <div><strong>Captain:</strong> {selectedTeam.captainUserId}</div>
                      <div><strong>Applied:</strong> {selectedTeam.appliedAt.toLocaleDateString()}</div>
                      {selectedTeam.submittedAt && (
                        <div><strong>Submitted:</strong> {selectedTeam.submittedAt.toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>

                  {/* Member Management */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Members</h3>
                    <div className="space-y-2">
                      {selectedTeam.memberList.map((member, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                          <span className="text-sm">{member}</span>
                          <div className="flex items-center gap-2">
                            {member === selectedTeam.captainUserId && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Captain</span>
                            )}
                            {/* Age verification status - mock data for now */}
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">18+ ✓</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cash Prize Eligibility */}
                  {(() => {
                    const isEligible = checkTeamCashEligibility(selectedTeam);
                    return (
                      <div className={`border-l-4 p-4 rounded ${
                        isEligible 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-red-500 bg-red-50'
                      }`}>
                        <h3 className={`font-semibold mb-2 ${
                          isEligible ? 'text-green-900' : 'text-red-900'
                        }`}>
                          💰 Cash Prize Eligibility
                        </h3>
                        <div className={`text-sm ${
                          isEligible ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {isEligible ? (
                            <>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                <strong>ELIGIBLE:</strong> All team members are 18+ adults
                              </div>
                              <div className="mb-3">
                                <strong>Payment Method:</strong> Individual 1099s for each member
                              </div>
                              <div className="text-xs text-green-700 bg-green-100 p-2 rounded">
                                <strong>Prize Distribution:</strong> If this team wins, each member will receive individual 1099 tax forms. 
                                Captain will coordinate payment details with administration.
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                <strong>NOT ELIGIBLE:</strong> Team includes members under 18
                              </div>
                              <div className="mb-3">
                                <strong>Prize Status:</strong> Recognition only (no cash compensation)
                              </div>
                              <div className="text-xs text-red-700 bg-red-100 p-2 rounded">
                                <strong>Important:</strong> Teams with minor members can compete for recognition, rankings, and non-monetary prizes only. 
                                Cash prizes are restricted to adult-only teams per legal compliance requirements.
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* World Assignment */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">World Assignment</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="World ID"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                        defaultValue={selectedTeam.worldId || ''}
                      />
                      <input
                        type="text"
                        placeholder="World Name"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                        defaultValue={selectedTeam.worldName || ''}
                      />
                      <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
                        onClick={() => {
                          const worldId = (document.querySelector('input[placeholder="World ID"]') as HTMLInputElement)?.value || '';
                          const worldName = (document.querySelector('input[placeholder="World Name"]') as HTMLInputElement)?.value || '';
                          assignWorld(selectedTeam.teamId, worldId, worldName);
                        }}
                      >
                        Assign
                      </button>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Status Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => updateTeamStatus(selectedTeam.teamId, 'approved')}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium"
                        disabled={selectedTeam.status !== 'applied'}
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => updateTeamStatus(selectedTeam.teamId, 'disqualified')}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium"
                      >
                        Disqualify
                      </button>
                      <button 
                        onClick={() => updateTeamStatus(selectedTeam.teamId, 'building')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium"
                        disabled={selectedTeam.status !== 'approved'}
                      >
                        Start Building
                      </button>
                      <button 
                        onClick={() => updateTeamStatus(selectedTeam.teamId, 'winner')}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded text-sm font-medium"
                        disabled={selectedTeam.status !== 'submitted'}
                      >
                        Mark Winner
                      </button>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Admin Notes</h3>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      rows={3}
                      placeholder="Internal notes about this team..."
                      defaultValue={selectedTeam.notes || ''}
                      onBlur={(e) => updateTeamNotes(selectedTeam.teamId, e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">👥</div>
                <div>Select a team to manage</div>
              </div>
            )}
          </div>
        </div>

        {/* Announcement Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Post Announcement</h2>
          <div className="space-y-4">
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded"
              rows={3}
              placeholder="Competition update or announcement..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
            />
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded font-medium">
              Post to Discord & Website
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}