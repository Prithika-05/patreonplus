import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Home, CreditCard, Search, Bell, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SubscriberLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/subscriber/feed', label: 'Home Feed', icon: Home },
    { path: '/subscriber/subscriptions', label: 'My Subscriptions', icon: CreditCard },
    { path: '/subscriber/explore', label: 'Explore Creators', icon: Search },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      <motion.aside 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative flex w-72 flex-col border-r border-border/60 bg-card/50 backdrop-blur-xl shadow-sm z-20"
      >
        <div className="flex h-20 items-center gap-3 px-8 border-b border-border/60">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-lg shadow-primary/20">
            <span className="font-bold text-lg">P+</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">Patreon+</h1>
            <p className="text-xs font-medium text-muted-foreground">Fan Portal</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary-foreground' : 'text-current'}`} />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-0 top-0 bottom-0 w-1 bg-white/20 rounded-r-xl"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        <div className="border-t border-border/60 p-6 bg-gradient-to-t from-card to-transparent">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-secondary to-accent flex items-center justify-center text-secondary-foreground font-bold border border-border shadow-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-semibold text-foreground">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">Subscriber</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </motion.aside>


      <main className="relative flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
       <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-50" />
        
        <header className="flex h-16 items-center justify-between border-b border-border/60 bg-background/80 backdrop-blur-md px-6 sticky top-0 z-10">
           <div className="flex items-center gap-2 md:hidden">
              <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
           </div>
           <div className="hidden md:block text-sm font-medium text-muted-foreground">
              Welcome back, {user?.name}
           </div>
           <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                 <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary relative">
                 <Bell className="h-5 w-5" />
                 <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background"></span>
              </Button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          <div className="mx-auto max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriberLayout;