'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const pathname = usePathname()
  const { token, logout, loading } = useAuth()

  if (loading) return null

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/chatbots', label: 'My Chatbots' },
    { href: '/subscription', label: 'Subscription' },
  ]

  return (
    <header className="w-full bg-gray-900 text-gray-100 px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-extrabold text-white">
          AgentFlow.ai
        </Link>
        <nav className="flex flex-wrap gap-4 items-center">
          {token ? (
            <>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`hover:text-indigo-400 transition ${
                    pathname.startsWith(item.href) ? 'underline font-semibold text-indigo-300' : '' // Added text-indigo-300 for active link visibility
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={logout}
                className="ml-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-indigo-400 transition">
                Login
              </Link>
              <Link href="/signup" className="hover:text-indigo-400 transition">
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}