export default async function handler(req, res) {
  const SUPABASE_URL = "https://bctrrdscvgobmmjqnwks.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdHJyZHNjdmdvYm1tanFud2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzE5MzUsImV4cCI6MjA5MjYwNzkzNX0.1h1uLYSs-B7XfaX7sOOB8EVsiGrLZowXaq786CeIQGc";
  const headers = {
    "Content-Type": "application/json",
    "apikey": SUPABASE_KEY,
    "Authorization": "Bearer " + SUPABASE_KEY,
    "Prefer": "return=minimal"
  };

  try {
    const { cat_id, user_id, was_liked } = req.body || {};
    if(!cat_id) return res.status(400).json({error:"Missing cat_id"});

    if(req.method === "DELETE" || was_liked){
      // Unlike — supprimer de la table likes
      if(user_id){
        await fetch(SUPABASE_URL+"/rest/v1/likes?user_id=eq."+user_id+"&cat_id=eq."+cat_id, {method:"DELETE", headers});
      }
      // Recalculer le count depuis la table likes
      const countRes = await fetch(SUPABASE_URL+"/rest/v1/likes?cat_id=eq."+cat_id+"&select=cat_id", {
        headers: {"apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY, "Prefer": "count=exact"}
      });
      const count = parseInt(countRes.headers.get("content-range")?.split("/")[1] || "0");
      await fetch(SUPABASE_URL+"/rest/v1/cats?id=eq."+cat_id, {
        method:"PATCH", headers,
        body: JSON.stringify({likes_count: Math.max(0, count)})
      });
    } else {
      // Like — insérer dans la table likes (ignore si déjà existant)
      if(user_id){
        await fetch(SUPABASE_URL+"/rest/v1/likes", {
          method:"POST",
          headers: {...headers, "Prefer": "resolution=ignore-duplicates,return=minimal"},
          body: JSON.stringify({user_id, cat_id})
        });
      }
      // Recalculer le count depuis la table likes
      const countRes = await fetch(SUPABASE_URL+"/rest/v1/likes?cat_id=eq."+cat_id+"&select=cat_id", {
        headers: {"apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY, "Prefer": "count=exact"}
      });
      const count = parseInt(countRes.headers.get("content-range")?.split("/")[1] || "0");
      await fetch(SUPABASE_URL+"/rest/v1/cats?id=eq."+cat_id, {
        method:"PATCH", headers,
        body: JSON.stringify({likes_count: count})
      });
    }
    res.status(200).json({success: true});
  } catch(e) {
    res.status(500).json({error: e.message});
  }
}
