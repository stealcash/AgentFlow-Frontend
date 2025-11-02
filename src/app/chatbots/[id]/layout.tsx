'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { useParams, usePathname } from 'next/navigation'

export default function ChatbotLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const params = useParams() as { id: string }

  const chatbotId = params.id

  const links = [
    { href: `/chatbots/${chatbotId}/settings`, label: 'Settings' },
    { href: `/chatbots/${chatbotId}/categories`, label: 'Categories' },
    { href: `/chatbots/${chatbotId}/questions`, label: 'Questions' },
    { href: `/chatbots/${chatbotId}/general-questions`, label: 'General Qs' },
    { href: `/chatbots/${chatbotId}/files`, label: 'Files' },
    { href: `/chatbots/${chatbotId}/embed`, label: 'Embed Script' },
    { href: `/chatbots/${chatbotId}/allowed-domains`, label: 'Allowed Domains' },
    { href: `/chatbots/${chatbotId}/analytics`, label: 'Anylatics' },
  ]

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4 border-r space-y-2">
        <h2 className="text-lg font-bold mb-4">Chatbot Menu</h2>
        <nav className="flex flex-col space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded ${
                pathname === link.href
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-blue-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
