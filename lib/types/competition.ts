// Database Schema for Competition Teams
// Add this to your Prisma schema when ready to implement

/*
model CompetitionTeam {
  teamId        String   @id @default(cuid())
  competitionId String
  teamName      String
  captainUserId String   // Discord ID or site account
  memberList    String[] // Array of member Discord IDs/usernames
  status        TeamStatus @default(APPLIED)
  worldId       String?  // Minecraft world identifier
  worldName     String?  // Human readable world name
  submittedAt   DateTime?
  notes         String?  // Admin-only notes
  appliedAt     DateTime @default(now())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("competition_teams")
}

enum TeamStatus {
  APPLIED
  APPROVED  
  BUILDING
  SUBMITTED
  DISQUALIFIED
  WINNER
}
*/

// TypeScript interfaces for frontend use
export interface CompetitionTeam {
  teamId: string;
  competitionId: string;
  teamName: string;
  captainUserId: string;
  memberList: string[];
  status: TeamStatus;
  worldId?: string;
  worldName?: string;
  submittedAt?: Date;
  notes?: string;
  appliedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  // Cash prize eligibility
  cashEligible: boolean; // true if all members are 18+
  cashEligibilityChecked: boolean; // true if eligibility has been verified
  cashEligibilityCheckedAt?: Date; // when eligibility was last checked
  paymentMethod: 'CAPTAIN_PAYOUT' | 'INDIVIDUAL_1099S' | 'NOT_ELIGIBLE'; // how to distribute prizes
  paymentDetails?: PaymentDetails; // recipient and tax info
  ineligibilityReason?: string; // why team is not cash eligible
  memberAges: MemberAgeStatus[];
}

export interface MemberAgeStatus {
  memberId: string;
  memberName: string;
  isAdult: boolean; // 18+
  verified: boolean; // age verification completed
}

export interface PaymentDetails {
  teamId: string;
  totalPrize: number;
  paymentMethod: 'CAPTAIN_PAYOUT' | 'INDIVIDUAL_1099S';
  recipients: PaymentRecipient[];
}

export interface PaymentRecipient {
  memberId: string;
  memberName: string;
  amount: number;
  taxId?: string; // SSN or EIN for 1099
  address?: string; // For tax forms
}

export enum TeamStatus {
  APPLIED = 'applied',
  APPROVED = 'approved', 
  BUILDING = 'building',
  SUBMITTED = 'submitted',
  DISQUALIFIED = 'disqualified',
  WINNER = 'winner'
}

// Team action types for admin operations
export interface TeamUpdate {
  status?: TeamStatus;
  worldId?: string;
  worldName?: string;
  memberList?: string[];
  notes?: string;
}

// API response types
export interface TeamsResponse {
  teams: CompetitionTeam[];
}

export interface TeamResponse {
  team: CompetitionTeam;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

// Form validation schemas
export const teamApplicationSchema = {
  teamName: {
    required: true,
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s]+$/ // Alphanumeric and spaces only
  },
  captainUserId: {
    required: true,
    minLength: 3,
    maxLength: 50
  },
  memberList: {
    required: true,
    minItems: 1,
    maxItems: 4, // Adjust based on your team size limits
    itemPattern: /^[a-zA-Z0-9#_]+$/ // Discord username pattern
  }
};

// Competition workflow constants
export const COMPETITION_PHASES = {
  REGISTRATION: 'registration',
  BUILDING: 'building', 
  SUBMISSION: 'submission',
  JUDGING: 'judging',
  VOTING: 'voting',
  COMPLETED: 'completed'
} as const;

export const STATUS_TRANSITIONS = {
  [TeamStatus.APPLIED]: [TeamStatus.APPROVED, TeamStatus.DISQUALIFIED],
  [TeamStatus.APPROVED]: [TeamStatus.BUILDING, TeamStatus.DISQUALIFIED],
  [TeamStatus.BUILDING]: [TeamStatus.SUBMITTED, TeamStatus.DISQUALIFIED],
  [TeamStatus.SUBMITTED]: [TeamStatus.WINNER, TeamStatus.DISQUALIFIED],
  [TeamStatus.DISQUALIFIED]: [], // No transitions from disqualified
  [TeamStatus.WINNER]: [] // No transitions from winner
} as const;