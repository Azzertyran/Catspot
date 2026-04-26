export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).end();

  const SUPABASE_URL = "https://bctrrdscvgobmmjqnwks.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdHJyZHNjdmdvYm1tanFud2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzE5MzUsImV4cCI6MjA5MjYwNzkzNX0.1h1uLYSs-B7XfaX7sOOB8EVsiGrLZowXaq786CeIQGc";

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
