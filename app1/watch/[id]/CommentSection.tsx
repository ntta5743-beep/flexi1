'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CommentSection({ movieId, initialComments }: { movieId: number, initialComments: any[] }) {
  const [comments, setComments] = useState(initialComments)
  const [name, setName] = useState('')
  const [commentText, setCommentText] = useState('')
  const [rating, setRating] = useState(5)
  const [loading, setLoading] = useState(false)

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    setLoading(true)
    const newComment = {
      movie_id: movieId,
      user_name: name.trim() || 'زائر فليكسي',
      rating,
      comment: commentText
    }

    const { data, error } = await supabase.from('comments').insert([newComment]).select()

    if (!error && data) {
      setComments([data[0], ...comments])
      setCommentText('')
    }
    setLoading(false)
  }

  return (
    <div className="bg-[#141414] p-6 rounded-2xl border border-white/5 space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <span>💬</span> تقييمات وآراء المشاهدين ({comments.length})
      </h3>

      {/* نموذج كتابة تعليق */}
      <form onSubmit={handleAddComment} className="space-y-4 bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="اسمك (اختياري)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-[#242424] text-white px-4 py-2 rounded-lg text-sm border border-white/10 focus:outline-none focus:border-red-600 flex-1"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">تقييمك:</span>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="bg-[#242424] text-yellow-400 font-bold px-3 py-2 rounded-lg text-sm border border-white/10"
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
              <option value={4}>⭐⭐⭐⭐ (4/5)</option>
              <option value={3}>⭐⭐⭐ (3/5)</option>
              <option value={2}>⭐⭐ (2/2)</option>
              <option value={1}>⭐ (1/5)</option>
            </select>
          </div>
        </div>

        <textarea
          placeholder="اكتب رأيك في الفيلم/المسلسل بكل صراحة..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={3}
          className="w-full bg-[#242424] text-white p-4 rounded-lg text-sm border border-white/10 focus:outline-none focus:border-red-600"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 text-white font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-red-700 transition"
        >
          {loading ? 'جاري النشر...' : 'إضافة التقييم'}
        </button>
      </form>

      {/* قائمة التعليقات */}
      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-gray-200">{c.user_name}</span>
              <span className="text-xs text-yellow-400">{'⭐'.repeat(c.rating)}</span>
            </div>
            <p className="text-sm text-gray-300">{c.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}