export default async function handler(req, res) {
  const SUPABASE_URL = "https://bctrrdscvgobmmjqnwks.supabase.co";
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
  if(!SUPABASE_KEY) return res.status(500).json({error:"Missing SUPABASE_SERVICE_KEY"});
  const h = { "Content-Type":"application/json", "apikey":SUPABASE_KEY, "Authorization":"Bearer "+SUPABASE_KEY, "Prefer":"return=minimal" };

  try {
    const { cat_id, user_id, was_liked } = req.body || {};
    if(!cat_id) return res.status(400).json({error:"Missing cat_id"});

    if(was_liked){
      // Unlike — supprimer le like + décrémenter atomiquement
      if(user_id) await fetch(SUPABASE_URL+"/rest/v1/likes?user_id=eq."+user_id+"&cat_id=eq."+cat_id, {method:"DELETE", headers:h});
      await fetch(SUPABASE_URL+"/rest/v1/rpc/decrement_likes", {method:"POST", headers:h, body:JSON.stringify({cat_id})});
    } else {
      // Like — insérer + incrémenter atomiquement
      if(user_id){
        const r = await fetch(SUPABASE_URL+"/rest/v1/likes", {
          method:"POST", headers:{...h, "Prefer":"resolution=ignore-duplicates,return=minimal"},
          body:JSON.stringify({user_id, cat_id})
        });
        // Si 409 conflict (déjà liké) — ne pas incrémenter
        if(r.status === 409) return res.status(200).json({success:true, skipped:true});
      }
      await fetch(SUPABASE_URL+"/rest/v1/rpc/increment_likes", {method:"POST", headers:h, body:JSON.stringify({cat_id})});
    }
    res.status(200).json({success:true});
  } catch(e) {
    res.status(500).json({error:e.message});
  }
}
