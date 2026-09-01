'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Movie {
  id: string | number
  title: string
  year?: string | number
  rating?: string | number
  poster_url?: string
  plot?: string
  genre?: string
  imdb_id?: string
  type?: string
  watermark?: string
  cast?: string
}

const CATEGORIES = [
  { label: 'الكل', value: 'all' },
  { label: 'أفلام', value: 'movie' },
  { label: 'مسلسلات', value: 'series' },
  { label: 'الأعلى تقييماً', value: 'top' },
]

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState('all')
  const [sortBy, setSortBy] = useState('latest')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .order('id', { ascending: false })
          .range(0, 999)

        if (error) {
          console.error('خطأ في جلب البيانات:', error.message)
        } else if (data) {
          // تنظيف البيانات والتأكد من عدم وجود تكرار
          const uniqueMovies = Array.from(
            new Map(data.map((item) => [item.id || item.title, item])).values()
          )
          setMovies(uniqueMovies as Movie[])
        }
      } catch (err) {
        console.error('خطأ غير متوقع:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMovies()
  }, [])

  const availableYears = useMemo(() => {
    const years = movies
      .map((m) => m.year)
      .filter((y): y is string | number => Boolean(y))
    return Array.from(new Set(years)).sort((a, b) => Number(b) - Number(a))
  }, [movies])

  const filteredMovies = useMemo(() => {
    let result = movies.filter((movie) => {
      const title = movie.title || ''
      const matchesSearch =
        !searchQuery.trim() ||
        title.toLowerCase().includes(searchQuery.trim().toLowerCase())

      let matchesCategory = true
      const type = (movie.type || '').toLowerCase()

      if (selectedCategory === 'top') {
        matchesCategory = Number(movie.rating || 0) >= 7.0
      } else if (selectedCategory === 'movie') {
        matchesCategory = type === 'movie' || type === '' || type.includes('film')
      } else if (selectedCategory === 'series') {
        matchesCategory = type === 'series' || type.includes('tv') || type.includes('مسلسل')
      }

      let matchesYear = true
      if (selectedYear !== 'all') {
        matchesYear = String(movie.year) === String(selectedYear)
      }

      return matchesSearch && matchesCategory && matchesYear
    })

    if (sortBy === 'rating') {
      result = [...result].sort(
        (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
      )
    } else if (sortBy === 'year') {
      result = [...result].sort(
        (a, b) => Number(b.year || 0) - Number(a.year || 0)
      )
    }

    return result
  }, [movies, selectedCategory, searchQuery, selectedYear, sortBy])

  const heroMovie = movies.length > 0 ? movies[0] : null
  
  // صور افتراضية عالية الجودة في حال لم يكن هناك بوستر
  const fallbackPoster = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500&auto=format&fit=crop'

  return (
    <main className="min-h-screen bg-[#141414] text-white dir-rtl font-sans pb-12">
      {/* Navbar */}
      <nav className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-4 bg-gradient-to-b from-black/95 via-black/80 to-transparent fixed top-0 w-full z-50 backdrop-blur-md gap-4">
        <div className="flex items-center justify-between w-full md:w-auto gap-8">
          <h1 className="text-3xl font-black tracking-wider text-red-600">
            فليكسي <span className="text-xs text-gray-400 font-normal">FLEXI</span>
          </h1>

          <ul className="hidden lg:flex gap-2 text-sm font-medium">
            {CATEGORIES.map((cat) => (
              <li key={cat.value}>
                <button
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-full transition text-xs md:text-sm ${
                    selectedCategory === cat.value
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-gray-300 hover:text-white hover:bg-white/15'
                  }`}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto relative">
          <div className="relative flex-1 md:w-72">
            <input
              type="text"
              placeholder="ابحث عن فيلم أو مسلسل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-600 transition"
            />
          </div>

          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold bg-black/60 border-white/20 text-gray-300 hover:border-white transition"
          >
            <span>فلترة</span>
          </button>

          {isFilterOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl p-4 z-50 space-y-4 backdrop-blur-xl top-full">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="font-bold text-sm text-gray-200">خيارات الفلترة</span>
                <button
                  onClick={() => {
                    setSelectedYear('all')
                    setSortBy('latest')
                    setSelectedCategory('all')
                  }}
                  className="text-[11px] text-red-400 hover:underline"
                >
                  إعادة ضبط
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-400">سنة الإنتاج</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="all">كل السنوات</option>
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-400">ترتيب حسب</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="latest">الأحدث إضافة</option>
                  <option value="rating">الأعلى تقييماً ★</option>
                  <option value="year">سنة الإصدار</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      {heroMovie && !searchQuery && selectedCategory === 'all' && selectedYear === 'all' && (
        <section className="relative h-[65vh] md:h-[75vh] w-full flex items-end justify-start p-6 md:p-16 pt-24">
          <div className="absolute inset-0 z-0">
            <img
              src={heroMovie.poster_url || fallbackPoster}
              alt={heroMovie.title}
              className="w-full h-full object-cover opacity-40 filter blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold">
              {heroMovie.watermark || 'محتوى مميز'}
            </span>
            <h2 className="text-3xl md:text-5xl font-black">{heroMovie.title || 'بدون عنوان'}</h2>
            <p className="text-gray-300 text-xs md:text-sm line-clamp-3">
              {heroMovie.plot || 'استمتع بمشاهدة أحدث وأقوى الأعمال السينمائية حصرياً على منصة فليكسي بجودة عالية وبدون إعلانات مزعجة.'}
            </p>
            <div className="flex gap-4 pt-2">
              <Link
                href={`/watch/${heroMovie.id}`}
                className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-red-700 transition text-sm shadow-lg"
              >
                ▶ مشاهدة الآن
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="px-6 md:px-12 relative z-10 pt-24">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-gray-100">
            🔥 نتائج التصفح ({filteredMovies.length})
          </h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-[#1f1f1f] h-64 rounded-xl" />
            ))}
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            لا توجد عناصر مطابقة لهذا التصنيف أو البحث.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {filteredMovies.map((movie) => (
              <Link
                key={movie.id}
                href={`/watch/${movie.id}`}
                className="group relative bg-[#1f1f1f] rounded-xl overflow-hidden shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border border-white/5 hover:border-red-600/50"
              >
                <div className="absolute top-2 right-2 z-20 bg-black/70 backdrop-blur-md text-red-500 font-black text-[10px] px-2 py-0.5 rounded border border-red-500/30">
                  {movie.watermark || 'فليكسي'}
                </div>

                <div className="aspect-[2/3] w-full overflow-hidden relative bg-gray-900">
                  <img
                    src={movie.poster_url && movie.poster_url.startsWith('http') ? movie.poster_url : fallbackPoster}
                    alt={movie.title || 'فليم'}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackPoster
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-3">
                    <span className="text-xs text-green-400 font-bold">
                      ★ {movie.rating || '8.2'}
                    </span>
                  </div>
                </div>

                <div className="p-3 space-y-1">
                  <h4 className="font-bold text-xs md:text-sm text-gray-100 truncate">
                    {movie.title || 'عنوان غير متوفر'}
                  </h4>
                  <div className="flex justify-between items-center text-[11px] text-gray-400 pt-1">
                    <span>{movie.year || '2025'}</span>
                    <span className="text-red-400 text-[10px] bg-red-950/50 px-1.5 py-0.5 rounded border border-red-800/40">
                      {movie.type === 'series' ? 'مسلسل' : 'فيلم'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
