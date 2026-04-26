export default async function handler(req, res) {
  if(req.method !== 'DELETE') return res.status(405).end();

  const SUPABASE_URL = "https://bctrrdscvgobmmjqnwks.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdHJyZHNjdmdvYm1tanFud2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzE5MzUsImV4cCI6MjA5MjYwNzkzNX0.1h1uLYSs-B7XfaX7sOOB8EVsiGrLZowXaq786CeIQGc";

  const { id } = req.query;
  if(!id) return res.status(400).json({error: "Missing id"});

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/lost_cats?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      }
    });
    if(!response.ok){
      const err = await response.text();
      return res.status(response.status).json({error: err});
    }
    res.status(200).json({success: true});
  } catch(e) {
    res.status(500).json({error: e.message});
  }
}
