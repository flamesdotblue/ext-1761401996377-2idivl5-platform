import { useEffect, useState } from 'react'

const ProductGrid = ({ token }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        if (mounted) setProducts(data)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const addToCart = async (id) => {
    if (!token) {
      alert('Please login to add to cart')
      return
    }
    await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ productId: id, quantity: 1 })
    })
    alert('Added to cart')
  }

  if (loading) return <div className="text-center py-12 text-slate-600">Loading products...</div>

  return (
    <div id="products" className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {products.map(p => (
        <div key={p.id} className="group border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition">
          <div className="relative">
            <img src={p.imageUrl} alt={p.name} className="w-full h-48 object-cover" />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p className="text-slate-600 text-sm line-clamp-2">{p.description}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="font-bold">${Number(p.price).toFixed(2)}</span>
              <button onClick={() => addToCart(p.id)} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white">Add to cart</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductGrid
