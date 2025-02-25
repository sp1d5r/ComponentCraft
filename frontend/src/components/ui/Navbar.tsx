import { Link } from 'react-router-dom';
import { Button } from "../shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { Menu, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeProvider';
import { useAuth } from '../../contexts/AuthenticationProvider';

export default function Navbar() {
  const { darkModeState, toggleDarkMode } = useDarkMode();
  const {authState} = useAuth();

  return (
    <div className="sticky top-4 z-50 w-full flex justify-center px-4">
      <nav className="dark:bg-white bg-black rounded-full border border-gray-200 dark:border-gray-800 backdrop-blur-sm  max-w-4xl w-full">
        <div className="px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-sm font-bold dark:text-black text-white">
              ComponentCraft
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/pricing" className="hidden sm:block text-xs font-light dark:text-black text-white hover:underline dark:hover:text-white transition-colors">
              Pricing
            </Link>
            
            {authState.user ? (
              <Link to="/dashboard" className="hidden sm:block text-xs font-light dark:text-black text-white hover:underline transition-colors">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/authentication?mode=login" className="hidden sm:block text-xs font-light dark:text-black text-white hover:text-black dark:hover:text-white transition-colors">
                  Log in
                </Link>
                
                <Button variant="outline" size="sm" className="rounded-full border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text text-xs font-light bg-white dark:bg-black hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300">
                  <Link to="/authentication?mode=sign-up">Join for free</Link>
                </Button>
              </>
            )}
            
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full text-gray-700 dark:text-gray-300">
              {darkModeState.darkMode ? <Sun className="h-4 w-4 text-black" /> : <Moon className="h-4 w-4 text-white" />}
            </Button>
            
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full text-gray-700 dark:text-gray-300">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mt-2 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
                  <DropdownMenuItem className="text-xs font-light focus:bg-gray-100 dark:focus:bg-gray-900">
                    <Link to="/pricing" className="w-full">Pricing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs font-light focus:bg-gray-100 dark:focus:bg-gray-900">
                    {authState.user ? (
                      <Link to="/dashboard" className="w-full">Dashboard</Link>
                    ) : (
                      <Link to="/authentication?mode=login" className="w-full">Log in</Link>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={toggleDarkMode} className="text-xs font-light focus:bg-gray-100 dark:focus:bg-gray-900">
                    {darkModeState ? 'Light Mode' : 'Dark Mode'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}