import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductGrid from './components/ProductGrid'
import CartDrawer from './components/CartDrawer'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [showCart, setShowCart] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const headersWithAuth = useMemo(() => (
    token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
  ), [token])

  const handleLogin = async (email, password) => {
    setLoading(true)
    setAuthError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setShowAuth(false)
    } catch (e) {
      setAuthError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (name, email, password) => {
    setLoading(true)
    setAuthError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      // After registration, auto-open login
      setAuthMode('login')
    } catch (e) {
      setAuthError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-white to-slate-50 text-slate-900">
      <Navbar
        isAuthed={!!token}
        onLoginClick={() => { setAuthMode('login'); setShowAuth(true) }}
        onRegisterClick={() => { setAuthMode('register'); setShowAuth(true) }}
        onLogoutClick={logout}
        onCartClick={() => setShowCart(true)}
      />

      <main className="flex-1">
        <Hero />
        <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Our Cakes</h2>
            <p className="text-slate-600">Freshly baked favorites</p>
          </div>
          <ProductGrid token={token} />
        </section>
      </main>

      <footer className="mt-auto border-t bg-white/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 text-sm text-slate-600 flex items-center justify-between">
          <span>© {new Date().getFullYear()} CakeShop</span>
          <span>Secure auth, cart, and checkout</span>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setShowAuth(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1.5 rounded ${authMode === 'login' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}
                  onClick={() => { setAuthMode('login'); setAuthError('') }}
                >Login</button>
                <button
                  className={`px-3 py-1.5 rounded ${authMode === 'register' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}
                  onClick={() => { setAuthMode('register'); setAuthError('') }}
                >Register</button>
              </div>
              <button onClick={() => setShowAuth(false)} className="px-2 py-1 text-slate-500 hover:text-slate-800">Close</button>
            </div>
            {authMode === 'login' ? (
              <LoginForm onSubmit={handleLogin} loading={loading} error={authError} />
            ) : (
              <RegisterForm onSubmit={handleRegister} loading={loading} error={authError} />
            )}
          </div>
        </div>
      )}

      <CartDrawer open={showCart} onOpenChange={setShowCart} token={token} />
    </div>
  )
}

function LoginForm({ onSubmit, loading, error }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(email, password) }}
      className="space-y-3"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input type="password" className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <button disabled={loading} className="w-full rounded-lg bg-blue-600 text-white py-2 font-semibold hover:bg-blue-700 disabled:opacity-50">
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}

function RegisterForm({ onSubmit, loading, error }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(name, email, password) }}
      className="space-y-3"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Baker" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input type="password" className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <button disabled={loading} className="w-full rounded-lg bg-green-600 text-white py-2 font-semibold hover:bg-green-700 disabled:opacity-50">
        {loading ? 'Creating...' : 'Create account'}
      </button>
    </form>
  )
}

export default App
