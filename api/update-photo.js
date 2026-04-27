export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).end();

  const SUPABASE_URL = "https://bctrrdscvgobmmjqnwks.supabase.co";
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if(!SUPABASE_KEY) return res.status(500).json({error: "Missing SUPABASE_SERVICE_KEY"});

  const {cat_id, photo_url} = req.body;
  if(!cat_id || !photo_url) return res.status(400).json({error: "Missing cat_id or photo_url"});

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/cats?id=eq.${cat_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({photo_url})
    });

    const data = await response.json();
    if(!response.ok) return res.status(response.status).json({error: data});
    res.status(200).json(data[0] || data);
  } catch(e) {
    res.status(500).json({error: e.message});
  }
}
