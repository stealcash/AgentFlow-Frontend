'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { callApi } from '@/utils/api'

export default function ChatbotEmbedPage() {
  const { id: chatbotId } = useParams()
  const [embedScript, setEmbedScript] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await callApi('post', `/api/v1/chatbots/${chatbotId}/embed`)
      const response = res?.data as {[key:string]:string}
      console.log(res)
      setEmbedScript(response?.embed_script || '')
    } catch (err) {
      console.error('Failed to generate embed script:', err)
      alert('Failed to generate embed script')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(embedScript)
    alert('Copied!')
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Embed Script</h1>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? 'Generating...' : 'Generate Embed Script'}
      </button>
      {embedScript && (
        <>
          <pre className="bg-gray-100 p-4 border rounded">{embedScript}</pre>
          <button
            onClick={handleCopy}
            className="bg-green-600 text-white px-4 py-2 rounded mt-2"
          >
            Copy
          </button>
        </>
      )}
    </div>
  )
}
