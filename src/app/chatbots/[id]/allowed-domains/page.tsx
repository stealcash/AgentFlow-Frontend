'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { callApi } from '@/utils/api'

type Domain = {
  id: number
  domain: string
}

export default function AllowedDomainsPage() {
  const { id: chatbotId } = useParams()
  const [newDomain, setNewDomain] = useState('')
  const [domains, setDomains] = useState<Domain[]>([])

  useEffect(() => {
    fetchDomains()
  }, [])

  const fetchDomains = async () => {
    try {
      const res = await callApi('get', `/api/v1/chatbots/${chatbotId}/allowed-domains`)
      setDomains((res?.data as {domains:Domain[]}).domains || [])
    } catch (err) {
      console.error('Failed to fetch domains:', err)
    }
  }

  const handleAdd = async () => {
    if (!newDomain.trim()) return
    try {
      await callApi('post', `/api/v1/chatbots/${chatbotId}/allowed-domains`, {
        domain: newDomain.trim(),
      })
      setNewDomain('')
      fetchDomains()
    } catch (err) {
      console.error('Failed to add domain:', err)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Allowed Domains</h1>

      <div className="space-y-3 mb-5">
        <input
          type="text"
          placeholder="Enter domain (e.g. example.com)"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Domain
        </button>
      </div>

      {domains.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-semibold">Allowed:</h2>
          <ul className="list-disc list-inside">
            {domains.map((d) => (
              <li key={d.id}>{d.domain}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
