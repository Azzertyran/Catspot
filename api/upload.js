export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).end();

  const SUPABASE_URL = "https://bctrrdscvgobmmjqnwks.supabase.co";
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if(!SUPABASE_KEY) return res.status(500).json({error: "Missing SUPABASE_SERVICE_KEY"});

  try {
    const chunks = [];
    for await(const chunk of req){ chunks.push(chunk); }
    const body = Buffer.concat(chunks);

    const path = req.headers["x-file-path"];
    const contentType = req.headers["x-content-type"] || "image/jpeg";

    const response = await fetch(
      `${SUPABASE_URL}/storage/v1/object/cat-photos/${path}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "apikey": SUPABASE_KEY,
          "Content-Type": contentType,
          "x-upsert": "true"
        },
        body
      }
    );

    if(!response.ok){
      const err = await response.text();
      return res.status(response.status).json({error: err});
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/cat-photos/${path}`;
    res.status(200).json({publicUrl});
  } catch(e){
    res.status(500).json({error: e.message});
  }
}
