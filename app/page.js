'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

// ═══════════ DATA ═══════════
const STYLES = [
  { id:'cheongsam', name:'Cheongsam Merah', desc:'Gaun sutra merah emas', emoji:'👘',
    grad:'linear-gradient(150deg,#7a0000,#2d0000)',
    pF:'wearing a stunning deep crimson red silk cheongsam (qipao) with intricate gold dragon and peony embroidery along the collar and hem, mandarin collar, form-fitting silhouette, elegant three-quarter pose, soft confident expression',
    pM:'wearing a traditional Chinese Tang suit in deep crimson silk with gold cloud embroidery, mandarin collar, dignified standing pose' },
  { id:'hanfu_blue', name:'Hanfu Biru', desc:'Jubah sutra multi-lapis', emoji:'🩵',
    grad:'linear-gradient(150deg,#0a2560,#060e2a)',
    pF:'wearing a multi-layered navy blue Hanfu with wide flowing sleeves and intricate gold phoenix embroidery, traditional hair bun adorned with golden ornaments and jade hairpins, seated elegantly',
    pM:'wearing majestic deep blue Hanfu scholar robe with gold embroidered cloud patterns, wide silk sleeves, scholar topknot with jade hairpin' },
  { id:'hanfu_white', name:'Hanfu Putih', desc:'Jubah sutra putih mengalir', emoji:'🤍',
    grad:'linear-gradient(150deg,#252525,#111)',
    pF:'wearing a flowing white multi-layered Hanfu with delicate pink plum blossom embroidery on translucent outer silk layer, standing gracefully near a traditional circular moon gate',
    pM:'wearing pristine white silk Hanfu with silver embroidery, flowing layered garment, refined scholarly aesthetic' },
  { id:'imperial', name:'Imperial Emas', desc:'Pakaian kerajaan mewah', emoji:'👑',
    grad:'linear-gradient(150deg,#6a4f00,#2d2000)',
    pF:'wearing an opulent imperial Chinese court dress in gold and crimson brocade silk with embroidered nine-phoenix motif, elaborate golden crown headdress with jade pendants and pearls, commanding imperial pose',
    pM:'wearing a magnificent emperor-style golden dragon robe with nine-dragon brocade, imperial jade belt, ornate golden crown, commanding regal pose' },
  { id:'ink', name:'Lukisan Tinta', desc:'Estetika kaligrafi klasik', emoji:'🖌️',
    grad:'linear-gradient(150deg,#141428,#080814)',
    pF:'ethereal ink wash painting portrait style, wearing flowing grey and white Hanfu, surrounded by delicate ink-painted plum blossom branches, misty atmospheric backdrop',
    pM:'Chinese ink wash painting style, wearing sage grey scholar robe, holding calligraphy brush, misty bamboo backdrop' },
  { id:'warrior', name:'Ksatria', desc:'Baju besi naga hitam merah', emoji:'⚔️',
    grad:'linear-gradient(150deg,#180a28,#0a0514)',
    pF:'wearing female warrior armor in dark lacquered black and crimson plates with gold dragon emblems, flowing red silk sash, fierce beautiful expression, holding an ornate sword',
    pM:'wearing magnificent Chinese general black lacquered armor with gold dragon emblems, red feathered helmet, commanding battle pose' },
  { id:'tang', name:'Putri Tang', desc:'Jubah lebar dinasti Tang', emoji:'🌺',
    grad:'linear-gradient(150deg,#3d1236,#180814)',
    pF:'wearing Tang Dynasty court lady outfit, wide flowing pink and lavender silk robes with multiple translucent layers, elaborate floral hair ornaments with pearl dangles, holding a glowing silk lantern',
    pM:'wearing Tang Dynasty nobleman attire in lavender silk with wide flowing sleeves, carved jade wine cup, Tang court atmosphere' },
  { id:'festival', name:'Imlek Meriah', desc:'Kostum perayaan tahun baru', emoji:'🧧',
    grad:'linear-gradient(150deg,#5a0000,#200000)',
    pF:'wearing vivid red festive Chinese New Year cheongsam with gold peony embroidery, holding red silk lanterns and golden angpao envelopes, joyful celebratory expression',
    pM:'wearing traditional Chinese New Year Tang suit in lucky red with gold cloud patterns, holding red lanterns, festive celebratory pose' },
  { id:'garden', name:'Taman Klasik', desc:'Taman pavilion dan kolam', emoji:'🌿',
    grad:'linear-gradient(150deg,#0a2014,#050c08)',
    pF:'wearing delicate pastel pink and sage green Hanfu in a classical Chinese garden beside a lotus pond, natural dappled sunlight through bamboo, serene feminine expression',
    pM:'wearing sage green Hanfu scholar robe in a bamboo grove garden, sitting beside ornamental rockery, open calligraphy scroll' },
  { id:'modern', name:'Neo China', desc:'Fusion modern-tradisional', emoji:'🌟',
    grad:'linear-gradient(150deg,#080814,#14142a)',
    pF:'wearing a sleek neo-Chinese fashion piece combining modern qipao silhouette with contemporary tailoring, deep red and black with geometric gold accents, high-fashion editorial aesthetic',
    pM:'wearing a modern neo-Chinese suit with traditional mandarin collar, navy and gold, confident urban professional fashion editorial' },
]

