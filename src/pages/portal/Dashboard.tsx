import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, FilePlus, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { Order, CustomOrder } from '@/types';

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: ordersData }, { data: customData }] = await Promise.all([
        supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('custom_orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
      ]);
      setOrders(ordersData as Order[] ?? []);
      setCustomOrders(customData as CustomOrder[] ?? []);
      setLoading(false);
    })();
  }, [user]);

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length + customOrders.filter(c => c.status === 'submitted').length;

  const stats = [
    { icon: Package, label: 'Total Orders', value: orders.length, color: 'from-sky-500 to-blue-600' },
    { icon: FilePlus, label: 'Custom Orders', value: customOrders.length, color: 'from-emerald-500 to-teal-600' },
    { icon: Clock, label: 'Pending', value: pendingOrders, color: 'from-amber-500 to-orange-600' },
    { icon: TrendingUp, label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, color: 'from-violet-500 to-purple-600' },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-sky-100 text-sky-700',
    shipped: 'bg-blue-100 text-blue-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
    submitted: 'bg-amber-100 text-amber-700',
    approved: 'bg-sky-100 text-sky-700',
    in_production: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link to="/portal/orders" className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 font-medium">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="mt-3 text-gray-500">No orders yet. Start shopping!</p>
            <Link to="/retail" className="inline-flex items-center gap-1 mt-3 text-sm text-sky-600 font-medium">
              Browse Retail Store <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">${Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Custom Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Custom Orders</h2>
          <Link to="/portal/custom-order" className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 font-medium">
            New Custom Order <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : customOrders.length === 0 ? (
          <div className="p-8 text-center">
            <FilePlus className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="mt-3 text-gray-500">No custom orders yet.</p>
            <Link to="/portal/custom-order" className="inline-flex items-center gap-1 mt-3 text-sm text-sky-600 font-medium">
              Submit a Custom Order <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {customOrders.map(co => (
              <div key={co.id} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">{co.title}</p>
                  <p className="text-xs text-gray-500">{co.product_type} • Qty: {co.quantity} • {new Date(co.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[co.status] ?? 'bg-gray-100 text-gray-600'}`}>
                  {co.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
