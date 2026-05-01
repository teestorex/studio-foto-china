'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

// ═══════════════════════════════════════════════════
// DATA — CATEGORIES & TEMPLATES
// ═══════════════════════════════════════════════════

const CATEGORIES = [
  { id:'china',    label:'🏮 China Klasik',   desc:'Cheongsam, Hanfu, Dinasti' },
  { id:'wedding',  label:'💍 Pernikahan',      desc:'Pengantin, Prewedding, Siraman' },
  { id:'modern',   label:'✨ Modern Glam',     desc:'Editorial, Aesthetic, Casual' },
  { id:'occasion', label:'🎉 Momen Spesial',   desc:'Wisuda, Ulang Tahun, Lebaran' },
]

const TEMPLATES = {
  china: [
    { id:'cheongsam_red',   name:'Cheongsam Merah',  desc:'Gaun sutra merah emas',      emoji:'👘', grad:'linear-gradient(150deg,#7a0000,#2d0000)',
      pF:'wearing a stunning deep crimson red silk cheongsam (qipao) with intricate gold dragon and peony embroidery, mandarin collar, form-fitting elegant silhouette, three-quarter pose, soft confident expression',
      pM:'wearing a traditional Chinese Tang suit in deep crimson silk with gold cloud embroidery, mandarin collar, dignified standing pose' },
    { id:'cheongsam_gold',  name:'Cheongsam Emas',   desc:'Mewah warna emas',            emoji:'✨', grad:'linear-gradient(150deg,#6a4f00,#2d2000)',
      pF:'wearing a luxurious gold and black silk cheongsam with intricate embossed dragon pattern, mandarin collar with pearl buttons, elegant side slit, glamorous sophisticated pose',
      pM:'wearing an elegant gold Tang suit with black trim and subtle dragon embroidery, refined wealthy gentleman aesthetic' },
    { id:'cheongsam_pink',  name:'Cheongsam Pink',   desc:'Manis & romantis',            emoji:'🌸', grad:'linear-gradient(150deg,#5a1040,#200818)',
      pF:'wearing a delicate pastel pink silk cheongsam with embroidered cherry blossom and butterfly patterns, soft romantic feminine expression, holding a small bouquet of pink peonies',
      pM:'wearing a soft pink Tang suit with floral embroidery, modern romantic aesthetic' },
    { id:'hanfu_blue',      name:'Hanfu Biru',        desc:'Jubah sutra multi-lapis',     emoji:'🩵', grad:'linear-gradient(150deg,#0a2560,#060e2a)',
      pF:'wearing a multi-layered navy blue Hanfu with wide flowing sleeves and gold phoenix embroidery, traditional hair bun with golden ornaments and jade hairpins, seated elegantly',
      pM:'wearing majestic deep blue Hanfu scholar robe with gold cloud patterns, wide silk sleeves, jade hairpin topknot' },
    { id:'hanfu_white',     name:'Hanfu Putih',       desc:'Jubah sutra putih mengalir',  emoji:'🤍', grad:'linear-gradient(150deg,#252525,#111)',
      pF:'wearing a flowing white multi-layered Hanfu with delicate pink plum blossom embroidery on outer translucent silk layer, standing gracefully near a circular moon gate',
      pM:'wearing pristine white silk Hanfu with silver thread embroidery, refined scholarly aesthetic' },
    { id:'hanfu_green',     name:'Hanfu Hijau Jade',  desc:'Jade & alam klasik',          emoji:'💚', grad:'linear-gradient(150deg,#0a3020,#041008)',
      pF:'wearing a beautiful jade green and cream Hanfu with lotus flower embroidery on silk sleeves, standing near a bamboo forest, serene natural feminine expression',
      pM:'wearing jade green Hanfu robe with bamboo and crane embroidery, sitting on a classical garden rock' },
    { id:'imperial',        name:'Imperial Emas',     desc:'Pakaian kerajaan mewah',      emoji:'👑', grad:'linear-gradient(150deg,#6a4f00,#2d2000)',
      pF:'wearing an opulent imperial Chinese court dress in gold and crimson brocade with nine-phoenix embroidery, elaborate golden crown headdress with jade pendants and pearls, commanding imperial pose',
      pM:'wearing a magnificent emperor-style golden dragon robe with nine-dragon embroidery, imperial jade belt, ornate golden crown, regal commanding pose' },
    { id:'tang',            name:'Putri Tang',        desc:'Jubah lebar dinasti Tang',    emoji:'🌺', grad:'linear-gradient(150deg,#3d1236,#180814)',
      pF:'wearing Tang Dynasty court lady outfit, wide flowing pink and lavender silk multi-layered robes, elaborate floral hair ornaments with pearl dangles, holding a glowing red silk lantern',
      pM:'wearing Tang Dynasty nobleman lavender silk attire with wide flowing sleeves, carved jade wine cup, Tang court atmosphere' },
    { id:'warrior',         name:'Ksatria Naga',      desc:'Baju besi naga hitam merah',  emoji:'⚔️', grad:'linear-gradient(150deg,#180a28,#0a0514)',
      pF:'wearing female warrior armor in dark lacquered black and crimson plates with gold dragon emblems, flowing red silk battle sash, fierce beautiful expression, holding an ornate sword',
      pM:'wearing magnificent Chinese general black lacquered armor with gold dragon emblems, red feathered helmet, commanding battle pose' },
    { id:'ink_art',         name:'Lukisan Tinta',     desc:'Estetika kaligrafi klasik',   emoji:'🖌️', grad:'linear-gradient(150deg,#141428,#080814)',
      pF:'ethereal Chinese ink wash painting style portrait, wearing flowing grey and white Hanfu, delicate ink-painted plum blossom branches surrounding her, misty poetic atmosphere',
      pM:'Chinese ink wash painting style, wearing sage grey scholar robe, holding calligraphy brush, misty bamboo grove backdrop' },
    { id:'festival',        name:'Imlek Meriah',      desc:'Kostum perayaan tahun baru',  emoji:'🧧', grad:'linear-gradient(150deg,#5a0000,#200000)',
      pF:'wearing vivid red festive Chinese New Year cheongsam with gold peony embroidery, holding red silk lanterns and golden angpao envelopes, joyful celebratory expression',
      pM:'wearing traditional Chinese New Year Tang suit in lucky red with gold cloud patterns, holding red lanterns, festive pose' },
    { id:'neo_china',       name:'Neo China Modern',  desc:'Fusion modern-tradisional',   emoji:'🌟', grad:'linear-gradient(150deg,#080814,#14142a)',
      pF:'wearing a sleek neo-Chinese fashion piece combining modern qipao silhouette with contemporary tailoring, deep red and black with geometric gold accents, high-fashion editorial aesthetic',
      pM:'wearing modern neo-Chinese mandarin collar suit in navy and gold, confident urban fashion editorial pose' },
  ],

  wedding: [
    { id:'pengantin_merah', name:'Pengantin China',   desc:'Gaun pengantin merah tradisional', emoji:'🔴', grad:'linear-gradient(150deg,#8b0000,#3d0000)',
      pF:'wearing a traditional Chinese bridal gown in deep crimson red silk with gold phoenix and dragon embroidery, elaborate traditional bridal headdress with red veil, dangling gold jewelry, holding a red bouquet, joyful bridal expression',
      pM:'wearing traditional Chinese groom suit in red and gold brocade with dragon embroidery, black mandarin collar jacket, dignified happy groom pose' },
    { id:'pengantin_putih', name:'Pengantin Modern',  desc:'Gaun putih elegan',               emoji:'🤍', grad:'linear-gradient(150deg,#1a1a2e,#0d0d1a)',
      pF:'wearing an elegant modern white wedding gown with subtle Chinese embroidery details on the bodice, flowing skirt with delicate floral lace overlay, bridal veil, holding a bouquet of white peonies and roses',
      pM:'wearing a sleek black tuxedo with a mandarin collar twist and red pocket square, confident groom smile' },
    { id:'prewedding_garden',name:'Prewedding Taman', desc:'Romantis di taman bunga',          emoji:'🌷', grad:'linear-gradient(150deg,#1a3020,#0a1808)',
      pF:'wearing a flowy pastel pink chiffon dress with subtle floral embroidery, standing in a lush blooming garden with cherry blossom trees, soft golden hour sunlight, romantic dreamy expression, holding flower bouquet',
      pM:'wearing a cream linen suit with a soft pink pocket square, relaxed romantic pose in garden setting with his partner' },
    { id:'prewedding_beach', name:'Prewedding Pantai', desc:'Romantis tepi pantai',            emoji:'🌊', grad:'linear-gradient(150deg,#0a1a3a,#050a18)',
      pF:'wearing a flowing white silk beach dress with delicate gold embroidery, standing on a pristine beach at golden sunset, hair flowing naturally in the sea breeze, romantic dreamy expression',
      pM:'wearing white linen trousers and a relaxed white linen shirt, standing barefoot on beach sand at golden sunset, romantic partner pose' },
    { id:'siraman',         name:'Siraman Adat',      desc:'Ritual siraman Jawa',             emoji:'🌺', grad:'linear-gradient(150deg,#3d2000,#180c00)',
      pF:'wearing a traditional Javanese siraman outfit in yellow and gold batik kebaya with jasmine flower garlands adorning the hair, seated gracefully during traditional pre-wedding ceremony, serene blessed expression',
      pM:'wearing traditional Javanese siraman sarong and white shirt, jasmine flower garland, reverent ceremonial expression' },
    { id:'akad_nikah',      name:'Akad Nikah',        desc:'Busana akad elegan',              emoji:'🕌', grad:'linear-gradient(150deg,#1a1200,#0a0800)',
      pF:'wearing an elegant white and gold Muslim bridal kebaya with intricate lace embroidery, matching hijab styled with pearl bridal pins, pearl and gold jewelry, holding a bouquet of white roses, serene beautiful expression',
      pM:'wearing an elegant white Muslim groom suit with gold songket trim, white kopiah, dignified happy groom expression' },
    { id:'resepsi',         name:'Resepsi Mewah',     desc:'Gaun pesta kemewahan',            emoji:'💎', grad:'linear-gradient(150deg,#1a0050,#0a0028)',
      pF:'wearing a glamorous deep purple and gold ballgown with crystal embellishments, dramatic off-shoulder silhouette, sparkling diamond jewelry, grand ballroom setting, confident glamorous expression',
      pM:'wearing a bespoke navy blue suit with a gold tie and pocket square, confident sophisticated groom at elegant reception' },
  ],

  modern: [
    { id:'editorial_glam',  name:'Editorial Glam',   desc:'Foto majalah fashion',            emoji:'💫', grad:'linear-gradient(150deg,#0a0a1a,#050510)',
      pF:'wearing a stunning avant-garde fashion editorial outfit, high-fashion model pose, dramatic professional studio lighting, Vogue magazine cover aesthetic, bold makeup, confident fierce expression',
      pM:'wearing a sharp tailored designer suit, high-fashion male editorial pose, dramatic studio lighting, GQ magazine aesthetic' },
    { id:'aesthetic_soft',  name:'Soft Aesthetic',   desc:'Dreamy & pastel vibes',           emoji:'🌸', grad:'linear-gradient(150deg,#2a1028,#180818)',
      pF:'wearing a dreamy soft pastel aesthetic outfit, soft pink and lavender tones, fairy-like feminine styling, bokeh flower background, soft natural lighting, gentle romantic expression',
      pM:'wearing a soft aesthetic cream and beige casual outfit, warm natural lighting, relaxed artistic portrait' },
    { id:'korean_style',    name:'Korean Style',     desc:'K-drama aesthetic',               emoji:'🇰🇷', grad:'linear-gradient(150deg,#1a0a2e,#0a0514)',
      pF:'wearing a stylish Korean fashion outfit, clean minimal aesthetic, soft dewy skin, effortless chic pose, Seoul street fashion vibes, natural soft studio lighting',
      pM:'wearing stylish Korean menswear, clean minimal aesthetic, Korean actor vibes, soft natural lighting, effortless cool pose' },
    { id:'vintage_retro',   name:'Vintage Retro',    desc:'Gaya era 60-70an',               emoji:'🎞️', grad:'linear-gradient(150deg,#2a1a00,#120c00)',
      pF:'wearing a retro vintage 1960s inspired outfit with polka dots or floral patterns, cat-eye makeup, vintage hairstyle, warm retro film photography aesthetic, fun playful expression',
      pM:'wearing a retro 1960s inspired outfit, vintage hairstyle, warm retro film photography aesthetic, cool vintage pose' },
    { id:'casual_urban',    name:'Urban Casual',     desc:'Street style kekinian',           emoji:'🏙️', grad:'linear-gradient(150deg,#0a0a0a,#050505)',
      pF:'wearing trendy urban casual streetwear outfit, modern city background with bokeh lights, confident youthful expression, natural street photography aesthetic',
      pM:'wearing cool urban streetwear, modern city backdrop, confident relaxed street style pose' },
    { id:'luxury_lifestyle', name:'Luxury Lifestyle', desc:'High-end mewah',                 emoji:'💰', grad:'linear-gradient(150deg,#1a1400,#0a0a00)',
      pF:'wearing an elegant luxury lifestyle outfit, posed in an opulent setting with marble and gold accents, confident wealthy aesthetic, sophisticated pose',
      pM:'wearing a premium luxury lifestyle outfit, posed with high-end lifestyle props, successful businessman aesthetic' },
  ],

  occasion: [
    { id:'wisuda',          name:'Wisuda',           desc:'Toga & momen kelulusan',          emoji:'🎓', grad:'linear-gradient(150deg,#0a2060,#050e28)',
      pF:'wearing an elegant graduation gown and cap in navy blue or black, holding a rolled diploma tied with red ribbon, proud confident smile, professional graduation portrait lighting',
      pM:'wearing graduation gown and cap, holding diploma, proud confident smile, professional graduation portrait' },
    { id:'lebaran',         name:'Lebaran Eid',      desc:'Busana Lebaran terbaik',          emoji:'🌙', grad:'linear-gradient(150deg,#1a3a00,#0a1a00)',
      pF:'wearing a beautiful Eid al-Fitr outfit in vibrant green or blue with gold embroidery kebaya, matching hijab, pearl jewelry, warm joyful Eid celebration expression, surrounded by ketupat and festive decorations',
      pM:'wearing a smart Eid outfit with batik shirt and sarong or baju koko, traditional kopiah, warm joyful Eid expression' },
    { id:'ultah_glamour',   name:'Ulang Tahun',      desc:'Birthday glamour look',           emoji:'🎂', grad:'linear-gradient(150deg,#3a0050,#180028)',
      pF:'wearing a glamorous birthday outfit in a shimmering sequin or satin dress, festive birthday party setting with balloons and confetti, joyful celebration expression, birthday crown or tiara',
      pM:'wearing a sharp birthday celebration outfit, festive party setting, confident happy birthday expression' },
    { id:'sweet17',         name:'Sweet 17',         desc:'Foto ulang tahun ke-17',         emoji:'🎀', grad:'linear-gradient(150deg,#3a0020,#180010)',
      pF:'wearing a beautiful sweet seventeen ball gown in pastel pink or lavender with delicate floral embellishments, princess-like tiara, magical sparkly backdrop, joyful youthful sweet expression',
      pM:'wearing a sharp formal suit for a sweet seventeen party, mature confident young man expression' },
    { id:'foto_keluarga',   name:'Foto Keluarga',    desc:'Portrait keluarga harmonis',      emoji:'👨‍👩‍👧‍👦', grad:'linear-gradient(150deg,#0a2a1a,#051008)',
      pF:'wearing a coordinated family outfit in complementary warm tones, warm natural family portrait lighting, loving joyful family expression, clean simple background',
      pM:'wearing a coordinated family portrait outfit, warm natural lighting, loving father expression, family portrait setting' },
    { id:'ramadan',         name:'Ramadan Kareem',   desc:'Busana Ramadan elegan',           emoji:'✨', grad:'linear-gradient(150deg,#1a2a00,#0a1400)',
      pF:'wearing an elegant Ramadan outfit in emerald green or deep teal with gold Islamic geometric embroidery, beautifully draped hijab, holding prayer beads, serene spiritual expression, mosque or Islamic architecture background',
      pM:'wearing elegant Ramadan baju koko in dark green with gold trim, traditional kopiah, holding prayer beads, serene spiritual expression' },
    { id:'idul_adha',       name:'Idul Adha',        desc:'Busana Idul Adha resmi',          emoji:'🐑', grad:'linear-gradient(150deg,#2a1a00,#100800)',
      pF:'wearing a formal Idul Adha outfit in cream and gold batik pattern kebaya, matching hijab, traditional jewelry, warm celebration expression',
      pM:'wearing formal Idul Adha outfit with batik shirt and sarong, traditional kopiah, dignified celebration expression' },
    { id:'17_agustus',      name:'17 Agustus',       desc:'Kemerdekaan Indonesia',           emoji:'🇮🇩', grad:'linear-gradient(150deg,#3a0000,#180000)',
      pF:'wearing a beautiful Indonesian Independence Day outfit in red and white combination, traditional kebaya or modern red dress, Indonesian flag accessories, proud patriotic joyful expression',
      pM:'wearing a smart Indonesian Independence Day outfit in red and white, Indonesian traditional hat or modern look, proud patriotic expression' },
  ],
}

