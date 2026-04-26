
export default async function handler(req, res) {
  if(req.method !== "GET") return res.status(405).end();
  const SUPABASE_URL = "https://bctrrdscvgobmmjqnwks.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdHJyZHNjdmdvYm1tanFud2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzE5MzUsImV4cCI6MjA5MjYwNzkzNX0.1h1uLYSs-B7XfaX7sOOB8EVsiGrLZowXaq786CeIQGc";
  const { cat_id } = req.query;
  if(!cat_id) return res.status(400).json({error:"Missing cat_id"});
  try {
    const filter = cat_id.startsWith("in.(")
      ? "cat_id="+cat_id
      : "cat_id=eq."+cat_id+"&order=created_at.asc";
    const response = await fetch(
      SUPABASE_URL+"/rest/v1/comments?"+filter,
      { headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer "+SUPABASE_KEY } }
    );
    const data = await response.json();
    res.status(200).json(Array.isArray(data) ? data : []);
  } catch(e) {
    res.status(500).json({error: e.message});
  }
}
