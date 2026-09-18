import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { Order, OrderItem, CustomOrder } from '@/types';
import { Package, Download, FilePlus } from 'lucide-react';

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [tab, setTab] = useState<'retail' | 'custom'>('retail');

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: ordersData }, { data: customData }] = await Promise.all([
        supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('custom_orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);
      setOrders(ordersData as Order[] ?? []);
      setCustomOrders(customData as CustomOrder[] ?? []);
      setLoading(false);
    })();
  }, [user]);

  const toggleOrder = async (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }
    if (!orderItems[orderId]) {
      const { data } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);
      setOrderItems(prev => ({ ...prev, [orderId]: data as OrderItem[] ?? [] }));
    }
    setExpandedOrder(orderId);
  };

  const exportCSV = () => {
    const rows = [
      ['Order ID', 'Date', 'Status', 'Total', 'Shipping Name', 'Shipping Address', 'Items'],
      ...orders.map(o => [
        o.id,
        new Date(o.created_at).toLocaleDateString(),
        o.status,
        `$${Number(o.total).toFixed(2)}`,
        o.shipping_name,
        `${o.shipping_address}, ${o.shipping_city}, ${o.shipping_state} ${o.shipping_zip}`,
        (orderItems[o.id] ?? []).map(i => `${i.product_name} x${i.quantity}`).join('; '),
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
      {/* Tabs */}
      <div className="flex p-1 bg-white rounded-xl border border-gray-200 w-fit">
        <button
          onClick={() => setTab('retail')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'retail' ? 'bg-sky-50 text-sky-700' : 'text-gray-500'}`}
        >
          Retail Orders
        </button>
        <button
          onClick={() => setTab('custom')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'custom' ? 'bg-sky-50 text-sky-700' : 'text-gray-500'}`}
        >
          Custom Orders
        </button>
      </div>

      {tab === 'retail' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
            {orders.length > 0 && (
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="mt-4 text-gray-500">No retail orders yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.map(order => (
                <div key={order.id}>
                  <button
                    onClick={() => toggleOrder(order.id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center">
                        <Package className="w-5 h-5 text-sky-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">${Number(order.total).toFixed(2)}</span>
                    </div>
                  </button>
                  {expandedOrder === order.id && orderItems[order.id] && (
                    <div className="px-5 pb-5 bg-gray-50">
                      <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100 text-gray-600">
                            <tr>
                              <th className="text-left px-4 py-2 font-medium">Product</th>
                              <th className="text-center px-4 py-2 font-medium">Qty</th>
                              <th className="text-right px-4 py-2 font-medium">Price</th>
                              <th className="text-right px-4 py-2 font-medium">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {orderItems[order.id].map(item => (
                              <tr key={item.id} className="bg-white">
                                <td className="px-4 py-3 text-gray-900">{item.product_name}</td>
                                <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                                <td className="px-4 py-3 text-right text-gray-600">${Number(item.unit_price).toFixed(2)}</td>
                                <td className="px-4 py-3 text-right font-medium text-gray-900">${(Number(item.unit_price) * item.quantity).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-3 text-sm text-gray-500">
                        <p>Shipping to: {order.shipping_name}, {order.shipping_address}, {order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'custom' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Custom Order History</h2>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(2)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : customOrders.length === 0 ? (
            <div className="p-12 text-center">
              <FilePlus className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="mt-4 text-gray-500">No custom orders yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {customOrders.map(co => (
                <div key={co.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{co.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {co.product_type} • Qty: {co.quantity}
                        {co.budget && ` • Budget: $${Number(co.budget).toFixed(2)}`}
                        {co.deadline && ` • Due: ${new Date(co.deadline).toLocaleDateString()}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Submitted: {new Date(co.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      {co.artwork_url && (
                        <a
                          href={co.artwork_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-xs text-sky-600 hover:text-sky-700 font-medium"
                        >
                          <Download className="w-3.5 h-3.5" /> View Artwork
                        </a>
                      )}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[co.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {co.status.replace('_', ' ')}
                    </span>
                  </div>
                  {co.notes && (
                    <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                      <p className="text-xs text-amber-700"><strong>Notes:</strong> {co.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
