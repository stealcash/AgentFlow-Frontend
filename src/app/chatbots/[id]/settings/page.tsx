'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { callApi } from '@/utils/api'
import { BASE_URL } from '@/config/constants'

export default function ChatbotSettingsPage() {
  const [chatbotName, setChatbotName] = useState('')
  const [defaultMessage, setDefaultMessage] = useState('')
  const [logo, setLogo] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')

  const { id: chatbotId } = useParams()

  useEffect(() => {
    fetchSettings(chatbotId)
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [chatbotId])

  const fetchSettings = async (chatbotId:unknown) => {
    try {
      const res = await callApi('get', `/api/v1/chatbots/${chatbotId}/settings`)
      const respose = res?.data as {
        chatbot_name :string
        default_message :string
        logo_path :string
      }
      const { chatbot_name, default_message, logo_path } = respose

      if (chatbot_name) setChatbotName(chatbot_name)
      if (default_message) setDefaultMessage(default_message)
      if (logo_path) setPreviewUrl(`${BASE_URL}/uploads/${logo_path}`)
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    }
  }

  const handleUpload = async () => {
    const formData = new FormData()
    formData.append('chatbot_name', chatbotName)
    formData.append('default_message', defaultMessage)
    if (logo) formData.append('logo', logo)

    try {
      await callApi('post', `/api/v1/chatbots/${chatbotId}/settings`, formData, {
        'Content-Type': 'multipart/form-data',
      })
      alert('Settings updated')
      fetchSettings(chatbotId)
    } catch (err) {
      console.error('Failed to upload settings:', err)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chatbot Settings</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Chatbot Name"
          value={chatbotName}
          onChange={(e) => setChatbotName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Default Welcome Message"
          value={defaultMessage}
          onChange={(e) => setDefaultMessage(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            setLogo(file || null)
            if (file) setPreviewUrl(URL.createObjectURL(file))
          }}
        />
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Preview"
            className="w-24 h-24 object-contain border rounded"
            
          />
        )}
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}
