// app/api/proxy/route.js
// Server-side proxy — browser tidak pernah langsung call kie.ai
// Semua request ke kie.ai dilakukan dari server Node.js Next.js
// Tidak ada CORS issue sama sekali

export const runtime = 'nodejs'
export const maxDuration = 120 // 2 menit max untuk polling

export async function POST(request) {
  try {
    const body = await request.json()
    const { action, apiKey } = body

    if (!apiKey) {
      return Response.json({ ok: false, error: 'API key tidak boleh kosong' }, { status: 400 })
    }

    const KIE_BASE     = 'https://api.kie.ai'
    const UPLOAD_BASE  = 'https://kieai.redpandaai.co'
    const AUTH_HEADER  = { 'Authorization': `Bearer ${apiKey}` }

    // ─────────────────────────────────────
    // ACTION: upload
    // Upload foto ke kieai.redpandaai.co lalu dapat downloadUrl
    // ─────────────────────────────────────
    if (action === 'upload') {
      const { base64Data, mimeType } = body
      const ext = mimeType?.split('/')[1] || 'jpg'

      const res = await fetch(`${UPLOAD_BASE}/api/file-base64-upload`, {
        method: 'POST',
        headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Data,                              // full data URL: "data:image/jpeg;base64,..."
          uploadPath: 'chinese-studio',
          fileName: `ref-${Date.now()}.${ext}`,
        }),
      })

      const data = await res.json()
      console.log('[upload response]', JSON.stringify(data).slice(0, 200))

      if (!res.ok || !data.data?.downloadUrl) {
        return Response.json({ ok: false, error: data.msg || `Upload gagal (${res.status})` })
      }

      return Response.json({ ok: true, fileUrl: data.data.downloadUrl })
    }

    // ─────────────────────────────────────
    // ACTION: generate
    // Submit task ke kie.ai Market API
    // ─────────────────────────────────────
    if (action === 'generate') {
      const { prompt, fileUrl, aspectRatio } = body

      // GPT Image 2 Image-to-Image
      // POST https://api.kie.ai/api/v1/jobs/createTask
      // body: { model, input: { prompt, input_urls, aspect_ratio } }
      const payload = {
        model: 'gpt-image-2-image-to-image',
        input: {
          prompt,
          aspect_ratio: aspectRatio || '2:3',
          ...(fileUrl && { input_urls: [fileUrl] }),
        },
      }

      console.log('[generate] payload:', JSON.stringify(payload).slice(0, 300))

      const res = await fetch(`${KIE_BASE}/api/v1/jobs/createTask`, {
        method: 'POST',
        headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      console.log('[generate response]', JSON.stringify(data).slice(0, 200))

      if (!res.ok || data.code !== 200) {
        return Response.json({ ok: false, error: data.msg || `Generate gagal (${res.status})` })
      }

      return Response.json({ ok: true, taskId: data.data.taskId })
    }

    // ─────────────────────────────────────
    // ACTION: poll
    // Cek status task di kie.ai
    // ─────────────────────────────────────
    if (action === 'poll') {
      const { taskId } = body

      // GET https://api.kie.ai/api/v1/jobs/recordInfo?taskId=xxx
      // state: waiting | queuing | generating | success | fail
      // resultJson: JSON string → parse → { resultUrls: ["https://..."] }
      const res = await fetch(
        `${KIE_BASE}/api/v1/jobs/recordInfo?taskId=${taskId}`,
        { headers: AUTH_HEADER }
      )

      const data = await res.json()
      console.log('[poll]', data?.data?.state, taskId)

      if (!res.ok || data.code !== 200) {
        return Response.json({ ok: false, error: data.msg || `Poll gagal (${res.status})` })
      }

      const d = data.data
      const state = d.state // waiting | queuing | generating | success | fail

      let resultUrl = null
      if (state === 'success' && d.resultJson) {
        try {
          const rj = JSON.parse(d.resultJson)
          resultUrl = rj.resultUrls?.[0] || null
        } catch (e) {
          console.error('[poll] resultJson parse error', e)
        }
      }

      return Response.json({
        ok: true,
        state,
        resultUrl,
        failMsg: d.failMsg || null,
      })
    }

    return Response.json({ ok: false, error: `Action tidak dikenal: ${action}` }, { status: 400 })

  } catch (err) {
    console.error('[proxy error]', err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}
