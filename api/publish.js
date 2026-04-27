export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).end();
  
  const SUPABASE_URL = "https://bctrrdscvgobmmjqnwks.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdHJyZHNjdmdvYm1tanFud2tzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAzMTkzNSwiZXhwIjoyMDkyNjA3OTM1fQ.UywHN9HFc6hdltjJ6NhnXmRqcVNayYDpuSVxOenvSKU";
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/cats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    if(!response.ok) return res.status(response.status).json({error: data});
    res.status(200).json(data[0] || data);
  } catch(e) {
    res.status(500).json({error: e.message});
  }
}
