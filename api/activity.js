export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).end();
  const SUPABASE_URL = "https://bctrrdscvgobmmjqnwks.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdHJyZHNjdmdvYm1tanFud2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzE5MzUsImV4cCI6MjA5MjYwNzkzNX0.1h1uLYSs-B7XfaX7sOOB8EVsiGrLZowXaq786CeIQGc";
  try {
    const { user_id, action, day } = req.body;
    if(!user_id || !action || !day) return res.status(400).json({error:"Missing fields"});
    // Upsert — une seule entrée par user/action/day
    const response = await fetch(`${SUPABASE_URL}/rest/v1/user_activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'resolution=ignore-duplicates,return=minimal'
      },
      body: JSON.stringify({ user_id, action, day })
    });
    res.status(200).json({success: true});
  } catch(e) {
    res.status(500).json({error: e.message});
  }
}
