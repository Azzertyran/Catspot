export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).end();

  const SUPABASE_URL = "https://bctrrdscvgobmmjqnwks.supabase.co";
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if(!SUPABASE_KEY) return res.status(500).json({error: "Missing SUPABASE_SERVICE_KEY"});

  // Vérification basique d'un token admin
  const auth = req.headers["x-admin-token"];
  if(auth !== process.env.ADMIN_TOKEN) return res.status(403).json({error: "Forbidden"});

  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  };

  try {
    // 1. Récupérer toutes les photo_url en base
    const catsRes = await fetch(`${SUPABASE_URL}/rest/v1/cats?select=photo_url&photo_url=not.is.null`, { headers });
    const catsData = await catsRes.json();
    const usedUrls = new Set(catsData.map(c => c.photo_url).filter(Boolean));

    // 2. Lister tous les fichiers dans le bucket cat-photos
    const listRes = await fetch(`${SUPABASE_URL}/storage/v1/object/list/cat-photos`, {
      method: "POST",
      headers,
      body: JSON.stringify({ prefix: "", limit: 1000, offset: 0 })
    });
    const listData = await listRes.json();
    const allFiles = (listData || []).flatMap(folder => {
      if(folder.id) return [`${folder.name}`];
      return [];
    });

    // 3. Identifier les orphelins
    const orphans = allFiles.filter(path => {
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/cat-photos/${path}`;
      return !usedUrls.has(publicUrl);
    });

    if(!orphans.length) return res.status(200).json({deleted: 0, message: "Aucun orphelin trouvé"});

    // 4. Supprimer les orphelins
    const deleteRes = await fetch(`${SUPABASE_URL}/storage/v1/object/cat-photos`, {
      method: "DELETE",
      headers,
      body: JSON.stringify({ prefixes: orphans })
    });

    res.status(200).json({ deleted: orphans.length, files: orphans });
  } catch(e) {
    res.status(500).json({error: e.message});
  }
}
