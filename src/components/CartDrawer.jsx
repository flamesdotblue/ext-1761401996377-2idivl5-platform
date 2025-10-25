import { useEffect, useState } from 'react'

const CartDrawer = ({ open, onOpenChange, token }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  const load = async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch('/api/cart', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setItems(data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, token])

  const checkout = async () => {
    if (!token) return
    const res = await fetch('/api/checkout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json().catch(() => ({}))
    if (data.status === 'success') {
      setStatus('Payment successful! 🎉')
    }
  }

  const total = items.reduce((sum, it) => sum + (it.product?.price || 0) * it.quantity, 0)

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-slate-900/50 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => onOpenChange(false)} />
      <aside className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-xl transform transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Your Cart</h3>
          <button onClick={() => onOpenChange(false)} className="px-2 py-1 text-slate-600 hover:text-slate-900">Close</button>
        </div>
        <div className="p-4 space-y-3 overflow-auto h-[calc(100%-160px)]">
          {loading && <div className="text-slate-600">Loading...</div>}
          {!loading && items.length === 0 && <div className="text-slate-600">Your cart is empty.</div>}
          {items.map(it => (
            <div key={it.id} className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <div className="font-medium">{it.product?.name}</div>
                <div className="text-sm text-slate-600">Qty: {it.quantity}</div>
              </div>
              <div className="font-semibold">${(((it.product?.price) || 0) * it.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-600">Total</span>
            <span className="text-lg font-bold">${total.toFixed(2)}</span>
          </div>
          <button onClick={checkout} disabled={!token || items.length === 0} className="w-full rounded-lg bg-indigo-600 text-white py-2 font-semibold disabled:opacity-50">Checkout</button>
          {status && <div className="mt-2 text-green-700 text-sm">{status}</div>}
        </div>
      </aside>
    </div>
  )
}

export default CartDrawer
