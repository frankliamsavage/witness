import { NextRequest, NextResponse } from 'next/server';

// This would integrate with your database
// For now, using mock data structure

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
}

// GET - Fetch all teams for a competition
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const competitionId = searchParams.get('competitionId') || 'hub-build-2026';
  
  try {
    // TODO: Replace with actual database query
    // const teams = await prisma.competitionTeam.findMany({
    //   where: { competitionId }
    // });
    
    const mockTeams: Team[] = [
      {
        teamId: '1',
        competitionId: 'hub-build-2026',
        teamName: 'Example Team',
        captainUserId: 'frank#1234',
        memberList: ['frank#1234', 'helper#5678'],
        status: 'applied',
        appliedAt: new Date(),
        notes: 'Sample team for testing'
      }
    ];
    
    return NextResponse.json({ teams: mockTeams });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

// POST - Create new team application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamName, captainUserId, memberList, competitionId } = body;
    
    // TODO: Replace with actual database insertion
    // const team = await prisma.competitionTeam.create({
    //   data: {
    //     teamName,
    //     captainUserId,
    //     memberList,
    //     competitionId,
    //     status: 'applied',
    //     appliedAt: new Date()
    //   }
    // });
    
    const newTeam: Team = {
      teamId: Date.now().toString(),
      competitionId,
      teamName,
      captainUserId,
      memberList: Array.isArray(memberList) ? memberList : [memberList],
      status: 'applied',
      appliedAt: new Date()
    };
    
    return NextResponse.json({ team: newTeam }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}

// PATCH - Update team (status, world assignment, notes, etc.)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamId, updates } = body;
    
    // TODO: Replace with actual database update
    // const team = await prisma.competitionTeam.update({
    //   where: { teamId },
    //   data: {
    //     ...updates,
    //     submittedAt: updates.status === 'submitted' ? new Date() : undefined
    //   }
    // });
    
    return NextResponse.json({ 
      success: true, 
      message: `Team ${teamId} updated successfully` 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 });
  }
}