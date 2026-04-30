export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST(request) {
  let body = {}
  try {
    body = await request.json()
  } catch (e) {
    return Response.json({ ok: false, error: 'Request body tidak valid JSON', detail: e.message }, { status: 400 })
  }

  const { action } = body

  // Log semua request masuk (tampil di Vercel Function Logs)
  console.log('[proxy] action:', action, '| body keys:', Object.keys(body).join(', '))

  const KIE_KEY = process.env.KIE_API_KEY
  if (!KIE_KEY) {
    console.error('[proxy] KIE_API_KEY env variable tidak ditemukan!')
    return Response.json({ ok: false, error: 'Server belum dikonfigurasi — KIE_API_KEY kosong. Set di Vercel Environment Variables.' }, { status: 500 })
  }

  const AUTH = { 'Authorization': `Bearer ${KIE_KEY}` }

  // ─── UPLOAD ───
  if (action === 'upload') {
    const { base64Data, mimeType } = body
    if (!base64Data) return Response.json({ ok: false, error: 'base64Data kosong' }, { status: 400 })

    const ext = (mimeType || 'image/jpeg').split('/')[1] || 'jpg'
    console.log('[upload] mimeType:', mimeType, '| base64 length:', base64Data?.length)

    try {
      const res = await fetch('https://kieai.redpandaai.co/api/file-base64-upload', {
        method: 'POST',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Data,
          uploadPath: 'studio-foto',
          fileName: `photo-${Date.now()}.${ext}`,
        }),
      })
      const data = await res.json()
      console.log('[upload] response status:', res.status, '| data:', JSON.stringify(data).slice(0, 300))

      if (!res.ok || !data.data?.downloadUrl) {
        return Response.json({ ok: false, error: data.msg || `Upload gagal: HTTP ${res.status}`, raw: data })
      }
      return Response.json({ ok: true, fileUrl: data.data.downloadUrl })
    } catch (err) {
      console.error('[upload] fetch error:', err.message)
      return Response.json({ ok: false, error: `Upload network error: ${err.message}` }, { status: 500 })
    }
  }

  // ─── GENERATE ───
  if (action === 'generate') {
    const { prompt, fileUrl, aspectRatio } = body
    if (!prompt) return Response.json({ ok: false, error: 'prompt kosong' }, { status: 400 })

    const payload = {
      model: 'gpt-image-2-image-to-image',
      input: {
        prompt,
        aspect_ratio: aspectRatio || '2:3',
        ...(fileUrl && { input_urls: [fileUrl] }),
      },
    }
    console.log('[generate] payload:', JSON.stringify(payload).slice(0, 400))

    try {
      const res = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
        method: 'POST',
        headers: { ...AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      console.log('[generate] response status:', res.status, '| data:', JSON.stringify(data).slice(0, 300))

      if (!res.ok || data.code !== 200) {
        return Response.json({ ok: false, error: data.msg || `Generate gagal: HTTP ${res.status}`, raw: data })
      }
      return Response.json({ ok: true, taskId: data.data.taskId })
    } catch (err) {
      console.error('[generate] fetch error:', err.message)
      return Response.json({ ok: false, error: `Generate network error: ${err.message}` }, { status: 500 })
    }
  }

  // ─── POLL ───
  if (action === 'poll') {
    const { taskId } = body
    if (!taskId) return Response.json({ ok: false, error: 'taskId kosong' }, { status: 400 })

    try {
      const res = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, {
        headers: AUTH,
      })
      const data = await res.json()
      console.log('[poll] taskId:', taskId, '| state:', data?.data?.state)

      if (!res.ok || data.code !== 200) {
        return Response.json({ ok: false, error: data.msg || `Poll gagal: HTTP ${res.status}` })
      }

      const d = data.data
      let resultUrl = null
      if (d.state === 'success' && d.resultJson) {
        try {
          const rj = JSON.parse(d.resultJson)
          resultUrl = rj.resultUrls?.[0] || null
          console.log('[poll] resultUrl:', resultUrl)
        } catch (e) {
          console.error('[poll] parse resultJson error:', e.message)
        }
      }

      return Response.json({
        ok: true,
        state: d.state,
        resultUrl,
        failMsg: d.failMsg || d.failCode || null,
      })
    } catch (err) {
      console.error('[poll] fetch error:', err.message)
      return Response.json({ ok: false, error: `Poll network error: ${err.message}` }, { status: 500 })
    }
  }

  // Unknown action
  console.error('[proxy] unknown action:', action)
  return Response.json({ ok: false, error: `Action tidak dikenal: "${action}"` }, { status: 400 })
}
