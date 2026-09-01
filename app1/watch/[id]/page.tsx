'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function DebugWatchPage() {
  const params = useParams()
  const id = params?.id

  const [movie, setMovie] = useState<any>(null)
  const [errorLog, setErrorLog] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function testFetch() {
      try {
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          setErrorLog(error.message)
        } else {
          setMovie(data)
        }
      } catch (err: any) {
        setErrorLog(err.message || 'خطأ غير معروف')
      } finally {
        setLoading(false)
      }
    }

    if (id) testFetch()
  }, [id])

  return (
    <div style={{ padding: '50px', background: '#111', color: '#fff', minHeight: '100vh', fontFamily: 'monospace', direction: 'ltr' }}>
      <h1 style={{ color: '#ff4444' }}>🔍 صفحة فحص النظام (Debug Page)</h1>
      <p><b>الرابط الحالي (ID):</b> {id || 'لا يوجد ID في الرابط!'}</p>
      <p><b>حالة التحميل:</b> {loading ? 'جاري الاتصال بقاعدة البيانات...' : 'انتهى التحميل'}</p>
      <p><b>أخطاء قاعدة البيانات:</b> <span style={{ color: 'orange' }}>{errorLog || 'لا توجد أخطاء'}</span></p>
      
      <h3 style={{ marginTop: '20px' }}>البيانات المسترجعة من Supabase:</h3>
      <pre style={{ background: '#222', padding: '15px', borderRadius: '8px', overflowX: 'auto' }}>
        {movie ? JSON.stringify(movie, null, 2) : 'لم يتم جلب أي بيانات للفيلم بعد!'}
      </pre>

      {movie && movie.video_url && (
        <div style={{ marginTop: '30px' }}>
          <h3>تجربة تشغيل الرابط مباشرة:</h3>
          <video 
            controls 
            preload="auto"
            width="600" 
            style={{ background: '#000', borderRadius: '8px', border: '2px solid #444' }}
            onLoadedData={() => console.log("✅ تم تحميل بيانات الفيديو بنجاح بواسطة المتصفح!")}
            onError={(e) => console.error("❌ خطأ من المتصفح في تشغيل الفيديو:", e)}
          >
            <source src={movie.video_url} type="video/mp4" />
            متصفحك لا يدعم تشغيل الفيديو.
          </video>
        </div>
      )}
    </div>
  )
}
