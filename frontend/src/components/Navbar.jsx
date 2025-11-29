import { NavLink } from 'react-router-dom'

const linkBase = 'text-sm font-medium px-3 py-2 rounded hover:bg-gray-800 transition-colors'

export default function Navbar() {
  return (
    <header className="border-b border-gray-800 bg-gray-900/60 backdrop-blur">
      <nav className="max-w-5xl mx-auto flex items-center gap-4 px-4 py-3">
        <span className="text-xl font-semibold gradient-text">VoiceGuard AI</span>
        <div className="flex gap-1 ml-auto">
          <NavLink to="/" className={({isActive}) => `${linkBase} ${isActive ? 'bg-primary text-white' : 'text-gray-200'}`}>Home</NavLink>
          <NavLink to="/analyze" className={({isActive}) => `${linkBase} ${isActive ? 'bg-primary text-white' : 'text-gray-200'}`}>Analyze</NavLink>
          <NavLink to="/history" className={({isActive}) => `${linkBase} ${isActive ? 'bg-primary text-white' : 'text-gray-200'}`}>History</NavLink>
          <NavLink to="/about" className={({isActive}) => `${linkBase} ${isActive ? 'bg-primary text-white' : 'text-gray-200'}`}>About</NavLink>
        </div>
      </nav>
    </header>
  )
}
