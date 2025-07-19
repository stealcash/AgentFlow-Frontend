'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { callApi } from '@/utils/api'

type Category = {
  id: number
  name: string
}

type Question = {
  id: number
  question_text: string
  answer_text: string
}

export default function QuestionsPage() {
  const params = useParams<{ id: string }>()
  const chatbotId = params.id

  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [newQ, setNewQ] = useState('')
  const [newA, setNewA] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await callApi('get', `/api/v1/chatbots/${chatbotId}/categories`)
      const response = res?.data as { categories: Category[] }
      setCategories(response.categories || [])
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const fetchQuestions = async (cid: number) => {
    setLoading(true)
    try {
      const res = await callApi('get', `/api/v1/chatbots/${chatbotId}/questions/${cid}`)
      const response = res?.data as { questions: Question[] }

      setQuestions(response.questions || [])
    } catch (err) {
      console.error('Failed to fetch questions:', err)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelectCategory = (cid: number) => {
    setCategoryId(cid)
    fetchQuestions(cid)
  }

  const handleAddQuestion = async () => {
    if (!newQ || !newA || !categoryId) return

    try {
      await callApi('post', `/api/v1/chatbots/${chatbotId}/questions`, {
        category_id: categoryId,
        question_text: newQ,
        answer_text: newA,
      })
      setNewQ('')
      setNewA('')
      fetchQuestions(categoryId)
    } catch (err) {
      console.error('Failed to add question:', err)
    }
  }

  const handleDeleteQuestion = async (qid: number) => {
    if (!confirm('Delete this question?')) return

    try {
      await callApi('delete', `/api/v1/chatbots/questions/${qid}`)
      if (categoryId) fetchQuestions(categoryId)
    } catch (err) {
      console.error('Failed to delete question:', err)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Questions Manager</h1>

      <div className="mb-4">
        <label className="block mb-1">Select Category</label>
        <select
          value={categoryId || ''}
          onChange={(e) => handleSelectCategory(Number(e.target.value))}
          className="border p-2 w-full"
        >
          <option value="">-- Select --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading questions...</p>
      ) : categoryId ? (
        <>
          <h2 className="text-xl font-semibold mb-2">Questions in selected category</h2>
          {questions.length === 0 ? (
            <p className="text-gray-500">No questions found.</p>
          ) : (
            <ul className="space-y-2 mb-4">
              {questions.map((q) => (
                <li key={q.id} className="border p-2 rounded flex justify-between">
                  <div>
                    <p className="font-semibold">{q.question_text}</p>
                    <p className="text-gray-600">{q.answer_text}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="space-y-2">
            <input
              type="text"
              placeholder="New question"
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
              className="border p-2 w-full"
            />
            <textarea
              placeholder="Answer"
              value={newA}
              onChange={(e) => setNewA(e.target.value)}
              className="border p-2 w-full"
            />
            <button
              onClick={handleAddQuestion}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Question
            </button>
          </div>
        </>
      ) : (
        <p>Select a category to see questions.</p>
      )}
    </div>
  )
}