const BACKGROUNDS = [
  { id:'studio_red',  label:'Studio Merah',    prompt:'deep saturated crimson red photography studio backdrop, dramatic professional studio lighting with strong side fill light, high contrast cinematic atmosphere' },
  { id:'palace',      label:'Istana Kuno',     prompt:'imperial Chinese palace interior with towering red lacquered pillars, golden carved ornaments, latticed windows, hanging red silk lanterns' },
  { id:'garden',      label:'Taman Pavilion',  prompt:'classical Chinese garden with traditional wooden pavilion, willow trees, koi pond with lotus flowers, natural soft bokeh sunlight' },
  { id:'plum',        label:'Bunga Plum',      prompt:'winter plum blossom branches with pink and white flowers, soft misty romantic atmosphere, Chinese painting aesthetic' },
  { id:'gold_silk',   label:'Kain Emas',       prompt:'luxurious golden silk backdrop with embossed dragon cloud patterns, warm opulent golden hour lighting, wealthy imperial aesthetic' },
  { id:'ink_mist',    label:'Kabut Tinta',     prompt:'traditional Chinese ink wash landscape, misty mountain silhouettes, sparse bamboo, poetic ancient atmosphere' },
  { id:'ballroom',    label:'Ballroom Mewah',  prompt:'grand luxurious ballroom with crystal chandeliers, white marble floor, golden pillars, warm elegant wedding reception lighting' },
  { id:'beach_sunset',label:'Pantai Sunset',   prompt:'pristine tropical beach at golden sunset, warm orange and pink sky, gentle waves, soft bokeh palm trees, romantic natural lighting' },
  { id:'garden_rose', label:'Taman Mawar',     prompt:'beautiful romantic rose garden in full bloom with pink and white roses, soft bokeh sunlight through leaves, dreamy romantic atmosphere' },
  { id:'mosque',      label:'Masjid Indah',    prompt:'beautiful ornate mosque architecture background with Islamic geometric patterns, golden domes, soft warm spiritual lighting' },
  { id:'studio_white',label:'Studio Putih',    prompt:'clean pure white seamless photography studio backdrop, soft professional diffused lighting, minimal clean aesthetic' },
  { id:'city_night',  label:'Kota Malam',      prompt:'modern city skyline at night with bokeh lights, urban night photography aesthetic, warm golden city lights backdrop' },
]

