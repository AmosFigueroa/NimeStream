import React, { useState } from 'react';
import { Search, MonitorPlay, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-secondary/90 backdrop-blur-md border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <MonitorPlay className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl tracking-wider text-white">NIMESTREAM</span>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                placeholder="Search anime..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 text-slate-200 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <button type="submit" className="absolute right-0 top-0 h-full px-4 text-slate-400 hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
            <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Home</button>
            <button className="hover:text-primary transition-colors">New Season</button>
            <button className="hover:text-primary transition-colors">Popular</button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-secondary border-b border-slate-700">
          <div className="px-4 pt-4 pb-6 space-y-4">
             <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search anime..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg py-2 pl-4 pr-10"
              />
              <button type="submit" className="absolute right-2 top-2 text-slate-400">
                <Search className="w-5 h-5" />
              </button>
            </form>
            <div className="flex flex-col space-y-2 text-slate-300">
              <button onClick={() => { navigate('/'); setIsMenuOpen(false); }} className="text-left py-2 hover:text-primary">Home</button>
              <button className="text-left py-2 hover:text-primary">New Season</button>
              <button className="text-left py-2 hover:text-primary">Popular</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
