'use client'

import { useEffect, useState } from 'react'
import { callApi } from '@/utils/api'
import Link from 'next/link'
import Image from 'next/image'
import { withAuth } from '@/lib/withAuth'

type Chatbot = {
  id: number
  chatbot_name: string
  logo_path: string | null
  default_message: string
}

function ChatbotsPage() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChatbots()
  }, [])

  const fetchChatbots = async () => {
    const res = await callApi('get', `/api/v1/chatbots`)
    const response = res?.data as { chatbots: Chatbot[] }
    setChatbots(response.chatbots || [])
    setLoading(false)
  }

  if (loading) return <p className="p-4">Loading chatbots...</p>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Chatbots</h1>

      {chatbots.length === 0 ? (
        <p>No chatbots found.</p>
      ) : (
        <ul className="space-y-4">
          {chatbots.map((bot) => (
            <li key={bot.id} className="border rounded p-4 flex gap-4 items-center">
              {bot.logo_path && (
                <Image
                  src={`/${bot.logo_path}`}
                  alt="Logo"
                  width={64}
                  height={64}
                  className="object-cover rounded"
                />
              )}
              <div>
                <p className="text-lg font-semibold">{bot.chatbot_name}</p>
                <p className="text-gray-600 text-sm">
                  {bot.default_message}
                </p>
                <Link
                  href={`/chatbots/${bot.id}/settings`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Details
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default withAuth(ChatbotsPage)
