import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';
import MedicineManager from '../components/admin/MedicineManager';
import SellerManager from '../components/admin/SellerManager';
import WebsiteContentEditor from '../components/admin/WebsiteContentEditor';
import { useGetActiveSellers } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard, Pill, Users, FileEdit, LogOut,
  Menu, X, HeartPulse, TrendingUp, ShieldCheck, Bell
} from 'lucide-react';

type ActiveTab = 'overview' | 'medicines' | 'sellers' | 'content';

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-sm`}>
          <Icon size={22} className="text-white" />
        </div>
        <TrendingUp size={16} className="text-emerald-400" />
      </div>
      <p className="text-3xl font-bold text-emerald-900 mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: activeSellers = [] } = useGetActiveSellers();

  const handleLogout = () => {
    logout();
    navigate({ to: '/admin' });
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'medicines', label: 'Medicines', icon: Pill },
    { id: 'sellers', label: 'Sellers', icon: Users },
    { id: 'content', label: 'Website Content', icon: FileEdit },
  ];

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/gs-medical-logo.dim_512x512.png"
            alt="G&S Medical"
            className="w-10 h-10 rounded-full border-2 border-gold-400"
          />
          <div>
            <p className="font-display font-bold text-white text-sm">G&S MEDICAL</p>
            <p className="text-xs text-emerald-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <button
          onClick={() => navigate({ to: '/' })}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <HeartPulse size={16} />
          View Website
        </button>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 justify-start"
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-emerald-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 flex flex-col">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-emerald-100 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-semibold text-emerald-900 text-lg">
                {navItems.find((n) => n.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                G&S MEDICAL Admin Panel
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span className="text-xs text-emerald-700 font-medium">Admin</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg text-xs"
            >
              <LogOut size={14} className="mr-1.5" />
              Logout
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome */}
              <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <h2 className="font-display text-2xl font-bold mb-1">Welcome back, Admin! 👋</h2>
                  <p className="text-emerald-200 text-sm">
                    Manage your G&S MEDICAL store from this dashboard. You can add medicines, manage sellers, and edit website content.
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                  icon={Users}
                  label="Active Sellers"
                  value={activeSellers.length}
                  color="bg-emerald-600"
                />
                <StatCard
                  icon={Pill}
                  label="Medicine Categories"
                  value="8+"
                  color="bg-gold-500"
                />
                <StatCard
                  icon={HeartPulse}
                  label="Customer Care"
                  value="24/7"
                  color="bg-emerald-700"
                />
              </div>

              {/* Quick actions */}
              <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-card">
                <h3 className="font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                  <Bell size={16} className="text-emerald-600" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Add Medicine', tab: 'medicines' as ActiveTab, icon: Pill, color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
                    { label: 'Add Seller', tab: 'sellers' as ActiveTab, icon: Users, color: 'bg-gold-100 text-gold-700 border-gold-200 hover:bg-gold-200' },
                    { label: 'Edit Content', tab: 'content' as ActiveTab, icon: FileEdit, color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
                  ].map((action) => (
                    <button
                      key={action.label}
                      onClick={() => setActiveTab(action.tab)}
                      className={`flex items-center gap-3 p-4 rounded-xl border font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 ${action.color}`}
                    >
                      <action.icon size={18} />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-card">
                <h3 className="font-semibold text-emerald-900 mb-4">Store Information</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  {[
                    { label: 'Store Name', value: 'G&S MEDICAL' },
                    { label: 'Email', value: 'gauravsaswade@gsgroupswebstore.in' },
                    { label: 'CEO', value: 'Gaurav Sasvade' },
                    { label: 'Co-Founder', value: 'Shushant Waghmare' },
                    { label: 'Customer Care', value: '+91 9766343454' },
                    { label: 'CEO Contact', value: '+91 9270556455' },
                  ].map((info) => (
                    <div key={info.label} className="flex justify-between items-center py-2 border-b border-emerald-50 last:border-0">
                      <span className="text-muted-foreground">{info.label}</span>
                      <span className="font-medium text-emerald-900">{info.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medicines' && <MedicineManager />}
          {activeTab === 'sellers' && <SellerManager />}
          {activeTab === 'content' && <WebsiteContentEditor />}
        </main>
      </div>
    </div>
  );
}
