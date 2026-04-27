export default async function handler(req, res) {
  if(req.method !== 'DELETE') return res.status(405).end();

  const SUPABASE_URL = "https://bctrrdscvgobmmjqnwks.supabase.co";
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if(!SUPABASE_KEY) return res.status(500).json({error: "Missing SUPABASE_SERVICE_KEY"});

  const { id } = req.query;
  if(!id) return res.status(400).json({error: "Missing id"});

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/cats?id=eq.${id}`, {
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
