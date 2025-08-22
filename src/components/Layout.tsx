import React from 'react';
import { Home, Users, AlertTriangle, Settings, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  account: string | null;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage, account }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'children', label: 'Children', icon: Users },
    { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen">
      <div className="network-bg"></div>
      
      {/* Navigation Header */}
      <nav className="sana-card mx-4 mt-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8">
                <svg viewBox="0 0 120 120" className="w-full h-full">
                  <circle cx="60" cy="60" r="55" fill="none" stroke="url(#navGradient)" strokeWidth="6" />
                  <circle cx="60" cy="45" r="12" fill="url(#navGradient)" />
                  <path d="M40 85 C40 70, 50 65, 60 65 C70 65, 80 70, 80 85 L40 85" fill="url(#navGradient)" />
                  <defs>
                    <linearGradient id="navGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(220, 90%, 50%)" />
                      <stop offset="100%" stopColor="hsl(270, 100%, 65%)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="text-xl font-bold text-gradient-primary">SanaTrack</span>
            </div>
            
            <div className="flex space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      currentPage === item.id
                        ? 'bg-primary/20 text-primary glow-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-status-safe rounded-full glow-success"></div>
              <span className="text-sm text-muted-foreground">
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}
              </span>
            </div>
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;