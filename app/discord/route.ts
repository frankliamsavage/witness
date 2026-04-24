import { redirect } from 'next/navigation';

export async function GET() {
  // Replace this with your actual Discord invite URL
  const discordInviteUrl = 'https://discord.gg/witnessproject';
  
  return redirect(discordInviteUrl);
}