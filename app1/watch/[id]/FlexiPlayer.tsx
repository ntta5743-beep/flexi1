'use client'

import { useState } from 'react'

interface FlexiPlayerProps {
  title: string
  posterUrl: string
  subtitleUrl?: string
}

export default function FlexiPlayer({ title, posterUrl, subtitleUrl }: FlexiPlayerProps) {
  // مصادر جودات الفيديو المتعددة
  const qualities = [
    { label: '1080p (FHD)', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { label: '720p (HD)', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    { label: '480p (SD)', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    { label: '360p (ضعيف)', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' }
  ]

  const [currentQuality, setCurrentQuality] = useState(qualities[0])

  return (
    <div className="space-y-3">
      {/* حاوية المشغل الرئيسي */}
      <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
        
        {/* ✨ العلامة المائية: فليكسي (وسط أسفل الشاشة - غير مزعجة) ✨ */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none opacity-40 group-hover:opacity-75 transition-opacity duration-300">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-1 rounded-full border border-white/10 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span className="text-white font-black text-xs tracking-widest uppercase">
              فليكسي <span className="text-[10px] text-red-500">FLEXI</span>
            </span>
          </div>
        </div>

        {/* فيديو العرض */}
        <video
          key={currentQuality.src}
          controls
          autoPlay
          className="w-full h-full object-contain"
          poster={posterUrl}
        >
          <source src={currentQuality.src} type="video/mp4" />
          {subtitleUrl && (
            <track
              kind="subtitles"
              src={subtitleUrl}
              srcLang="ar"
              label="العربية"
              default
            />
          )}
          متصفحك لا يدعم تشغيل الفيديو.
        </video>
      </div>

      {/* شريط اختيار الجودة لضمان مشاهدة سلسة بدون تقطيع */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#181818] p-4 rounded-xl border border-white/5">
        <span className="text-sm font-bold text-gray-300 flex items-center gap-2">
          <span>⚙️</span> جودة البث المباشر:
        </span>
        <div className="flex flex-wrap gap-2">
          {qualities.map((q) => (
            <button
              key={q.label}
              onClick={() => setCurrentQuality(q)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                currentQuality.label === q.label
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}