const ACCESSORIES = [
  { id:'hijab',    label:'Hijab Elegan',  pF:'head covered with an elegant matching colored silk hijab with subtle embroidery on edges, clean layered structured draping fully covering hair and neck, modest yet luxurious' },
  { id:'fan',      label:'Kipas Renda',   p: 'holding an ornate red lace folding fan decorated with gold tassels, gracefully opened' },
  { id:'umbrella', label:'Payung Kertas', p: 'holding a delicate traditional Chinese oil paper umbrella with black ink floral patterns, tilted over shoulder' },
  { id:'lantern',  label:'Lampion Merah', p: 'holding a glowing traditional red silk lantern casting warm festive light' },
  { id:'flowers',  label:'Buket Bunga',   p: 'holding a beautiful lush bouquet of fresh peonies, roses and baby breath flowers' },
  { id:'hairpin',  label:'Hiasan Rambut', pF:'hair adorned with elaborate golden ornaments, jade pendants, pearl dangles and floral accessories' },
  { id:'veil',     label:'Kerudung Pengantin', pF:'wearing a delicate white bridal veil with lace trim flowing elegantly behind' },
  { id:'crown',    label:'Mahkota/Tiara', pF:'wearing a sparkling crystal bridal tiara or ornate golden crown on head' },
]

