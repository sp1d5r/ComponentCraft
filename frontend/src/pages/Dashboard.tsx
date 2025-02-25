import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import {
  IconHome,
  IconUser,
  IconSettings,
  IconLogout,
  IconCreditCard,
  IconBolt,
} from "@tabler/icons-react";
import { Moon, Sun } from "lucide-react";
import { Button } from "../components/shadcn/button";
import { useDarkMode } from "../contexts/DarkModeProvider";
import { AuthStatus, useAuth } from "../contexts/AuthenticationProvider";
import { ProfileStatus, useProfile } from "../contexts/ProfileProvider";
import { useToast } from "../contexts/ToastProvider";
import { DashboardMain } from "../components/page-components/dashboard/DashboardMain";
import DashboardProfile from "../components/page-components/dashboard/DashboardProfile";

const Dashboard: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { darkModeState, toggleDarkMode } = useDarkMode();
  const [activeContent, setActiveContent] = useState<string>("home");
  const { authState, logout } = useAuth();
  const { status: profileStatus, profile } = useProfile();
  const { toast } = useToast();

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    
    if (sessionId) {
      // Clear the URL parameter
      window.history.replaceState({}, '', '/dashboard');
      // Show success message
      toast({
        title: "Subscription Updated",
        description: "Your subscription has been updated successfully.",
      });
    }
  }, []);

  useEffect(() => {
    const content = searchParams.get("content");
    if (content && sidebarLinks.some(link => link.id === content)) {
      setActiveContent(content);
    } else {
      setActiveContent("home");
    }
  }, [searchParams]);

  useEffect(() => {
    if (authState) {
      switch (authState.status) {
        case AuthStatus.UNAUTHENTICATED:
          navigate("/authentication?mode=login");
          break;
        case AuthStatus.AUTHENTICATED:
          // Check profile status when authenticated
          console.log("Profile status:", authState.user);
          switch (profileStatus) {
            case ProfileStatus.NO_PROFILE:
            case ProfileStatus.NEEDS_ONBOARDING:
              navigate("/onboarding");
              break;
            case ProfileStatus.COMPLETE:
            case ProfileStatus.LOADING:
              break;
          }
          break;
        case AuthStatus.LOADING:
          break;
      }
    }
  }, [authState, profileStatus, navigate]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-800",
          "transform transition-transform duration-300 ease-in-out",
          "lg:relative lg:transform-none",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-8 bg-black dark:bg-white rounded-lg" />
            <span className="text-lg font-medium text-black dark:text-white">ComponentCraft</span>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 flex-1">
            {sidebarLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveContent(link.id)}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg",
                  "transition-colors duration-200",
                  activeContent === link.id
                    ? "bg-gray-100 dark:bg-neutral-800 text-black dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-900"
                )}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </nav>

          {/* Credits Section */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-black dark:text-white">Credits Remaining</span>
                <IconBolt className="h-4 w-4 text-black dark:text-white" />
              </div>
              <div className="text-2xl font-bold text-black dark:text-white mb-2">2,450</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-black h-2 rounded-full" style={{ width: '70%' }} />
              </div>
              <Button 
                className="w-full mt-3 bg-black text-white hover:bg-gray-800"
                onClick={() => navigate('/billing')}
              >
                Add Credits
              </Button>
            </div>
          </div>

          {/* User Section */}
          <div className="border-t border-gray-200 dark:border-neutral-800 pt-6 mt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-neutral-800" />
              <div className="flex-1">
                <div className="font-medium">{profile?.displayName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Pro Plan</div>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                {darkModeState ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-neutral-800">
          <div className="flex items-center justify-between px-6 h-16">
            <h1 className="text-xl font-medium text-black dark:text-white">{getPageTitle(activeContent)}</h1>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => window.open('/docs', '_blank')}>
                Documentation
              </Button>
              <Button 
                className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                onClick={() => navigate('/new-project')}
              >
                New Project
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {renderContent(activeContent)}
        </main>
      </div>
    </div>
  );
};

const sidebarLinks = [
  {
    id: "home",
    label: "Dashboard",
    icon: <IconHome className="h-5 w-5" />,
  },
  {
    id: "projects",
    label: "Projects",
    icon: <IconBolt className="h-5 w-5" />,
  },
  {
    id: "billing",
    label: "Billing",
    icon: <IconCreditCard className="h-5 w-5" />,
  },
  {
    id: "profile",
    label: "Profile",
    icon: <IconUser className="h-5 w-5" />,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <IconSettings className="h-5 w-5" />,
  },
];

const getPageTitle = (contentId: string) => {
  const link = sidebarLinks.find(link => link.id === contentId);
  return link?.label || 'Dashboard';
};

const renderContent = (contentId: string) => {
  switch (contentId) {
    case "home":
      return <DashboardMain />;
    case "profile":
      return <DashboardProfile />;
    case "settings":
      return <h1>Settings</h1>;
    case "logout":
      return <h1>Logout Confirmation</h1>;
    default:
      return <h1>404 Not Found</h1>;
  }
};

export default Dashboard;