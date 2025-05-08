
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { User, LogOut, Bell, Menu, X } from 'lucide-react';
import { useSupabase } from '@/lib/supabase/supabase-provider';
import { useNotifications } from '@/lib/supabase/useNotifications';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, userProfile, signOut } = useSupabase();
  const { newNotificationCount } = useNotifications();
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navbarClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-300
    ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}
  `;
  
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    { title: "Home", path: "/" },
    { title: "Marketplace", path: "/marketplace" },
    { title: "Crop Doctor", path: "/crop-doctor" },
    ...(user ? [{ title: "Dashboard", path: "/dashboard" }] : [])
  ];
  
  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-marketash-blue text-xl font-bold">Marketash</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-medium transition-colors duration-200 ${
                isActive(item.path)
                  ? 'text-marketash-blue'
                  : 'text-gray-600 hover:text-marketash-blue'
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>
        
        {/* Right Section - Auth/Profile */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Notifications */}
              <Link to="/notifications" className="relative text-gray-600 hover:text-marketash-blue">
                <Bell className="h-5 w-5" />
                {newNotificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-marketash-green text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full p-0">
                    {newNotificationCount}
                  </Badge>
                )}
              </Link>
              
              {/* Profile Dropdown - Desktop */}
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 m-0">
                      <Avatar className="h-8 w-8">
                        {userProfile?.avatar_url ? (
                          <AvatarImage src={userProfile.avatar_url} alt={userProfile.display_name || 'User'} />
                        ) : (
                          <AvatarFallback className="bg-marketash-blue text-white">
                            {getInitials(userProfile?.display_name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5 text-sm font-medium border-b border-gray-100">
                      <p className="truncate">{userProfile?.display_name || 'User'}</p>
                      <p className="text-xs text-gray-500 capitalize">{userProfile?.user_type || 'User'}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">Profile Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600 focus:text-red-700">
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <div className="hidden md:block">
              <Link to="/auth">
                <Button className="bg-marketash-blue hover:bg-marketash-blue/90 text-white">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            </div>
          )}
          
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <span className="text-lg font-bold text-marketash-blue">Marketash</span>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                    </SheetClose>
                  </div>
                  
                  <div className="py-4 flex-1">
                    <ul className="space-y-4">
                      {menuItems.map((item) => (
                        <li key={item.path}>
                          <SheetClose asChild>
                            <Link
                              to={item.path}
                              className={`block py-2 font-medium ${
                                isActive(item.path) ? 'text-marketash-blue' : 'text-gray-600'
                              }`}
                            >
                              {item.title}
                            </Link>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t">
                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            {userProfile?.avatar_url ? (
                              <AvatarImage src={userProfile.avatar_url} alt={userProfile.display_name || 'User'} />
                            ) : (
                              <AvatarFallback className="bg-marketash-blue text-white">
                                {getInitials(userProfile?.display_name)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium">{userProfile?.display_name || 'User'}</p>
                            <p className="text-xs text-gray-500 capitalize">{userProfile?.user_type || 'User'}</p>
                          </div>
                        </div>
                        <SheetClose asChild>
                          <Link to="/profile">
                            <Button variant="outline" className="w-full justify-start">
                              <User className="h-4 w-4 mr-2" />
                              Profile Settings
                            </Button>
                          </Link>
                        </SheetClose>
                        <Button 
                          variant="destructive" 
                          className="w-full justify-start" 
                          onClick={signOut}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <SheetClose asChild>
                        <Link to="/auth" className="block w-full">
                          <Button className="w-full bg-marketash-blue hover:bg-marketash-blue/90">
                            <User className="h-4 w-4 mr-2" />
                            Sign In
                          </Button>
                        </Link>
                      </SheetClose>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
