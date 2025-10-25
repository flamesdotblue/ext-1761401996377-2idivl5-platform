import { ShoppingCart, LogOut, User } from 'lucide-react'

const Navbar = ({ isAuthed, onLoginClick, onRegisterClick, onLogoutClick, onCartClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur bg-white/70 border-b">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        <a href="/" className="font-semibold text-lg">CakeShop</a>
        <nav className="flex items-center gap-2">
          {!isAuthed ? (
            <>
              <button onClick={onLoginClick} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white">Login</button>
              <button onClick={onRegisterClick} className="px-3 py-1.5 rounded-lg bg-slate-100">Register</button>
            </>
          ) : (
            <>
              <button onClick={onLogoutClick} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100">
                <LogOut size={16} /> Logout
              </button>
              <div className="hidden md:flex items-center text-slate-600"><User size={18} className="mr-1" /> Account</div>
            </>
          )}
          <button onClick={onCartClick} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white">
            <ShoppingCart size={16} /> Cart
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
