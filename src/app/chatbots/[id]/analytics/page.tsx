'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { callApi } from '@/utils/api'

type Analytics = {
  total_visits: number
  total_chats: number
  messages_sent: number
  created_at: string
}

type LogEntry = {
  id: number
  domain: string
  input_query: string
  response_source: string
  category_id: number | null
  question_id: number | null
  created_at: string
}

export default function AnalyticsPage() {
  const { id: chatbotId } = useParams()
  const [data, setData] = useState<Analytics | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (chatbotId) {
      fetchAnalytics()
    }
  }, [chatbotId])

  const fetchAnalytics = async () => {
    try {
      const res = await callApi('get', `/api/v1/chatbots/${chatbotId}/analytics`)
      const response = res?.data as { analytics: Analytics ,logs: LogEntry[] }
      setData(response.analytics || null)
      setLogs(response.logs || [])
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!chatbotId) return <p className="p-4">Invalid chatbot ID.</p>
  if (loading) return <p className="p-4">Loading analytics...</p>
  if (!data) return <p className="p-4">No analytics data available.</p>

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold mb-4">Chatbot Analytics</h1>

      <div className="space-y-4 p-4 border rounded bg-white">
        <div className="flex justify-between">
          <span>Total Visits:</span>
          <span>{data.total_visits}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Chats:</span>
          <span>{data.total_chats}</span>
        </div>
        <div className="flex justify-between">
          <span>Messages Sent:</span>
          <span>{data.messages_sent}</span>
        </div>
        <div className="flex justify-between">
          <span>Tracking Started:</span>
          <span>{new Date(data.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="p-4 border rounded bg-white">
        <h2 className="text-xl font-semibold mb-2">Recent Logs</h2>
        {logs.length === 0 ? (
          <p>No logs found.</p>
        ) : (
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Domain</th>
                <th className="p-2 text-left">Input Query</th>
                <th className="p-2 text-left">Source</th>
                <th className="p-2 text-left">Category ID</th>
                <th className="p-2 text-left">Question ID</th>
                <th className="p-2 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t">
                  <td className="p-2">{log.domain}</td>
                  <td className="p-2">{log.input_query}</td>
                  <td className="p-2">{log.response_source}</td>
                  <td className="p-2">{log.category_id ?? '-'}</td>
                  <td className="p-2">{log.question_id ?? '-'}</td>
                  <td className="p-2">{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