const THEMES = {
  dark: {
    bg:'#0D0500', bg2:'#1A0A00', card:'rgba(255,255,255,0.04)',
    border:'rgba(201,168,76,0.18)', borderHi:'rgba(201,168,76,0.55)',
    text:'#FDF6E3', muted:'rgba(232,213,163,0.45)',
    accent:'#C9A84C', nav:'rgba(8,3,0,0.95)', navBorder:'rgba(201,168,76,0.18)',
    input:'rgba(255,255,255,0.04)', chipActive:'rgba(139,0,0,0.2)',
    grad:'radial-gradient(ellipse 130% 55% at 50% -5%, rgba(139,0,0,0.45) 0%, transparent 55%), linear-gradient(180deg,#0D0500 0%,#1a0a00 50%,#0D0500 100%)',
  },
  light: {
    bg:'#FDF6E3', bg2:'#F5E6C8', card:'rgba(139,0,0,0.04)',
    border:'rgba(139,0,0,0.15)', borderHi:'rgba(139,0,0,0.4)',
    text:'#2D0A00', muted:'rgba(92,0,0,0.45)',
    accent:'#8B0000', nav:'rgba(253,246,227,0.97)', navBorder:'rgba(139,0,0,0.12)',
    input:'rgba(139,0,0,0.04)', chipActive:'rgba(139,0,0,0.08)',
    grad:'radial-gradient(ellipse 130% 55% at 50% -5%, rgba(201,168,76,0.2) 0%, transparent 55%), linear-gradient(180deg,#FDF6E3 0%,#F5E6C8 50%,#FDF6E3 100%)',
  }
}

// ═══════════════════════════════════════════════════
// BUILD PROMPT
// ═══════════════════════════════════════════════════
const buildPrompt = (categoryId, styleId, gender, accessories, bgId, custom) => {
  const templates = TEMPLATES[categoryId] || TEMPLATES.china
  const s = templates.find(x => x.id === styleId)
  const isFemale = gender === 'female'
  const bgPrompt = BACKGROUNDS.find(x => x.id === bgId)?.prompt || BACKGROUNDS[0].prompt

  let subject = s
    ? (isFemale ? s.pF : s.pM)
    : (isFemale ? 'wearing traditional Chinese cheongsam in deep red silk with gold embroidery' : 'wearing traditional Chinese Tang suit in dark red with gold patterns')

  const hijab = accessories.has('hijab')
  if (hijab && isFemale) subject += '. ' + ACCESSORIES.find(x => x.id==='hijab').pF
  accessories.forEach(id => {
    if (id === 'hijab') return
    if (id === 'hairpin' && hijab) return
    if (id === 'veil' && hijab) return
    const a = ACCESSORIES.find(x => x.id === id)
    if (a) subject += '. ' + ((isFemale && a.pF) ? a.pF : a.p)
  })

  const faceRef = 'IMPORTANT: Use the uploaded photo STRICTLY as facial reference. Preserve exact face, skin tone, age, identity — do NOT alter the face at all. Only change clothes, styling and background'
  const quality = 'ultra high resolution 8K, professional photography, sharp focus, perfect exposure, cinematic lighting, bokeh background, photorealistic, magazine quality'
  return `${faceRef}. Create a stunning portrait: ${subject}. Background: ${bgPrompt}. ${quality}.${custom ? ' ' + custom : ''}`
}