const BACKGROUNDS = [
  { id:'studio_red',  label:'Studio Merah',   prompt:'deep saturated crimson red photography studio backdrop, dramatic professional studio lighting with strong side fill light, high contrast cinematic atmosphere' },
  { id:'palace',      label:'Istana Kuno',    prompt:'imperial Chinese palace interior with towering red lacquered pillars, golden carved ornaments, latticed windows with moonlight, hanging red silk lanterns' },
  { id:'garden',      label:'Taman Pavilion', prompt:'classical Chinese garden with traditional wooden pavilion, willow trees, koi pond with lotus flowers, natural soft bokeh sunlight' },
  { id:'plum',        label:'Bunga Plum',     prompt:'winter plum blossom branches with pink flowers dusted in snow, soft misty romantic atmosphere, Chinese painting aesthetic' },
  { id:'gold_silk',   label:'Kain Emas',      prompt:'luxurious golden silk backdrop with subtle embossed dragon cloud patterns, warm opulent golden hour lighting, wealthy imperial aesthetic' },
  { id:'ink_mist',    label:'Kabut Tinta',    prompt:'traditional Chinese ink wash landscape, misty mountain silhouettes, sparse bamboo, poetic ancient atmospheric background' },
]

const ACCESSORIES = [
  { id:'hijab',    label:'Hijab Merah',      pF:'head covered with an elegant deep red silk hijab with subtle gold embroidery on edges, clean layered structured draping fully covering hair and neck, modest yet luxurious' },
  { id:'fan',      label:'Kipas Renda',      p: 'holding an ornate red lace folding fan decorated with gold tassels, gracefully opened' },
  { id:'umbrella', label:'Payung Kertas',    p: 'holding a delicate traditional Chinese oil paper umbrella with black ink floral patterns, tilted over shoulder' },
  { id:'lantern',  label:'Lampion Merah',    p: 'holding a glowing traditional red silk lantern casting warm festive light' },
  { id:'flowers',  label:'Bunga Peony',      p: 'surrounded by large fresh pink and white peony flowers, some petals floating in the air' },
  { id:'hairpin',  label:'Hiasan Rambut',    pF:'hair adorned with elaborate golden ornaments, jade pendants, pearl dangles, and red floral accessories' },
]

// ═══════════ HELPERS ═══════════
const call = async (body) => {
  const r = await fetch('/api/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return r.json()
}

const buildPrompt = (style, gender, accessories, bg, custom) => {
  const s = STYLES.find(x => x.id === style)
  const isFemale = gender === 'female'
  const bgPrompt = BACKGROUNDS.find(x => x.id === bg)?.prompt || BACKGROUNDS[0].prompt

  let subject = s ? (isFemale ? s.pF : s.pM)
    : (isFemale
      ? 'wearing traditional Chinese cheongsam in deep red silk with gold embroidery'
      : 'wearing traditional Chinese Tang suit in dark red with gold patterns')

  const hijab = accessories.has('hijab')
  if (hijab && isFemale) {
    const a = ACCESSORIES.find(x => x.id === 'hijab')
    subject += '. ' + a.pF
  }

  accessories.forEach(id => {
    if (id === 'hijab') return
    if (id === 'hairpin' && hijab) return // no hairpin if hijab
    const a = ACCESSORIES.find(x => x.id === id)
    if (!a) return
    const p = (isFemale && a.pF) ? a.pF : a.p
    if (p) subject += '. ' + p
  })

  const faceRef = 'IMPORTANT: Use the uploaded photo STRICTLY as facial reference. Preserve exact face, skin tone, age, identity — do NOT alter the face. Only change clothes and background'
  const quality = 'ultra high resolution 8K, professional fashion photography, sharp focus, cinematic lighting, bokeh background, photorealistic'

  return `${faceRef}. Create a stunning traditional Chinese style portrait: ${subject}. Background: ${bgPrompt}. ${quality}.${custom ? ' ' + custom : ''}`
}

// ═══════════ COMPONENTS ═══════════
const Divider = ({ label }) => (
  <div style={{ display:'flex', alignItems:'center', gap:10, margin:'20px 0 12px' }}>
    <div style={{ flex:1, height:1, background:'linear-gradient(90deg,rgba(201,168,76,.4),transparent)' }}/>
    <span style={{ fontFamily:'var(--cn)', fontSize:11, fontWeight:600, color:'var(--gold)', letterSpacing:3, whiteSpace:'nowrap', textTransform:'uppercase' }}>{label}</span>
    <div style={{ flex:1, height:1, background:'linear-gradient(270deg,rgba(201,168,76,.4),transparent)' }}/>
  </div>
)

const Chip = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    padding:'7px 14px', borderRadius:'var(--r-pill)', border:`1px solid ${active ? 'var(--gold)' : 'rgba(201,168,76,.2)'}`,
    background: active ? 'rgba(201,168,76,.12)' : 'transparent',
    color: active ? 'var(--gold)' : 'var(--muted)',
    fontSize:12, fontWeight:500, transition:'var(--ease)', whiteSpace:'nowrap'
  }}>{children}</button>
)

