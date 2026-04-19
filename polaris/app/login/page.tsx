'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  async function handleLogin() {
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-void flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-heading text-3xl text-bone text-center mb-2">
          POLARIS
        </h1>
        <p className="text-muted text-center text-sm mb-8">
          Sign in to your account
        </p>

        <div className="bg-obsidian border border-ghost rounded-lg p-8 space-y-4">
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <div>
            <label className="text-bone text-sm block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full bg-ash border border-ghost rounded px-3 py-2 text-bone text-sm focus:outline-none focus:border-crimson"
            />
          </div>

          <div>
            <label className="text-bone text-sm block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="yourpassword"
              className="w-full bg-ash border border-ghost rounded px-3 py-2 text-bone text-sm focus:outline-none focus:border-crimson"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-crimson hover:bg-crimson-light text-bone py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-muted text-sm text-center">
            No account?{' '}
            <Link href="/register" className="text-bone hover:text-crimson transition-colors">
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}