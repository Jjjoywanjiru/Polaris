'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleRegister() {
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <main className="min-h-screen bg-void flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-heading text-3xl text-bone mb-4">Check your email</h1>
          <p className="text-muted text-sm">
            We sent a confirmation link to <span className="text-bone">{email}</span>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-void flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-heading text-3xl text-bone text-center mb-2">
          POLARIS
        </h1>
        <p className="text-muted text-center text-sm mb-8">
          Create your account
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
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-crimson hover:bg-crimson-light text-bone py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-muted text-sm text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-bone hover:text-crimson transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}