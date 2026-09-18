import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, FilePlus, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function PortalLayout() {
  const { profile } = useAuth();

  const navItems = [
    { to: '/portal', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/portal/orders', label: 'Order History', icon: Package, end: false },
    { to: '/portal/custom-order', label: 'New Custom Order', icon: FilePlus, end: false },
    { to: '/portal/profile', label: 'Profile', icon: Settings, end: false },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customer Portal</h1>
          <p className="mt-1 text-gray-600">Welcome back, {profile?.full_name ?? 'there'}.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="space-y-1 bg-white rounded-2xl border border-gray-100 p-3 sticky top-20">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-sky-50 text-sky-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
