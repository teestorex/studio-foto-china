import './globals.css'

export const metadata = {
  title: 'Studio Foto China AI — Ubah Fotomu Jadi Cantik Bergaya Tiongkok',
  description: 'Transformasikan foto kamu menjadi foto bergaya China klasik yang viral menggunakan AI. Cheongsam, Hanfu, Dinasti, dan banyak lagi.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#8B0000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/icons/favicon.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