// ═══════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════
export default function Page() {
  const [themeKey, setThemeKey] = useState('dark')
  const T = THEMES[themeKey]
  const isDark = themeKey === 'dark'

  const [photoB64, setPhotoB64] = useState(null)
  const [photoMime, setPhotoMime] = useState('image/jpeg')
  const [photoThumb, setPhotoThumb] = useState(null)

  const [category, setCategory] = useState('china')
  const [style, setStyle] = useState(null)
  const [gender, setGender] = useState('female')
  const [accessories, setAccessories] = useState(new Set())
  const [bg, setBg] = useState('studio_red')
  const [customText, setCustomText] = useState('')
  const [aspectRatio, setAspectRatio] = useState('2:3')

  const [phase, setPhase] = useState('idle')
  const [status, setStatus] = useState('')
  const [progress, setProg] = useState(0)
  const [resultUrl, setResultUrl] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [gallery, setGallery] = useState([])
  const [tab, setTab] = useState('buat')
  const [toasts, setToasts] = useState([])
  const [galleryOpen, setGalleryOpen] = useState(null)

  const fileRef = useRef(null)
  const cancelRef = useRef(false)
  const pollRef = useRef(null)

  // Reset style when category changes
  useEffect(() => { setStyle(null) }, [category])

  useEffect(() => {
    const saved = localStorage.getItem('sf_theme')
    if (saved) setThemeKey(saved)
    try { setGallery(JSON.parse(localStorage.getItem('sf_gallery') || '[]')) } catch {}
  }, [])
  useEffect(() => { localStorage.setItem('sf_gallery', JSON.stringify(gallery.slice(0,40))) }, [gallery])

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark'
    setThemeKey(next)
    localStorage.setItem('sf_theme', next)
  }

  const toast = useCallback((msg, type='info') => {
    const id = Date.now()
    setToasts(p => [...p, {id, msg, type}])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }, [])

  const handleFile = useCallback(file => {
    if (!file?.type.match(/^image\/(jpeg|png|webp)$/)) { toast('Gunakan format JPG, PNG, atau WEBP', 'error'); return }
    if (file.size > 10*1024*1024) { toast('Ukuran foto maksimal 10MB', 'error'); return }
    setPhotoMime(file.type)
    setPhotoThumb(URL.createObjectURL(file))
    const reader = new FileReader()
    reader.onload = e => { setPhotoB64(e.target.result); toast('Foto berhasil dipilih! ✓', 'success') }
    reader.readAsDataURL(file)
  }, [toast])

  const toggleAcc = useCallback(id => {
    setAccessories(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }, [])

  const generate = useCallback(async () => {
    if (!photoB64) { toast('Upload foto kamu dulu ya!', 'error'); return }
    if (!style)   { toast('Pilih salah satu template dulu', 'error'); return }

    cancelRef.current = false
    setPhase('uploading'); setStatus('Mengunggah foto...'); setProg(10)

    try {
      const upRes = await fetch('/api/proxy', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ action:'upload', base64Data: photoB64, mimeType: photoMime })
      }).then(r => r.json())

      if (!upRes.ok) throw new Error(upRes.error || 'Upload foto gagal')
      if (cancelRef.current) return

      setProg(30); setPhase('generating'); setStatus('Mengirim ke AI...')

      const prompt = buildPrompt(category, style, gender, accessories, bg, customText.trim())
      const genRes = await fetch('/api/proxy', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ action:'generate', prompt, fileUrl: upRes.fileUrl, aspectRatio })
      }).then(r => r.json())

      if (!genRes.ok) throw new Error(genRes.error || 'Gagal membuat task AI')
      if (cancelRef.current) return

      const taskId = genRes.taskId
      setProg(45); setPhase('polling')

      const msgs = [
        'AI sedang memakaikan kostum...','Menata rambut dan aksesori...',
        'Menyiapkan latar belakang...','Mengatur pencahayaan...','Hampir selesai...'
      ]
      let attempt = 0

      await new Promise((resolve, reject) => {
        pollRef.current = setInterval(async () => {
          if (cancelRef.current) { clearInterval(pollRef.current); reject(new Error('cancel')); return }
          attempt++
          if (attempt > 100) { clearInterval(pollRef.current); reject(new Error('Proses terlalu lama, coba lagi')); return }
          setStatus(msgs[Math.min(Math.floor(attempt/20), msgs.length-1)])
          setProg(Math.min(45 + attempt*0.5, 92))
          try {
            const pollRes = await fetch('/api/proxy', {
              method:'POST', headers:{'Content-Type':'application/json'},
              body: JSON.stringify({ action:'poll', taskId })
            }).then(r => r.json())
            if (!pollRes.ok) return
            const { state, resultUrl: url, failMsg } = pollRes
            if (state === 'success') {
              clearInterval(pollRef.current)
              if (!url) { reject(new Error('Tidak ada gambar dihasilkan')); return }
              setProg(100); setStatus('Selesai! ✨')
              const templates = TEMPLATES[category] || TEMPLATES.china
              const s = templates.find(x => x.id === style)
              setGallery(prev => [{id:taskId, url, label:s?.name||'Foto', date:new Date().toISOString()}, ...prev])
              setTimeout(() => { setPhase('done'); setResultUrl(url); setShowResult(true) }, 600)
              resolve()
            } else if (state === 'fail') {
              clearInterval(pollRef.current)
              reject(new Error(failMsg || 'AI gagal, coba lagi'))
            }
          } catch { /* retry */ }
        }, 2000)
      })
    } catch (err) {
      if (pollRef.current) clearInterval(pollRef.current)
      if (err.message === 'cancel') return
      setPhase('error'); toast(err.message, 'error')
      setTimeout(() => setPhase('idle'), 100)
    }
  }, [photoB64, photoMime, category, style, gender, accessories, bg, customText, aspectRatio, toast])

  const cancel = useCallback(() => {
    cancelRef.current = true
    if (pollRef.current) clearInterval(pollRef.current)
    setPhase('idle'); toast('Dibatalkan')
  }, [toast])

  const download = useCallback(async url => {
    try { const a=document.createElement('a'); a.href=url; a.download=`studio-foto-${Date.now()}.jpg`; a.target='_blank'; a.click(); toast('Disimpan! ✓','success') } catch { window.open(url,'_blank') }
  }, [toast])

  const sharePhoto = useCallback(async url => {
    try { if(navigator.share) await navigator.share({title:'Studio Foto',text:'Lihat foto ku! 📸',url}); else {await navigator.clipboard.writeText(url); toast('Link disalin! ✓','success')} } catch {}
  }, [toast])

  const busy = ['uploading','generating','polling'].includes(phase)

  const Sec = ({label}) => (
    <div style={{display:'flex',alignItems:'center',gap:10,margin:'16px 0 12px'}}>
      <div style={{flex:1,height:1,background:`linear-gradient(90deg,rgba(139,0,0,0.5),transparent)`}}/>
      <span style={{fontSize:11,fontWeight:700,color:T.accent,letterSpacing:3,whiteSpace:'nowrap',textTransform:'uppercase'}}>{label}</span>
      <div style={{flex:1,height:1,background:`linear-gradient(270deg,rgba(139,0,0,0.5),transparent)`}}/>
    </div>
  )

  const Chip = ({active, onClick, children}) => (
    <button onClick={onClick} style={{padding:'7px 14px',borderRadius:50,cursor:'pointer',fontSize:12,fontWeight:500,border:`1px solid ${active?'rgba(139,0,0,0.6)':T.border}`,background:active?'rgba(139,0,0,0.1)':'transparent',color:active?T.accent:T.muted,transition:'0.2s ease',whiteSpace:'nowrap'}}>{children}</button>
  )

  const currentTemplates = TEMPLATES[category] || TEMPLATES.china

  return (
    <>
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',background:T.grad,transition:'background 0.4s ease'}}/>

      {/* TOASTS */}
      <div style={{position:'fixed',top:16,left:'50%',transform:'translateX(-50%)',zIndex:999,display:'flex',flexDirection:'column',gap:8,alignItems:'center',pointerEvents:'none'}}>
        {toasts.map(t => (
          <div key={t.id} style={{padding:'10px 20px',borderRadius:50,whiteSpace:'nowrap',background:T.nav,backdropFilter:'blur(12px)',border:`1px solid ${t.type==='error'?'rgba(192,57,43,.5)':t.type==='success'?'rgba(46,120,79,.5)':T.border}`,color:t.type==='error'?'#cc3300':t.type==='success'?'#1a7a40':T.text,fontSize:13,fontWeight:500,boxShadow:'0 4px 20px rgba(0,0,0,0.12)'}}>{t.msg}</div>
        ))}
      </div>

      {/* LOADING */}
      {busy && (
        <div style={{position:'fixed',inset:0,zIndex:200,background:isDark?'rgba(8,3,0,.96)':'rgba(253,246,227,.96)',backdropFilter:'blur(16px)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:24,textAlign:'center',padding:24}}>
          <div style={{animation:'float 2.8s ease-in-out infinite'}}>
            <div style={{width:20,height:7,background:'#C9A84C',borderRadius:4,margin:'0 auto 3px'}}/>
            <div style={{width:68,height:86,background:'linear-gradient(180deg,#8B0000,#5C0000)',borderRadius:'50% 50% 40% 40% / 55% 55% 45% 45%',border:'2px solid rgba(201,168,76,.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:34,boxShadow:'0 0 40px rgba(139,0,0,.6)'}}>福</div>
            <div style={{width:2,height:18,background:'#C9A84C',margin:'3px auto 0'}}/>
          </div>
          <div>
            <div style={{fontSize:17,fontWeight:700,color:'#8B0000',marginBottom:8}}>{status}</div>
            <div style={{fontSize:13,color:T.muted}}>AI sedang berkreasi untuk kamu 🎨</div>
          </div>
          <div style={{width:220,height:3,background:isDark?'rgba(201,168,76,.12)':'rgba(139,0,0,.1)',borderRadius:2,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${progress}%`,transition:'width .6s ease',background:'linear-gradient(90deg,#8B0000,#C9A84C)',borderRadius:2}}/>
          </div>
          <button onClick={cancel} style={{padding:'10px 28px',borderRadius:50,border:`1px solid ${T.border}`,background:'transparent',color:T.muted,fontSize:13,cursor:'pointer'}}>✕ Batalkan</button>
        </div>
      )}

      {/* RESULT */}
      {showResult && resultUrl && (
        <div style={{position:'fixed',inset:0,zIndex:150,background:T.bg,display:'flex',flexDirection:'column'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 18px',borderBottom:`1px solid ${T.border}`}}>
            <div style={{fontSize:15,fontWeight:700,color:'#8B0000'}}>✨ Foto Selesai!</div>
            <button onClick={()=>setShowResult(false)} style={{width:36,height:36,borderRadius:'50%',border:`1px solid ${T.border}`,background:'transparent',color:T.text,fontSize:20,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>×</button>
          </div>
          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:16,overflow:'hidden'}}>
            <img src={resultUrl} alt="Hasil" style={{maxWidth:'100%',maxHeight:'100%',objectFit:'contain',borderRadius:12,boxShadow:'0 24px 60px rgba(0,0,0,.25)'}}/>
          </div>
          <div style={{display:'flex',gap:10,padding:'14px 18px',borderTop:`1px solid ${T.border}`}}>
            <button onClick={()=>download(resultUrl)} style={{flex:1,padding:13,borderRadius:12,background:'linear-gradient(135deg,#8B0000,#5C0000)',border:'none',color:'#E8D5A3',fontSize:13,fontWeight:700,cursor:'pointer',boxShadow:'0 4px 18px rgba(139,0,0,.35)'}}>⬇ Simpan</button>
            <button onClick={()=>sharePhoto(resultUrl)} style={{flex:1,padding:13,borderRadius:12,background:'transparent',border:`1.5px solid ${T.border}`,color:T.accent,fontSize:13,fontWeight:600,cursor:'pointer'}}>↗ Bagikan</button>
            <button onClick={()=>{setShowResult(false);generate()}} style={{flex:1,padding:13,borderRadius:12,background:'transparent',border:`1.5px solid ${T.border}`,color:T.muted,fontSize:13,cursor:'pointer'}}>↺ Ulang</button>
          </div>
        </div>
      )}

      {/* GALLERY ITEM */}
      {galleryOpen && (
        <div style={{position:'fixed',inset:0,zIndex:150,background:isDark?'rgba(0,0,0,.96)':'rgba(253,246,227,.96)',display:'flex',flexDirection:'column'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 18px',borderBottom:`1px solid ${T.border}`}}>
            <div style={{fontSize:13,fontWeight:600,color:'#8B0000'}}>{galleryOpen.label}</div>
            <button onClick={()=>setGalleryOpen(null)} style={{width:36,height:36,borderRadius:'50%',border:`1px solid ${T.border}`,background:'transparent',color:T.text,fontSize:20,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>×</button>
          </div>
          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
            <img src={galleryOpen.url} alt={galleryOpen.label} style={{maxWidth:'100%',maxHeight:'100%',objectFit:'contain',borderRadius:12}}/>
          </div>
          <div style={{display:'flex',gap:10,padding:'14px 18px',borderTop:`1px solid ${T.border}`}}>
            <button onClick={()=>download(galleryOpen.url)} style={{flex:1,padding:13,borderRadius:12,background:'linear-gradient(135deg,#8B0000,#5C0000)',border:'none',color:'#E8D5A3',fontSize:13,fontWeight:700,cursor:'pointer'}}>⬇ Simpan</button>
            <button onClick={()=>sharePhoto(galleryOpen.url)} style={{flex:1,padding:13,borderRadius:12,background:'transparent',border:`1.5px solid ${T.border}`,color:T.accent,fontSize:13,fontWeight:600,cursor:'pointer'}}>↗ Bagikan</button>
            <button onClick={()=>{setGallery(p=>p.filter(g=>g.id!==galleryOpen.id));setGalleryOpen(null);toast('Dihapus')}} style={{flex:1,padding:13,borderRadius:12,background:'transparent',border:'1.5px solid rgba(192,57,43,.35)',color:'rgba(192,57,43,.8)',fontSize:13,cursor:'pointer'}}>🗑 Hapus</button>
          </div>
        </div>
      )}

      {/* MAIN */}
      <div style={{position:'relative',zIndex:1,maxWidth:480,margin:'0 auto',minHeight:'100dvh',display:'flex',flexDirection:'column'}}>

        {/* Header */}
        <header style={{padding:'18px 18px 0',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontSize:24,fontWeight:800,color:'#8B0000',letterSpacing:-0.5,lineHeight:1.1}}>Studio Foto</div>
            <div style={{fontSize:11,color:T.muted,letterSpacing:2,textTransform:'uppercase',marginTop:2}}>AI · Powered by kie.ai</div>
          </div>
          <button onClick={toggleTheme} style={{width:48,height:28,borderRadius:14,border:`1.5px solid ${T.border}`,background:isDark?'rgba(139,0,0,0.25)':'rgba(201,168,76,0.15)',cursor:'pointer',position:'relative',transition:'0.3s ease',flexShrink:0}}>
            <div style={{position:'absolute',top:3,width:20,height:20,borderRadius:'50%',background:isDark?'#C9A84C':'#8B0000',left:isDark?3:'calc(100% - 23px)',transition:'left 0.3s ease',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11}}>{isDark?'🌙':'☀️'}</div>
          </button>
        </header>
        <div style={{padding:'4px 18px 10px',fontSize:13,color:T.muted}}>Ubah fotomu jadi foto keren dengan AI ✨</div>

        {/* TAB BUAT */}
        {tab === 'buat' && (
          <div style={{flex:1,padding:'0 16px 110px'}}>

            {/* Upload */}
            <Sec label="Upload Foto Kamu"/>
            <div onClick={()=>fileRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();handleFile(e.dataTransfer.files[0])}}
              style={{border:`1.5px dashed ${photoThumb?T.border:'rgba(139,0,0,0.4)'}`,borderRadius:16,padding:photoThumb?12:'24px 16px',textAlign:'center',cursor:'pointer',background:T.card,transition:'0.2s ease',marginBottom:4}}>
              {photoThumb ? (
                <div style={{position:'relative',maxWidth:150,margin:'0 auto'}}>
                  <img src={photoThumb} alt="Preview" style={{width:'100%',aspectRatio:'3/4',objectFit:'cover',borderRadius:10,display:'block'}}/>
                  <div style={{position:'absolute',inset:0,borderRadius:10,background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:4,opacity:0,transition:'0.2s'}} onMouseEnter={e=>e.currentTarget.style.opacity='1'} onMouseLeave={e=>e.currentTarget.style.opacity='0'}>
                    <span style={{fontSize:22}}>🔄</span><span style={{fontSize:12,color:'#fff',fontWeight:500}}>Ganti Foto</span>
                  </div>
                </div>
              ) : (<><div style={{fontSize:36,marginBottom:8}}>📸</div><div style={{fontWeight:700,fontSize:14,color:T.text,marginBottom:4}}>Ketuk untuk pilih foto</div><div style={{fontSize:12,color:T.muted}}>JPG, PNG, WEBP · Maks 10MB</div></>)}
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>handleFile(e.target.files?.[0])} style={{display:'none'}}/>
            <div style={{fontSize:11,color:T.muted,textAlign:'center',marginBottom:2}}>💡 Foto wajah jelas = hasil terbaik</div>

            {/* Gender */}
            <Sec label="Gender"/>
            <div style={{display:'flex',gap:8,marginBottom:4}}>
              {[['female','👸 Perempuan'],['male','🤴 Laki-laki']].map(([g,lbl]) => (
                <button key={g} onClick={()=>setGender(g)} style={{flex:1,padding:11,borderRadius:10,border:`1.5px solid ${gender===g?'rgba(139,0,0,0.6)':T.border}`,background:gender===g?'rgba(139,0,0,0.1)':'transparent',color:gender===g?T.accent:T.muted,fontSize:13,fontWeight:600,cursor:'pointer',transition:'0.2s ease'}}>{lbl}</button>
              ))}
            </div>

            {/* Category tabs */}
            <Sec label="Pilih Kategori"/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:4}}>
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={()=>setCategory(c.id)} style={{padding:'10px 12px',borderRadius:12,border:`1.5px solid ${category===c.id?'rgba(139,0,0,0.6)':T.border}`,background:category===c.id?'rgba(139,0,0,0.1)':T.card,cursor:'pointer',textAlign:'left',transition:'0.2s ease'}}>
                  <div style={{fontSize:13,fontWeight:700,color:category===c.id?T.accent:T.text}}>{c.label}</div>
                  <div style={{fontSize:10,color:T.muted,marginTop:2}}>{c.desc}</div>
                </button>
              ))}
            </div>

            {/* Template grid */}
            <Sec label="Pilih Template"/>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:4}}>
              {currentTemplates.map(s => (
                <button key={s.id} onClick={()=>setStyle(style===s.id?null:s.id)} style={{borderRadius:12,overflow:'hidden',aspectRatio:'2/3',position:'relative',border:`2px solid ${style===s.id?'#C9A84C':'transparent'}`,boxShadow:style===s.id?'0 0 16px rgba(201,168,76,.4)':'none',transform:style===s.id?'scale(1.04)':'scale(1)',transition:'0.2s ease',cursor:'pointer',background:s.grad}}>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%'}}>
                    <div style={{fontSize:24,filter:'drop-shadow(0 2px 6px rgba(0,0,0,.6))'}}>{s.emoji}</div>
                  </div>
                  <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'14px 4px 5px',background:'linear-gradient(transparent,rgba(0,0,0,.88))',fontSize:8,textAlign:'center',color:'rgba(232,213,163,.9)',lineHeight:1.4}}>
                    <div style={{fontWeight:700,fontSize:9}}>{s.name}</div>
                    <div style={{opacity:.65}}>{s.desc}</div>
                  </div>
                  {style===s.id && <div style={{position:'absolute',top:4,right:4,width:17,height:17,background:'#C9A84C',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:'#0D0500',fontWeight:700}}>✓</div>}
                </button>
              ))}
            </div>

            {/* Accessories */}
            <Sec label="Aksesori"/>
            <div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:4}}>
              {ACCESSORIES.filter(a=>!(a.id==='hairpin'&&gender==='male')&&!(a.id==='veil'&&gender==='male')&&!(a.id==='crown'&&gender==='male')).map(a=>(
                <Chip key={a.id} active={accessories.has(a.id)} onClick={()=>toggleAcc(a.id)}>{a.label}</Chip>
              ))}
            </div>

            {/* Background */}
            <Sec label="Latar Belakang"/>
            <div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:4}}>
              {BACKGROUNDS.map(b=><Chip key={b.id} active={bg===b.id} onClick={()=>setBg(b.id)}>{b.label}</Chip>)}
            </div>

            {/* Aspect ratio */}
            <Sec label="Format Foto"/>
            <div style={{display:'flex',gap:8,marginBottom:4}}>
              {[['2:3','Portrait'],['1:1','Square'],['3:4','Potret']].map(([v,lbl])=>(
                <button key={v} onClick={()=>setAspectRatio(v)} style={{flex:1,padding:'9px 4px',borderRadius:10,border:`1.5px solid ${aspectRatio===v?'rgba(139,0,0,0.6)':T.border}`,background:aspectRatio===v?'rgba(139,0,0,0.1)':T.input,color:aspectRatio===v?T.accent:T.muted,fontSize:11,fontWeight:500,cursor:'pointer',transition:'0.2s ease',textAlign:'center'}}>
                  <div style={{fontWeight:700}}>{v}</div><div style={{fontSize:10,opacity:.7}}>{lbl}</div>
                </button>
              ))}
            </div>

            {/* Custom */}
            <Sec label="Detail Tambahan (opsional)"/>
            <textarea value={customText} onChange={e=>setCustomText(e.target.value)} placeholder="Misal: senyum manis, pose duduk anggun, rambut terurai panjang..."
              style={{width:'100%',minHeight:68,padding:'12px 14px',borderRadius:12,background:T.input,border:`1px solid ${T.border}`,color:T.text,fontSize:13,resize:'none',outline:'none',lineHeight:1.6,marginBottom:20,fontFamily:'inherit'}}/>

            {/* Generate */}
            <button onClick={generate} disabled={busy} style={{width:'100%',padding:'17px 16px',borderRadius:50,border:'none',background:busy?'rgba(139,0,0,.3)':'linear-gradient(135deg,#8B0000,#5C0000)',color:'#E8D5A3',fontSize:15,fontWeight:700,letterSpacing:2,boxShadow:busy?'none':'0 4px 28px rgba(139,0,0,.4)',cursor:busy?'not-allowed':'pointer',transition:'0.2s ease'}}>
              {busy
                ? <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}><span style={{display:'inline-block',width:16,height:16,border:'2px solid rgba(232,213,163,.3)',borderTop:'2px solid #E8D5A3',borderRadius:'50%',animation:'spin .8s linear infinite'}}/>Sedang Diproses...</span>
                : '✨ Buat Foto Sekarang'}
            </button>
          </div>
        )}

        {/* TAB GALERI */}
        {tab === 'galeri' && (
          <div style={{flex:1,padding:'0 16px 110px'}}>
            <Sec label="Galeri Foto Kamu"/>
            {gallery.length===0 ? (
              <div style={{textAlign:'center',padding:'60px 20px'}}>
                <div style={{fontSize:52,marginBottom:14}}>🏮</div>
                <div style={{fontSize:14,color:T.muted,lineHeight:1.8}}>Belum ada foto.<br/>Buat foto pertamamu!</div>
              </div>
            ) : (
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>
                {gallery.map(item=>(
                  <div key={item.id} onClick={()=>setGalleryOpen(item)} style={{borderRadius:12,overflow:'hidden',aspectRatio:'2/3',position:'relative',cursor:'pointer',border:`1px solid ${T.border}`,background:T.bg2,transition:'0.2s ease'}}>
                    <img src={item.url} alt={item.label} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
                    <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'20px 10px 8px',background:'linear-gradient(transparent,rgba(0,0,0,.8))',fontSize:10,color:'#E8D5A3',fontWeight:500}}>{item.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB INFO */}
        {tab === 'info' && (
          <div style={{flex:1,padding:'0 16px 110px'}}>
            <Sec label="Tentang Studio Foto"/>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:20,marginBottom:12,textAlign:'center'}}>
              <div style={{fontSize:32,marginBottom:8}}>📸</div>
              <div style={{fontSize:20,fontWeight:800,color:'#8B0000',marginBottom:6}}>Studio Foto AI</div>
              <div style={{fontSize:13,color:T.muted,lineHeight:1.8}}>
                {CATEGORIES.length} Kategori · {Object.values(TEMPLATES).flat().length} Template<br/>
                Powered by kie.ai · GPT Image 2<br/>
                <span style={{fontSize:11}}>Untuk pasar Indonesia 🇮🇩</span>
              </div>
            </div>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:16,marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:'#8B0000',letterSpacing:2,textTransform:'uppercase',marginBottom:12}}>Cara Pakai</div>
              {[['1','Upload foto wajah yang jelas'],['2','Pilih kategori & template yang kamu mau'],['3','Atur aksesori dan latar belakang'],['4','Klik "Buat Foto Sekarang"'],['5','Tunggu ~30 detik, foto siap!']].map(([n,t])=>(
                <div key={n} style={{display:'flex',gap:12,alignItems:'flex-start',marginBottom:10}}>
                  <div style={{width:24,height:24,borderRadius:'50%',background:'linear-gradient(135deg,#8B0000,#5C0000)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#E8D5A3',fontWeight:700,flexShrink:0}}>{n}</div>
                  <div style={{fontSize:13,color:T.text,paddingTop:3}}>{t}</div>
                </div>
              ))}
            </div>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:16,marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:'#8B0000',letterSpacing:2,textTransform:'uppercase',marginBottom:12}}>Tips Hasil Terbaik</div>
              {['Foto wajah close-up & pencahayaan terang','Ekspresi netral atau senyum tipis','Hindari sunglasses, masker, atau topi','Foto portrait (vertikal) lebih bagus','Resolusi minimal 600×600 piksel'].map(t=>(
                <div key={t} style={{fontSize:13,color:T.text,marginBottom:8,display:'flex',gap:8}}><span style={{color:'#8B0000'}}>✦</span>{t}</div>
              ))}
            </div>
            {gallery.length>0&&(
              <button onClick={()=>{if(confirm(`Hapus semua ${gallery.length} foto?`)){setGallery([]);toast('Galeri dikosongkan')}}} style={{width:'100%',padding:13,borderRadius:12,background:'transparent',border:'1px solid rgba(192,57,43,.3)',color:'rgba(192,57,43,.75)',fontSize:13,cursor:'pointer'}}>🗑 Kosongkan Galeri ({gallery.length} foto)</button>
            )}
          </div>
        )}

        {/* BOTTOM NAV */}
        <nav style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:480,background:T.nav,backdropFilter:'blur(20px)',borderTop:`1px solid ${T.navBorder}`,display:'flex',zIndex:100,paddingBottom:'env(safe-area-inset-bottom,0)'}}>
          {[['buat','📸','Buat Foto'],['galeri','🖼️','Galeri'],['info','ℹ️','Info']].map(([t,icon,lbl])=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3,padding:'10px 8px 12px',border:'none',background:'transparent',color:tab===t?'#8B0000':T.muted,fontSize:10,fontWeight:600,transition:'0.2s ease',position:'relative',cursor:'pointer'}}>
              {tab===t&&<div style={{position:'absolute',top:0,left:'20%',right:'20%',height:2,background:'linear-gradient(90deg,transparent,#8B0000,transparent)',borderRadius:'0 0 2px 2px'}}/>}
              <span style={{fontSize:20,lineHeight:1}}>{icon}</span>
              <span>{lbl}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  )
}
