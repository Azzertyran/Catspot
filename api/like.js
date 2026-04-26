export default async function handler(req, res) {
  const SUPABASE_URL = "https://bctrrdscvgobmmjqnwks.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdHJyZHNjdmdvYm1tanFud2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzE5MzUsImV4cCI6MjA5MjYwNzkzNX0.1h1uLYSs-B7XfaX7sOOB8EVsiGrLZowXaq786CeIQGc";
  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Prefer': 'return=minimal'
  };

  try {
    const { cat_id, user_id, was_liked, likes_count } = req.body || {};
    if(!cat_id) return res.status(400).json({error:"Missing cat_id"});

    if(req.method === 'DELETE' || was_liked){
      // Unlike
      if(user_id){
        await fetch(`${SUPABASE_URL}/rest/v1/likes?user_id=eq.${user_id}&cat_id=eq.${cat_id}`, {method:'DELETE', headers});
      }
      const newCount = Math.max(0, (likes_count||0) - 1);
      await fetch(`${SUPABASE_URL}/rest/v1/cats?id=eq.${cat_id}`, {
        method:'PATCH', headers,
        body: JSON.stringify({likes_count: newCount})
      });
    } else {
      // Like
      if(user_id){
        await fetch(`${SUPABASE_URL}/rest/v1/likes`, {
          method:'POST', headers,
          body: JSON.stringify({user_id, cat_id})
        });
      }
      const newCount = (likes_count||0) + 1;
      await fetch(`${SUPABASE_URL}/rest/v1/cats?id=eq.${cat_id}`, {
        method:'PATCH', headers,
        body: JSON.stringify({likes_count: newCount})
      });
    }
    res.status(200).json({success: true});
  } catch(e) {
    res.status(500).json({error: e.message});
  }
}
