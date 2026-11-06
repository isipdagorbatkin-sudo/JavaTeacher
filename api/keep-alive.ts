export async function GET() {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    return Response.json({ ok: false }, { status: 500 })
  }

  const endpoint = `${url}/rest/v1/project_heartbeat?select=id&limit=1`
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
  }

  const results = await Promise.all([
    fetch(endpoint, { headers, cache: 'no-store' }),
    fetch(endpoint, { headers, cache: 'no-store' }),
    fetch(endpoint, { headers, cache: 'no-store' }),
  ])

  const ok = results.every((response) => response.ok)
  return Response.json({ ok }, { status: ok ? 200 : 502 })
}