// ═══════════ MAIN ═══════════
export default function Page() {
  // ── state
  const [apiKey,      setApiKey]      = useState('')
  const [photoB64,    setPhotoB64]    = useState(null)
  const [photoMime,   setPhotoMime]   = useState('image/jpeg')
  const [photoThumb,  setPhotoThumb]  = useState(null)
  const [style,       setStyle]       = useState(null)
  const [gender,      setGender]      = useState('female')
  const [accessories, setAccessories] = useState(new Set())
  const [bg,          setBg]          = useState('studio_red')
  const [customText,  setCustomText]  = useState('')
  const [aspectRatio, setAspectRatio] = useState('2:3')

  const [phase, setPhase]   = useState('idle') // idle | uploading | generating | polling | done | error
  const [status, setStatus] = useState('')
  const [progress, setProg] = useState(0)

  const [resultUrl, setResultUrl]   = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [gallery, setGallery]       = useState([])
  const [tab, setTab]               = useState('buat')
  const [toasts, setToasts]         = useState([])
  const [galleryOpen, setGalleryOpen] = useState(null)

  const fileRef   = useRef(null)
  const cancelRef = useRef(false)
  const pollRef   = useRef(null)

  // ── load saved
  useEffect(() => {
    setApiKey(localStorage.getItem('kiekey') || '')
    try { setGallery(JSON.parse(localStorage.getItem('gallery') || '[]')) } catch {}
  }, [])
  useEffect(() => {
    localStorage.setItem('gallery', JSON.stringify(gallery.slice(0,40)))
  }, [gallery])

  // ── toast
  const toast = useCallback((msg, type = 'info') => {
    const id = Date.now()
    setToasts(p => [...p, { id, msg, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }, [])

  // ── file
  const handleFile = useCallback(file => {
    if (!file?.type.match(/^image\/(jpeg|png|webp)$/)) { toast('Gunakan format JPG, PNG, atau WEBP', 'error'); return }
    if (file.size > 10 * 1024 * 1024) { toast('Ukuran foto maksimal 10MB', 'error'); return }
    setPhotoMime(file.type)
    setPhotoThumb(URL.createObjectURL(file))
    const reader = new FileReader()
    reader.onload = e => { setPhotoB64(e.target.result); toast('Foto berhasil dipilih! ✓', 'success') }
    reader.readAsDataURL(file)
  }, [toast])

  // ── toggle accessory
  const toggleAcc = useCallback(id => {
    setAccessories(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }, [])

  // ── GENERATE
  const generate = useCallback(async () => {
    if (!photoB64)  { toast('Upload foto kamu dulu ya!', 'error'); return }
    if (!apiKey)    { toast('Masukkan API Key kie.ai terlebih dahulu', 'error'); return }
    if (!style)     { toast('Pilih salah satu gaya foto dulu', 'error'); return }

    cancelRef.current = false
    setPhase('uploading')
    setStatus('Mengunggah foto referensi...')
    setProg(10)

    try {
      // ── Step 1: Upload foto ke kieai.redpandaai.co
      const upRes = await call({ action:'upload', apiKey, base64Data: photoB64, mimeType: photoMime })
      if (!upRes.ok) throw new Error(upRes.error || 'Upload foto gagal')
      if (cancelRef.current) return

      const fileUrl = upRes.fileUrl
      setProg(30)
      setPhase('generating')
      setStatus('Mengirim ke AI...')

      // ── Step 2: Submit task
      const prompt = buildPrompt(style, gender, accessories, bg, customText.trim())
      const genRes = await call({ action:'generate', apiKey, prompt, fileUrl, aspectRatio })
      if (!genRes.ok) throw new Error(genRes.error || 'Gagal membuat task')
      if (cancelRef.current) return

      const taskId = genRes.taskId
      setProg(45)
      setPhase('polling')

      // ── Step 3: Poll sampai selesai
      const messages = [
        'AI sedang mengenakan kostum...',
        'Menata rambut dan aksesoris...',
        'Menyiapkan latar belakang...',
        'Mengatur pencahayaan studio...',
        'Menambahkan sentuhan akhir...',
        'Hampir selesai...',
      ]
      let attempt = 0

      await new Promise((resolve, reject) => {
        pollRef.current = setInterval(async () => {
          if (cancelRef.current) { clearInterval(pollRef.current); reject(new Error('cancel')); return }
          attempt++
          if (attempt > 100) { clearInterval(pollRef.current); reject(new Error('Proses terlalu lama, coba lagi')); return }

          const msgIdx = Math.min(Math.floor(attempt / 17), messages.length - 1)
          setStatus(messages[msgIdx])
          setProg(Math.min(45 + attempt * 0.5, 92))

          try {
            const pollRes = await call({ action:'poll', apiKey, taskId })
            if (!pollRes.ok) return // coba lagi di interval berikutnya

            const { state, resultUrl: url, failMsg } = pollRes

            if (state === 'success') {
              clearInterval(pollRef.current)
              if (!url) { reject(new Error('Tidak ada gambar yang dihasilkan')); return }
              setProg(100)
              setStatus('Selesai! ✨')

              const s = STYLES.find(x => x.id === style)
              setGallery(prev => [{ id: taskId, url, label: s?.name || 'Foto China', date: new Date().toISOString() }, ...prev])

              setTimeout(() => {
                setPhase('done')
                setResultUrl(url)
                setShowResult(true)
              }, 600)
              resolve()

            } else if (state === 'fail') {
              clearInterval(pollRef.current)
              reject(new Error(failMsg || 'AI gagal memproses foto'))
            }
            // waiting | queuing | generating → lanjut polling
          } catch { /* network hiccup, coba lagi */ }
        }, 2000)
      })

    } catch (err) {
      if (pollRef.current) clearInterval(pollRef.current)
      if (err.message === 'cancel') return
      setPhase('error')
      setStatus(err.message)
      toast(err.message, 'error')
      setTimeout(() => setPhase('idle'), 100)
    }
  }, [photoB64, photoMime, apiKey, style, gender, accessories, bg, customText, aspectRatio, toast])

  const cancel = useCallback(() => {
    cancelRef.current = true
    if (pollRef.current) clearInterval(pollRef.current)
    setPhase('idle')
    toast('Dibatalkan')
  }, [toast])

  const saveKey = useCallback(() => {
    localStorage.setItem('kiekey', apiKey)
    toast('API Key tersimpan ✓', 'success')
  }, [apiKey, toast])

  const download = useCallback(async url => {
    try {
      const a = document.createElement('a')
      a.href = url; a.download = `foto-china-${Date.now()}.jpg`; a.target = '_blank'
      a.click()
      toast('Foto disimpan! ✓', 'success')
    } catch { window.open(url, '_blank') }
  }, [toast])

  const sharePhoto = useCallback(async url => {
    try {
      if (navigator.share) await navigator.share({ title:'Studio Foto China AI', text:'Foto China style ku! 🏮', url })
      else { await navigator.clipboard.writeText(url); toast('Link disalin! ✓', 'success') }
    } catch {}
  }, [toast])

  const busy = ['uploading','generating','polling'].includes(phase)

  // ════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════
  return (
    <>
      {/* BG gradient */}
      <div style={{
        position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
        background:`
          radial-gradient(ellipse 130% 55% at 50% -5%, rgba(139,0,0,.45) 0%, transparent 55%),
          radial-gradient(ellipse 70% 40% at 90% 95%, rgba(201,168,76,.08) 0%, transparent 50%),
          linear-gradient(180deg, #0D0500 0%, #1a0a00 50%, #0D0500 100%)`
      }}/>

      {/* TOASTS */}
      <div style={{ position:'fixed', top:16, left:'50%', transform:'translateX(-50%)', zIndex:999, display:'flex', flexDirection:'column', gap:8, alignItems:'center', pointerEvents:'none' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding:'10px 20px', borderRadius:50, whiteSpace:'nowrap', animation:'slideIn .28s ease both',
            background:'rgba(15,6,0,.97)', backdropFilter:'blur(12px)',
            border:`1px solid ${t.type==='error' ? 'rgba(192,57,43,.6)' : t.type==='success' ? 'rgba(46,120,79,.6)' : 'rgba(201,168,76,.3)'}`,
            color: t.type==='error' ? '#ff9999' : t.type==='success' ? '#80d8a0' : 'var(--gold-soft)',
            fontSize:13, fontWeight:500,
          }}>{t.msg}</div>
        ))}
      </div>

      {/* LOADING OVERLAY */}
      {busy && (
        <div style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(8,3,0,.96)', backdropFilter:'blur(16px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:28, textAlign:'center', padding:24 }}>
          {/* Animated lantern */}
          <div style={{ animation:'float 2.8s ease-in-out infinite' }}>
            <div style={{ width:20, height:7, background:'var(--gold)', borderRadius:4, margin:'0 auto 3px' }}/>
            <div style={{
              width:68, height:86,
              background:'linear-gradient(180deg, var(--red) 0%, var(--red-deep) 100%)',
              borderRadius:'50% 50% 40% 40% / 55% 55% 45% 45%',
              border:'2px solid rgba(201,168,76,.4)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:34,
              boxShadow:'0 0 40px rgba(139,0,0,.7), inset 0 0 20px rgba(255,180,0,.1)',
              animation:'pulse 1.6s ease-in-out infinite alternate'
            }}>福</div>
            <div style={{ width:2, height:18, background:'var(--gold)', margin:'3px auto 0' }}/>
          </div>

          <div>
            <div style={{ fontFamily:'var(--cn)', fontSize:18, fontWeight:700, color:'var(--gold)', letterSpacing:3, marginBottom:8 }}>
              {phase === 'uploading' ? 'Mengunggah foto...' : phase === 'generating' ? 'Mengirim ke AI...' : status}
            </div>
            <div style={{ fontSize:13, color:'var(--muted)' }}>
              {phase === 'uploading' ? 'Mempersiapkan referensi wajah kamu' :
               phase === 'generating' ? 'AI mulai bekerja' :
               'Tunggu sebentar ya, AI sedang berkreasi 🎨'}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ width:220, height:3, background:'rgba(201,168,76,.12)', borderRadius:2, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${progress}%`, transition:'width .6s ease', background:'linear-gradient(90deg, var(--red), var(--gold))', borderRadius:2 }}/>
          </div>

          <button onClick={cancel} style={{
            padding:'10px 28px', borderRadius:50, border:'1px solid rgba(232,213,163,.25)',
            background:'transparent', color:'var(--muted)', fontSize:13
          }}>✕ Batalkan</button>
        </div>
      )}

      {/* RESULT FULLSCREEN */}
      {showResult && resultUrl && (
        <div style={{ position:'fixed', inset:0, zIndex:150, background:'var(--ink)', display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderBottom:'1px solid rgba(201,168,76,.15)' }}>
            <div style={{ fontFamily:'var(--cn)', fontSize:14, fontWeight:700, color:'var(--gold)', letterSpacing:2 }}>✨ Foto Selesai!</div>
            <button onClick={() => setShowResult(false)} style={{ width:36, height:36, borderRadius:'50%', border:'1px solid rgba(232,213,163,.2)', background:'transparent', color:'var(--paper)', fontSize:20, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
          </div>
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:16, overflow:'hidden' }}>
            <img src={resultUrl} alt="Hasil" style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', borderRadius:12, boxShadow:'0 24px 60px rgba(0,0,0,.8)' }}/>
          </div>
          <div style={{ display:'flex', gap:10, padding:'14px 18px', borderTop:'1px solid rgba(201,168,76,.15)' }}>
            <button onClick={() => download(resultUrl)} style={{ flex:1, padding:13, borderRadius:12, background:'linear-gradient(135deg,var(--red),var(--red-deep))', border:'none', color:'var(--gold-soft)', fontSize:13, fontWeight:600, boxShadow:'0 4px 18px rgba(139,0,0,.4)' }}>⬇ Simpan</button>
            <button onClick={() => sharePhoto(resultUrl)} style={{ flex:1, padding:13, borderRadius:12, background:'transparent', border:'1.5px solid rgba(201,168,76,.4)', color:'var(--gold)', fontSize:13, fontWeight:600 }}>↗ Bagikan</button>
            <button onClick={() => { setShowResult(false); generate() }} style={{ flex:1, padding:13, borderRadius:12, background:'transparent', border:'1.5px solid rgba(232,213,163,.15)', color:'var(--muted)', fontSize:13 }}>↺ Ulang</button>
          </div>
        </div>
      )}

      {/* GALLERY ITEM */}
      {galleryOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:150, background:'rgba(0,0,0,.96)', display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderBottom:'1px solid rgba(201,168,76,.15)' }}>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--gold)' }}>{galleryOpen.label}</div>
            <button onClick={() => setGalleryOpen(null)} style={{ width:36, height:36, borderRadius:'50%', border:'1px solid rgba(232,213,163,.2)', background:'transparent', color:'var(--paper)', fontSize:20, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
          </div>
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
            <img src={galleryOpen.url} alt={galleryOpen.label} style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain', borderRadius:12 }}/>
          </div>
          <div style={{ display:'flex', gap:10, padding:'14px 18px', borderTop:'1px solid rgba(201,168,76,.15)' }}>
            <button onClick={() => download(galleryOpen.url)} style={{ flex:1, padding:13, borderRadius:12, background:'linear-gradient(135deg,var(--red),var(--red-deep))', border:'none', color:'var(--gold-soft)', fontSize:13, fontWeight:600 }}>⬇ Simpan</button>
            <button onClick={() => sharePhoto(galleryOpen.url)} style={{ flex:1, padding:13, borderRadius:12, background:'transparent', border:'1.5px solid rgba(201,168,76,.4)', color:'var(--gold)', fontSize:13, fontWeight:600 }}>↗ Bagikan</button>
            <button onClick={() => { setGallery(p => p.filter(g => g.id !== galleryOpen.id)); setGalleryOpen(null); toast('Dihapus dari galeri') }} style={{ flex:1, padding:13, borderRadius:12, background:'transparent', border:'1.5px solid rgba(192,57,43,.35)', color:'rgba(192,57,43,.8)', fontSize:13 }}>🗑 Hapus</button>
          </div>
        </div>
      )}

      {/* MAIN */}
      <div style={{ position:'relative', zIndex:1, maxWidth:480, margin:'0 auto', minHeight:'100dvh', display:'flex', flexDirection:'column' }}>

        {/* Header */}
        <header style={{ padding:'22px 18px 0', textAlign:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center', marginBottom:4 }}>
            <div style={{ flex:1, height:1, background:'linear-gradient(90deg,transparent,var(--gold))' }}/>
            <div style={{ fontFamily:'var(--cn)', fontSize:24, fontWeight:700, letterSpacing:6, background:'linear-gradient(135deg,#f0c040,#c9a84c,#8b6914)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', filter:'drop-shadow(0 2px 8px rgba(201,168,76,.5))' }}>华美影楼</div>
            <div style={{ flex:1, height:1, background:'linear-gradient(270deg,transparent,var(--gold))' }}/>
          </div>
          <div style={{ fontSize:11, letterSpacing:3, color:'rgba(232,213,163,.5)', textTransform:'uppercase', marginBottom:6 }}>Studio Foto China · AI</div>
          <div style={{ fontSize:13, color:'var(--muted)', marginBottom:14 }}>
            Ubah fotomu jadi foto bergaya China klasik yang viral ✨
          </div>
        </header>

        {/* ─── TAB BUAT ─── */}
        {tab === 'buat' && (
          <div style={{ flex:1, padding:'0 16px 110px', animation:'fadeUp .35s ease both' }}>

            {/* Upload */}
            <Divider label="Upload Foto Kamu" />
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
              style={{
                border:`1.5px dashed rgba(201,168,76,${photoThumb ? '.2' : '.35'})`,
                borderRadius:16, padding: photoThumb ? 12 : '28px 16px',
                textAlign:'center', cursor:'pointer',
                background:'rgba(201,168,76,.03)', transition:'var(--ease)', marginBottom:4
              }}
            >
              {photoThumb ? (
                <div style={{ position:'relative', maxWidth:160, margin:'0 auto' }}>
                  <img src={photoThumb} alt="Preview" style={{ width:'100%', aspectRatio:'3/4', objectFit:'cover', borderRadius:10, display:'block' }}/>
                  <div style={{ position:'absolute', inset:0, borderRadius:10, background:'rgba(0,0,0,.55)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:4, opacity:0, transition:'var(--ease)' }}
                    onMouseEnter={e => e.currentTarget.style.opacity='1'}
                    onMouseLeave={e => e.currentTarget.style.opacity='0'}>
                    <div style={{ fontSize:22 }}>🔄</div>
                    <div style={{ fontSize:12, color:'#fff', fontWeight:500 }}>Ganti Foto</div>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize:38, marginBottom:8 }}>📸</div>
                  <div style={{ fontWeight:600, fontSize:14, color:'var(--gold-soft)', marginBottom:4 }}>Ketuk untuk pilih foto</div>
                  <div style={{ fontSize:12, color:'var(--muted)' }}>JPG, PNG, WEBP · Maks 10MB</div>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={e => handleFile(e.target.files?.[0])} style={{ display:'none' }}/>
            <div style={{ fontSize:11, color:'rgba(232,213,163,.3)', textAlign:'center', marginBottom:4 }}>
              💡 Gunakan foto wajah jelas untuk hasil terbaik
            </div>

            {/* Gender */}
            <Divider label="Gender" />
            <div style={{ display:'flex', gap:8, marginBottom:4 }}>
              {[['female','👸 Perempuan'],['male','🤴 Laki-laki']].map(([g, lbl]) => (
                <button key={g} onClick={() => setGender(g)} style={{
                  flex:1, padding:11, borderRadius:10,
                  border:`1.5px solid ${gender===g ? 'var(--gold)' : 'rgba(201,168,76,.2)'}`,
                  background: gender===g ? 'rgba(201,168,76,.1)' : 'transparent',
                  color: gender===g ? 'var(--gold)' : 'var(--muted)',
                  fontSize:13, fontWeight:600, transition:'var(--ease)'
                }}>{lbl}</button>
              ))}
            </div>

            {/* Styles */}
            <Divider label="Pilih Gaya Kostum" />
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:9, marginBottom:4 }}>
              {STYLES.map(s => (
                <button key={s.id} onClick={() => setStyle(style === s.id ? null : s.id)} style={{
                  borderRadius:12, overflow:'hidden', aspectRatio:'2/3', position:'relative',
                  border:`2px solid ${style===s.id ? 'var(--gold)' : 'transparent'}`,
                  boxShadow: style===s.id ? '0 0 18px rgba(201,168,76,.4)' : 'none',
                  transform: style===s.id ? 'scale(1.04)' : 'scale(1)',
                  transition:'var(--ease)', cursor:'pointer', background: s.grad
                }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%' }}>
                    <div style={{ fontSize:26, filter:'drop-shadow(0 2px 6px rgba(0,0,0,.6))' }}>{s.emoji}</div>
                  </div>
                  <div style={{
                    position:'absolute', bottom:0, left:0, right:0,
                    padding:'16px 5px 6px',
                    background:'linear-gradient(transparent,rgba(0,0,0,.88))',
                    fontSize:9, textAlign:'center', color:'rgba(232,213,163,.85)', lineHeight:1.4
                  }}>
                    <div style={{ fontWeight:700 }}>{s.name}</div>
                    <div style={{ opacity:.65, fontSize:8 }}>{s.desc}</div>
                  </div>
                  {style===s.id && (
                    <div style={{ position:'absolute', top:5, right:5, width:18, height:18, background:'var(--gold)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'var(--ink)', fontWeight:700 }}>✓</div>
                  )}
                </button>
              ))}
            </div>

            {/* Accessories */}
            <Divider label="Aksesori & Detail" />
            <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:4 }}>
              {ACCESSORIES.filter(a => !(a.id === 'hairpin' && gender === 'male')).map(a => (
                <Chip key={a.id} active={accessories.has(a.id)} onClick={() => toggleAcc(a.id)}>
                  {a.label}
                </Chip>
              ))}
            </div>

            {/* Background */}
            <Divider label="Latar Belakang" />
            <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:4 }}>
              {BACKGROUNDS.map(b => (
                <Chip key={b.id} active={bg===b.id} onClick={() => setBg(b.id)}>{b.label}</Chip>
              ))}
            </div>

            {/* Aspect ratio */}
            <Divider label="Format Foto" />
            <div style={{ display:'flex', gap:8, marginBottom:4 }}>
              {[['2:3','Portrait 2:3'],['1:1','Square 1:1'],['3:4','Potret 3:4']].map(([v,lbl]) => (
                <button key={v} onClick={() => setAspectRatio(v)} style={{
                  flex:1, padding:'9px 4px', borderRadius:10, fontSize:11, fontWeight:500,
                  border:`1.5px solid ${aspectRatio===v ? 'var(--gold)' : 'rgba(201,168,76,.2)'}`,
                  background: aspectRatio===v ? 'rgba(201,168,76,.1)' : 'transparent',
                  color: aspectRatio===v ? 'var(--gold)' : 'var(--muted)', transition:'var(--ease)'
                }}>{lbl}</button>
              ))}
            </div>

            {/* Custom */}
            <Divider label="Kustomisasi Tambahan (opsional)" />
            <textarea
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              placeholder="Contoh: rambut panjang terurai, pose duduk anggun, ekspresi senyum lembut..."
              style={{
                width:'100%', minHeight:72, padding:'12px 14px', borderRadius:12,
                background:'rgba(255,255,255,.04)', border:'1px solid rgba(201,168,76,.18)',
                color:'var(--paper)', fontSize:13, resize:'none', outline:'none',
                lineHeight:1.6, marginBottom:14, transition:'var(--ease)'
              }}
            />

            {/* API Key */}
            <Divider label="API Key kie.ai" />
            <div style={{ display:'flex', gap:8, marginBottom:6 }}>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Paste API Key kamu di sini..."
                style={{
                  flex:1, padding:'11px 14px', borderRadius:12,
                  background:'rgba(255,255,255,.04)', border:'1px solid rgba(201,168,76,.18)',
                  color:'var(--paper)', fontSize:12, outline:'none', fontFamily:'monospace'
                }}
              />
              <button onClick={saveKey} style={{
                padding:'11px 14px', borderRadius:12, border:'1px solid rgba(201,168,76,.3)',
                background:'transparent', color:'var(--gold)', fontSize:12, fontWeight:600, whiteSpace:'nowrap'
              }}>Simpan</button>
            </div>
            <div style={{ fontSize:11, color:'rgba(232,213,163,.35)', marginBottom:20 }}>
              Daftar & dapatkan key di{' '}
              <a href="https://kie.ai/api-key" target="_blank" rel="noopener" style={{ color:'var(--gold)', textDecoration:'none' }}>kie.ai/api-key</a>
              {' '}· Key disimpan di browser kamu
            </div>

            {/* GENERATE BTN */}
            <button
              onClick={generate}
              disabled={busy}
              style={{
                width:'100%', padding:'17px 16px', borderRadius:50, border:'none',
                background: busy ? 'rgba(139,0,0,.4)' : 'linear-gradient(135deg, var(--red), var(--red-deep))',
                color:'var(--gold-soft)', fontSize:15, fontWeight:700, letterSpacing:2,
                boxShadow: busy ? 'none' : '0 4px 28px rgba(139,0,0,.55), inset 0 1px 0 rgba(255,255,255,.08)',
                cursor: busy ? 'not-allowed' : 'pointer', transition:'var(--ease)',
                position:'relative', overflow:'hidden'
              }}
            >
              {busy
                ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                    <span style={{ display:'inline-block', width:16, height:16, border:'2px solid rgba(232,213,163,.3)', borderTop:'2px solid var(--gold)', borderRadius:'50%', animation:'spin .8s linear infinite' }}/>
                    Sedang Diproses...
                  </span>
                : '✨ Buat Foto Sekarang'}
            </button>
          </div>
        )}

        {/* ─── TAB GALERI ─── */}
        {tab === 'galeri' && (
          <div style={{ flex:1, padding:'0 16px 110px', animation:'fadeUp .35s ease both' }}>
            <Divider label="Galeri Foto Kamu" />
            {gallery.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 20px' }}>
                <div style={{ fontSize:52, marginBottom:14 }}>🏮</div>
                <div style={{ fontSize:14, color:'var(--muted)', lineHeight:1.8 }}>Belum ada foto.<br/>Buat foto pertamamu!</div>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
                {gallery.map(item => (
                  <div key={item.id} onClick={() => setGalleryOpen(item)} style={{
                    borderRadius:12, overflow:'hidden', aspectRatio:'2/3', position:'relative',
                    cursor:'pointer', border:'1px solid rgba(201,168,76,.1)', background:'var(--ink2)',
                    transition:'var(--ease)'
                  }}>
                    <img src={item.url} alt={item.label} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
                    <div style={{
                      position:'absolute', bottom:0, left:0, right:0,
                      padding:'20px 10px 8px',
                      background:'linear-gradient(transparent,rgba(0,0,0,.82))',
                      fontSize:10, color:'var(--gold-soft)', fontWeight:500
                    }}>{item.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB PENGATURAN ─── */}
        {tab === 'setting' && (
          <div style={{ flex:1, padding:'0 16px 110px', animation:'fadeUp .35s ease both' }}>
            <Divider label="Pengaturan" />

            <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(201,168,76,.12)', borderRadius:16, padding:16, marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--gold)', letterSpacing:3, textTransform:'uppercase', marginBottom:12 }}>API Key kie.ai</div>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Paste API Key kamu..."
                style={{
                  width:'100%', padding:'11px 14px', borderRadius:12, marginBottom:8,
                  background:'rgba(255,255,255,.04)', border:'1px solid rgba(201,168,76,.18)',
                  color:'var(--paper)', fontSize:12, outline:'none', fontFamily:'monospace'
                }}
              />
              <div style={{ fontSize:11, color:'rgba(232,213,163,.35)', marginBottom:12 }}>
                Daftar gratis di <a href="https://kie.ai/api-key" target="_blank" rel="noopener" style={{ color:'var(--gold)', textDecoration:'none' }}>kie.ai/api-key</a>
              </div>
              <button onClick={saveKey} style={{
                width:'100%', padding:13, borderRadius:12,
                background:'linear-gradient(135deg,var(--red),var(--red-deep))',
                border:'none', color:'var(--gold-soft)', fontSize:13, fontWeight:600
              }}>💾 Simpan API Key</button>
            </div>

            <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(201,168,76,.12)', borderRadius:16, padding:16, marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--gold)', letterSpacing:3, textTransform:'uppercase', marginBottom:12 }}>Tentang Aplikasi</div>
              <div style={{ textAlign:'center', padding:'8px 0' }}>
                <div style={{ fontFamily:'var(--cn)', fontSize:20, fontWeight:700, letterSpacing:5, background:'linear-gradient(135deg,#f0c040,#c9a84c)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:8 }}>华美影楼</div>
                <div style={{ fontSize:12, color:'var(--muted)', lineHeight:1.8 }}>
                  Studio Foto China AI · v2.0<br/>
                  Powered by kie.ai GPT Image 2<br/>
                  <span style={{ color:'rgba(232,213,163,.25)' }}>Target: Pasar Indonesia 🇮🇩</span>
                </div>
              </div>
            </div>

            {gallery.length > 0 && (
              <button
                onClick={() => { if(confirm(`Hapus semua ${gallery.length} foto dari galeri?`)) { setGallery([]); toast('Galeri dikosongkan') } }}
                style={{
                  width:'100%', padding:13, borderRadius:12, marginTop:4,
                  background:'transparent', border:'1px solid rgba(192,57,43,.3)',
                  color:'rgba(192,57,43,.75)', fontSize:13
                }}
              >🗑 Kosongkan Galeri ({gallery.length} foto)</button>
            )}
          </div>
        )}

        {/* BOTTOM NAV */}
        <nav style={{
          position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
          width:'100%', maxWidth:480,
          background:'rgba(8,3,0,.95)', backdropFilter:'blur(20px)',
          borderTop:'1px solid rgba(201,168,76,.18)',
          display:'flex', zIndex:100,
          paddingBottom:'env(safe-area-inset-bottom,0)'
        }}>
          {[['buat','✨','Buat Foto'],['galeri','🖼️','Galeri'],['setting','⚙️','Pengaturan']].map(([t, icon, lbl]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3,
              padding:'10px 8px 12px', border:'none', background:'transparent',
              color: tab===t ? 'var(--gold)' : 'rgba(232,213,163,.38)',
              fontSize:10, fontWeight:600, transition:'var(--ease)', position:'relative'
            }}>
              {tab===t && <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:2, background:'linear-gradient(90deg,transparent,var(--gold),transparent)', borderRadius:'0 0 2px 2px' }}/>}
              <span style={{ fontSize:20, lineHeight:1 }}>{icon}</span>
              <span>{lbl}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  )
}
