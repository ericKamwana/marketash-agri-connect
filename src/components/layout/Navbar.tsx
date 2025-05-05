
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ButtonWithIcon from "@/components/ui/button-with-icon";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'AI Crop Doctor', path: '/crop-doctor' },
    { name: 'How It Works', path: '/#how-it-works' },
  ];

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/8daf162f-f92f-4d6c-951c-64e1b6d816a0.png" 
            alt="Marketash Logo" 
            className="h-10"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-base font-medium transition-colors ${
                isActive(item.path)
                  ? 'text-marketash-blue'
                  : 'text-gray-600 hover:text-marketash-blue'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/auth?type=login">
            <Button variant="outline" className="font-medium">
              Login
            </Button>
          </Link>
          <Link to="/auth?type=register">
            <ButtonWithIcon variant="primary">
              Sign Up Free
            </ButtonWithIcon>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 shadow-lg">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-base font-medium transition-colors p-2 rounded-md ${
                  isActive(item.path)
                    ? 'text-marketash-blue bg-marketash-lightBlue'
                    : 'text-gray-600 hover:text-marketash-blue'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-2 border-t">
              <Link to="/auth?type=login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/auth?type=register" onClick={() => setIsMenuOpen(false)}>
                <ButtonWithIcon variant="primary" className="w-full">
                  Sign Up Free
                </ButtonWithIcon>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
