import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Tags, Settings, LogOut, Menu, X, ChevronRight, ClipboardList, MapPin } from 'lucide-react';

const NavButton = ({ id, name, icon: Icon, isActive, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(id)}
      className={`group relative w-full flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-lg font-body text-sm transition-all duration-150 ${
        isActive
          ? 'bg-white/10 text-white'
          : 'text-white/60 hover:bg-white/5 hover:text-white/90'
      }`}
    >
      {/* Active indicator: a gold rail, not a full block fill */}
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-zibah-gold transition-opacity duration-150 ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <Icon size={17} strokeWidth={isActive ? 2.25 : 1.75} className={isActive ? 'text-zibah-gold' : ''} />
      <span className={isActive ? 'font-medium' : ''}>{name}</span>
    </button>
  );
};

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const menuGroups = [
    {
      label: 'Catalog',
      items: [
        { id: 'products', name: 'Products', icon: Package },
        { id: 'categories', name: 'Categories', icon: Tags },
      ],
    },
    {
      label: 'Operations',
      items: [
        { id: 'orders', name: 'Orders', icon: ClipboardList },
        { id: 'vendors', name: 'Vendors', icon: Users },
        { id: 'locations', name: 'Locations', icon: MapPin },
      ],
    },
    {
      label: 'System',
      items: [
        { id: 'settings', name: 'Settings', icon: Settings },
      ],
    },
  ];

  const activeItem =
    activeTab === 'overview'
      ? { name: 'Overview' }
      : menuGroups.flatMap((g) => g.items).find((i) => i.id === activeTab);
  const activeTitle = activeItem?.name ?? 'Overview';

  const handleNavSelect = (id) => {
    setActiveTab?.(id);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-zibah-light flex font-body">

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-zibah-stores text-white flex flex-col shadow-xl transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="px-6 py-7 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-display font-bold tracking-[0.08em] leading-none">
              ZIBAH
            </h1>
            <p className="text-[10px] text-white/40 mt-1.5 font-body uppercase tracking-[0.25em]">
              Stores <span className="text-zibah-gold">· Admin</span>
            </p>
          </div>
          <button className="lg:hidden text-white/70 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div className="h-px bg-white/10 mx-6" />

        <nav className="flex-1 px-4 py-5 space-y-6 overflow-y-auto">
          {/* Overview sits alone at the top — it's the home base, not a category item */}
          <div className="space-y-1">
            <NavButton id="overview" name="Overview" icon={LayoutDashboard} isActive={activeTab === 'overview'} onSelect={handleNavSelect} />
          </div>

          {menuGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <p className="px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-2">
                {group.label}
              </p>
              {group.items.map((item) => (
                <NavButton key={item.id} id={item.id} name={item.name} icon={item.icon} isActive={activeTab === item.id} onSelect={handleNavSelect} />
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/60 hover:bg-zibah-oxblood hover:text-white transition-colors font-body text-sm"
          >
            <LogOut size={17} strokeWidth={1.75} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shrink-0 shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-4 min-w-0">
            <button
              className="lg:hidden p-2 text-zibah-stores bg-zibah-light rounded-md shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              {/* Breadcrumb-style eyebrow gives the header a sense of place within the app */}
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-gray-400 font-body mb-0.5">
                <span>Admin</span>
                <ChevronRight size={11} />
                <span className="text-zibah-stores/70">{activeTab}</span>
              </div>
              <h2 className="text-lg lg:text-xl font-display font-semibold text-zibah-stores truncate">
                {activeTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:block text-sm font-body text-right">
              <p className="font-semibold text-gray-900 leading-tight">Super Admin</p>
              <p className="text-gray-400 text-xs">admin@zibahstores.com</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-zibah-gold flex items-center justify-center text-zibah-stores font-bold font-display shadow-inner shrink-0 ring-2 ring-zibah-gold/20">
              SA
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;