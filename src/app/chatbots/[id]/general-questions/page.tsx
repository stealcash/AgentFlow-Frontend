'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { callApi } from '@/utils/api'

type GeneralQuestion = {
  id: string // ES doc ID is string
  question_text: string
  answer_text: string | null
}

export default function GeneralQuestionsPage() {
  const params = useParams()
  const chatbotIdParam = params?.id
  const chatbotId = Array.isArray(chatbotIdParam) ? chatbotIdParam[0] : chatbotIdParam

  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [questions, setQuestions] = useState<GeneralQuestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!chatbotId) return
    fetchQuestions()
  }, [chatbotId])

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const res = await callApi('get', `/api/v1/chatbots/${chatbotId}/general-questions`)
      const response = res?.data as { questions: GeneralQuestion[] }
      setQuestions(response.questions || [])
    } catch (err) {
      console.error('Failed to fetch questions:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!question.trim()) {
      alert('Question required')
      return
    }
    try {
      await callApi('post', `/api/v1/chatbots/${chatbotId}/general-questions`, {
        question_text: question,
        answer_text: answer,
      })
      setQuestion('')
      setAnswer('')
      fetchQuestions()
    } catch (err) {
      console.error('Failed to add question:', err)
      alert('Failed to add question.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return
    try {
      await callApi('delete', `/api/v1/chatbots/${chatbotId}/general-questions/${id}`)
      fetchQuestions()
    } catch (err) {
      console.error('Failed to delete question:', err)
      alert('Failed to delete question.')
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">General Questions</h1>

      <div className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <textarea
          placeholder="Answer (optional)"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button
          onClick={handleAdd}
          disabled={!question.trim()}
          className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Add General Question
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : questions.length > 0 ? (
        <div className="space-y-3">
          <h2 className="font-semibold">Stored General Questions:</h2>
          {questions.map((q) => (
            <div
              key={q.id}
              className="p-3 bg-white border rounded shadow-sm flex justify-between items-start"
            >
              <div>
                <p className="font-medium">{q.question_text}</p>
                {q.answer_text && (
                  <p className="text-sm text-gray-600">{q.answer_text}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(q.id)}
                className="ml-4 text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No general questions added yet.</p>
      )}
    </div>
  )
}
