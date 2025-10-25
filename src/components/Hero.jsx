import Spline from '@splinetool/react-spline'

const Hero = () => {
  return (
    <section className="relative w-full" style={{ minHeight: '60vh' }}>
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/IKzHtP5ThSO83edK/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-24 md:py-36">
        <div className="max-w-2xl bg-white/70 backdrop-blur rounded-2xl p-6 md:p-10 shadow-lg">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Delightful Cakes, Seamless Checkout</h1>
          <p className="mt-4 text-lg text-slate-700">A sleek online cake shop with secure auth, cart, and payment. Fintech-inspired, modern and minimalist.</p>
          <a href="#products" className="inline-block mt-6 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 text-white font-semibold shadow">Shop now</a>
        </div>
      </div>
    </section>
  )
}

export default Hero
