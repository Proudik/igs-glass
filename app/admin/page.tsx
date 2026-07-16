'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package, Users, LogOut, Plus, Pencil, Trash2, ArrowLeft,
  ImageIcon, DollarSign, Box, Shield, Clock, ChevronRight, X, Check,
  ClipboardList, Truck, Factory, CheckCircle, AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import {
  fetchAllRooflightsAdmin, createProduct, updateProduct, deleteProduct,
  replaceProductImages, replaceProductVariants, replaceProductSpecs,
  fetchAllProfiles, updateUserRole,
  fetchAllOrdersAdmin, updateOrderStatus,
  type ProductWithRelations, type ProfileRow, type OrderRow,
} from '@/lib/product-service';
import { formatPrice } from '@/lib/products';

type AdminTab = 'products' | 'orders' | 'users';

export default function AdminPage() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>('products');
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductWithRelations | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const isAdmin = isAuthenticated && user?.role === 'admin';

  const loadData = useCallback(async () => {
    setLoadingData(true);
    try {
      if (tab === 'products') {
        const data = await fetchAllRooflightsAdmin();
        setProducts(data);
      } else if (tab === 'orders') {
        const data = await fetchAllOrdersAdmin();
        setOrders(data);
      } else {
        const data = await fetchAllProfiles();
        setProfiles(data);
      }
    } catch {
      // RLS or auth error — data will be empty
    } finally {
      setLoadingData(false);
    }
  }, [tab]);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push('/sign-in');
      return;
    }
    if (!isAdmin) {
      router.push('/account');
      return;
    }
    loadData();
  }, [isLoading, isAuthenticated, isAdmin, router, loadData]);

  if (isLoading || !isAdmin) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#777]">Loading...</div>
      </div>
    );
  }

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product? This cannot be undone.')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Failed to delete product. Please try again.');
    }
  }

  async function handleRoleChange(userId: string, role: string) {
    try {
      await updateUserRole(userId, role);
      setProfiles((prev) => prev.map((p) => (p.id === userId ? { ...p, role } : p)));
    } catch {
      alert('Failed to update role.');
    }
  }

  async function handleOrderStatusChange(orderId: string, newStatus: string) {
    try {
      const result = await updateOrderStatus(orderId, newStatus);

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      await fetch(`${supabaseUrl}/functions/v1/send-order-status-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          orderNumber: result.orderNumber,
          customerEmail: result.customerEmail,
          customerName: result.customerName,
          newStatus: result.newStatus,
        }),
      }).catch(() => {});

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: newStatus, status_history: [...o.status_history, { status: newStatus, timestamp: new Date().toISOString(), note: 'Status updated by admin' }] }
            : o,
        ),
      );
    } catch {
      alert('Failed to update order status.');
    }
  }

  return (
    <div className="pt-[72px] min-h-screen">
      {/* Header */}
      <div className="border-b border-[#dedede] px-6 md:px-14 py-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#b00000] mb-1 font-semibold">Admin Panel</p>
        <h1 className="font-display text-[clamp(32px,5vw,52px)] text-[#050505] leading-none">
          ADMIN DASHBOARD
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <nav className="border-b lg:border-b-0 lg:border-r border-[#dedede] bg-white">
          <ul className="lg:pt-6">
            <li>
              <button
                onClick={() => setTab('products')}
                className={`w-full flex items-center gap-3 px-6 py-4 text-[11px] uppercase tracking-[0.18em] font-semibold transition-colors text-left ${
                  tab === 'products' ? 'text-[#050505] bg-[#FAFAF8] border-l-2 border-[#b00000]' : 'text-[#777] hover:text-[#050505] hover:bg-[#FAFAF8]'
                }`}
              >
                <Package size={14} /> Products
              </button>
            </li>
            <li>
              <button
                onClick={() => setTab('orders')}
                className={`w-full flex items-center gap-3 px-6 py-4 text-[11px] uppercase tracking-[0.18em] font-semibold transition-colors text-left ${
                  tab === 'orders' ? 'text-[#050505] bg-[#FAFAF8] border-l-2 border-[#b00000]' : 'text-[#777] hover:text-[#050505] hover:bg-[#FAFAF8]'
                }`}
              >
                <ClipboardList size={14} /> Orders
              </button>
            </li>
            <li>
              <button
                onClick={() => setTab('users')}
                className={`w-full flex items-center gap-3 px-6 py-4 text-[11px] uppercase tracking-[0.18em] font-semibold transition-colors text-left ${
                  tab === 'users' ? 'text-[#050505] bg-[#FAFAF8] border-l-2 border-[#b00000]' : 'text-[#777] hover:text-[#050505] hover:bg-[#FAFAF8]'
                }`}
              >
                <Users size={14} /> Users
              </button>
            </li>
            <li className="mt-4 border-t border-[#dedede]">
              <Link
                href="/account"
                className="w-full flex items-center gap-3 px-6 py-4 text-[11px] uppercase tracking-[0.18em] font-semibold text-[#777] hover:text-[#050505] transition-colors"
              >
                <ArrowLeft size={14} /> Back to Account
              </Link>
            </li>
            <li className="border-t border-[#dedede]">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-6 py-4 text-[11px] uppercase tracking-[0.18em] font-semibold text-[#b00000] hover:text-[#050505] transition-colors"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </li>
          </ul>
        </nav>

        {/* Content */}
        <div className="p-6 md:p-10">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {tab === 'products' && (
              <ProductsTab
                products={products}
                loading={loadingData}
                onAdd={() => { setEditingProduct(null); setShowProductForm(true); }}
                onEdit={(p) => { setEditingProduct(p); setShowProductForm(true); }}
                onDelete={handleDeleteProduct}
              />
            )}
            {tab === 'orders' && (
              <OrdersTab orders={orders} loading={loadingData} onStatusChange={handleOrderStatusChange} />
            )}
            {tab === 'users' && (
              <UsersTab profiles={profiles} loading={loadingData} onRoleChange={handleRoleChange} />
            )}
          </motion.div>
        </div>
      </div>

      {/* Product form modal */}
      {showProductForm && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => { setShowProductForm(false); setEditingProduct(null); }}
          onSaved={() => { setShowProductForm(false); setEditingProduct(null); loadData(); }}
        />
      )}
    </div>
  );
}

// ─── Products Tab ──────────────────────────────────────────────────────────────

function ProductsTab({
  products, loading, onAdd, onEdit, onDelete,
}: {
  products: ProductWithRelations[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (p: ProductWithRelations) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black uppercase tracking-tight text-[#050505]">Rooflight Products</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-[#265954] text-white text-[11px] uppercase tracking-[0.18em] font-semibold px-4 py-3 rounded-md hover:bg-[#3B8A82] transition-colors"
        >
          <Plus size={14} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[11px] uppercase tracking-[0.2em] text-[#777]">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 border border-[#dedede] rounded-lg">
          <Package size={32} className="text-[#dedede] mx-auto mb-3" />
          <p className="text-sm text-[#777]">No products yet. Click "Add Product" to create one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => {
            const primaryImage = product.product_images.find((i) => i.is_primary) ?? product.product_images[0];
            const variant = product.product_variants[0];
            return (
              <div key={product.id} className="border border-[#dedede] rounded-lg overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-[#FAFAF8] border-b sm:border-b-0 sm:border-r border-[#dedede] overflow-hidden">
                    {primaryImage ? (
                      <img src={primaryImage.url} alt={primaryImage.alt} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={24} className="text-[#dedede]" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-[#050505]">{product.name}</p>
                          {!product.is_active && (
                            <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-[#b00000] bg-[#b00000]/10 px-2 py-0.5 rounded">Inactive</span>
                          )}
                          {product.is_featured && (
                            <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-[#265954] bg-[#265954]/10 px-2 py-0.5 rounded">Featured</span>
                          )}
                        </div>
                        <p className="text-xs text-[#777] mb-2">{product.sku} · /{product.slug}</p>
                        <p className="text-sm text-[#555] line-clamp-1">{product.short_description}</p>
                        {variant && (
                          <p className="text-sm font-semibold text-[#050505] mt-1">
                            {formatPrice(variant.price)} <span className="text-xs font-normal text-[#777]">exc. VAT</span>
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => onEdit(product)}
                          className="flex items-center gap-1.5 border border-[#dedede] text-[#555] text-[10px] uppercase tracking-[0.15em] font-semibold px-3 py-2 rounded-md hover:border-[#265954] hover:text-[#265954] transition-colors"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          className="flex items-center gap-1.5 border border-[#dedede] text-[#555] text-[10px] uppercase tracking-[0.15em] font-semibold px-3 py-2 rounded-md hover:border-[#b00000] hover:text-[#b00000] transition-colors"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Users Tab ─────────────────────────────────────────────────────────────────

function UsersTab({
  profiles, loading, onRoleChange,
}: {
  profiles: ProfileRow[];
  loading: boolean;
  onRoleChange: (userId: string, role: string) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-black uppercase tracking-tight text-[#050505] mb-6">User Management</h2>

      {loading ? (
        <div className="text-center py-12 text-[11px] uppercase tracking-[0.2em] text-[#777]">Loading users...</div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-12 border border-[#dedede] rounded-lg">
          <Users size={32} className="text-[#dedede] mx-auto mb-3" />
          <p className="text-sm text-[#777]">No registered users yet.</p>
        </div>
      ) : (
        <div className="border border-[#dedede] rounded-lg overflow-hidden">
          {/* Desktop table */}
          <table className="hidden md:table w-full">
            <thead>
              <tr className="border-b border-[#dedede] bg-[#FAFAF8]">
                <th className="text-left text-[10px] uppercase tracking-[0.18em] text-[#777] font-semibold px-5 py-3">Name</th>
                <th className="text-left text-[10px] uppercase tracking-[0.18em] text-[#777] font-semibold px-5 py-3">Email</th>
                <th className="text-left text-[10px] uppercase tracking-[0.18em] text-[#777] font-semibold px-5 py-3">Role</th>
                <th className="text-left text-[10px] uppercase tracking-[0.18em] text-[#777] font-semibold px-5 py-3">Last Login</th>
                <th className="text-left text-[10px] uppercase tracking-[0.18em] text-[#777] font-semibold px-5 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id} className="border-b border-[#f0f0f0] last:border-0">
                  <td className="px-5 py-4 text-sm text-[#050505]">
                    {p.first_name} {p.last_name}
                    {p.company && <span className="block text-xs text-[#999]">{p.company}</span>}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#555]">{p.email}</td>
                  <td className="px-5 py-4">
                    <RoleSelector value={p.role} onChange={(role) => onRoleChange(p.id, role)} />
                  </td>
                  <td className="px-5 py-4 text-sm text-[#555]">
                    {p.last_sign_in_at ? (
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} className="text-[#999]" />
                        {formatDate(p.last_sign_in_at)}
                      </span>
                    ) : (
                      <span className="text-[#ccc]">Never</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#999]">{formatDate(p.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-[#f0f0f0]">
            {profiles.map((p) => (
              <div key={p.id} className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-[#050505]">{p.first_name} {p.last_name}</p>
                    <p className="text-xs text-[#555]">{p.email}</p>
                    {p.company && <p className="text-xs text-[#999] mt-0.5">{p.company}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.15em] text-[#999] mb-1">Role</p>
                    <RoleSelector value={p.role} onChange={(role) => onRoleChange(p.id, role)} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.15em] text-[#999] mb-1">Last Login</p>
                    <p className="text-sm text-[#555]">{p.last_sign_in_at ? formatDate(p.last_sign_in_at) : 'Never'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RoleSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`text-[10px] uppercase tracking-[0.15em] font-bold border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#265954]/10 transition-all ${
        value === 'admin'
          ? 'border-[#265954] text-[#265954] bg-[#265954]/5'
          : 'border-[#dedede] text-[#555] bg-white'
      }`}
    >
      <option value="customer">Customer</option>
      <option value="admin">Admin</option>
    </select>
  );
}

// ─── Orders Tab ────────────────────────────────────────────────────────────────

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'text-[#777]', icon: Clock },
  { value: 'processing', label: 'Processing', color: 'text-blue-600', icon: AlertCircle },
  { value: 'manufacturing', label: 'Manufacturing', color: 'text-[#265954]', icon: Factory },
  { value: 'dispatched', label: 'Dispatched', color: 'text-blue-600', icon: Truck },
  { value: 'delivered', label: 'Delivered', color: 'text-[#265954]', icon: CheckCircle },
  { value: 'cancelled', label: 'Cancelled', color: 'text-[#b00000]', icon: X },
];

const ADMIN_EDITABLE_STATUSES = [
  { value: 'processing', label: 'Processing' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

function OrdersTab({
  orders, loading, onStatusChange,
}: {
  orders: OrderRow[];
  loading: boolean;
  onStatusChange: (orderId: string, newStatus: string) => Promise<void>;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#777]">Loading orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 border border-[#dedede] rounded-lg">
        <ClipboardList size={32} className="text-[#dedede] mx-auto mb-3" />
        <p className="text-sm text-[#777]">No orders yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-black uppercase tracking-tight text-[#050505] mb-6">Order Management</h2>
      <div className="space-y-3">
        {orders.map((order) => {
          const isExpanded = expandedId === order.id;
          const cfg = ORDER_STATUSES.find((s) => s.value === order.status) ?? ORDER_STATUSES[0];
          const StatusIcon = cfg.icon;
          return (
            <div key={order.id} className="border border-[#dedede] rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-[#FAFAF8] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-[#265954]/10`}>
                    <StatusIcon size={16} className={cfg.color} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#050505]">{order.order_number}</p>
                    <p className="text-xs text-[#777]">
                      {order.customer_first_name} {order.customer_last_name} · {formatDate(order.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#050505]">{formatPrice(order.total)}</p>
                    <p className={`text-[10px] uppercase tracking-[0.15em] font-bold ${cfg.color}`}>{cfg.label}</p>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`text-[#999] transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-[#f0f0f0] p-5 bg-[#FAFAF8]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#999] font-semibold mb-3">Customer</p>
                      <p className="text-sm text-[#050505] font-semibold">{order.customer_first_name} {order.customer_last_name}</p>
                      <p className="text-sm text-[#555]">{order.customer_email}</p>
                      {order.customer_phone && <p className="text-sm text-[#555]">{order.customer_phone}</p>}
                      {order.customer_company && <p className="text-sm text-[#555]">{order.customer_company}</p>}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#999] font-semibold mb-3">Delivery</p>
                      <p className="text-sm text-[#050505] font-semibold capitalize">{order.delivery_method}</p>
                      <p className="text-sm text-[#555]">{order.payment_method === 'invoice' ? 'Pay by Invoice' : 'Paid Online'}</p>
                      <p className="text-xs text-[#999] mt-1">Payment: {order.payment_status}</p>
                    </div>
                  </div>

                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#999] font-semibold mb-3">Items</p>
                  <div className="space-y-2 mb-6">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4 text-sm border border-[#dedede] rounded-md px-4 py-3 bg-white">
                        <div>
                          <p className="font-semibold text-[#050505]">{item.product_name}</p>
                          <p className="text-xs text-[#777]">
                            {item.product_sku} · Qty {item.quantity}
                            {item.width && item.length ? ` · ${item.width}×${item.length}mm` : ''}
                          </p>
                        </div>
                        <p className="font-semibold text-[#050505]">{formatPrice(item.total_price)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-4 flex-wrap pt-4 border-t border-[#f0f0f0]">
                    <div className="flex items-center gap-3">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-[#999] font-semibold">Update Status</label>
                      <select
                        value={order.status}
                        onChange={(e) => onStatusChange(order.id, e.target.value)}
                        className="text-xs font-bold border border-[#dedede] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#265954]/10 bg-white"
                      >
                        <option value="pending">Pending</option>
                        {ADMIN_EDITABLE_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#999]">Subtotal: {formatPrice(order.subtotal)}</p>
                      <p className="text-xs text-[#999]">VAT: {formatPrice(order.vat_amount)}</p>
                      <p className="text-sm font-bold text-[#050505]">Total: {formatPrice(order.total)}</p>
                    </div>
                  </div>

                  {order.status_history.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#f0f0f0]">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#999] font-semibold mb-3">Status History</p>
                      <div className="space-y-2">
                        {[...order.status_history].reverse().map((event, i) => (
                          <div key={i} className="flex items-center gap-3 text-xs">
                            <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[#265954]' : 'bg-[#dedede]'}`} />
                            <span className="font-semibold text-[#050505] capitalize">{event.status}</span>
                            <span className="text-[#999]">{formatDate(event.timestamp)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Product Form Modal ────────────────────────────────────────────────────────

function ProductFormModal({
  product, onClose, onSaved,
}: {
  product: ProductWithRelations | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    sku: product?.sku ?? '',
    short_description: product?.short_description ?? '',
    description: product?.description ?? '',
    subcategory: product?.subcategory ?? 'fixed-rooflights',
    delivery_info: product?.delivery_info ?? '14 working day lead time. Please contact the office for delivery details.',
    warranty_years: product?.warranty_years ?? 5,
    is_featured: product?.is_featured ?? false,
    is_active: product?.is_active ?? true,
    tags: product?.tags?.join(', ') ?? '',
  });
  const [images, setImages] = useState(
    product?.product_images?.map((i) => ({ url: i.url, alt: i.alt, is_primary: i.is_primary, sort_order: i.sort_order })) ?? [
      { url: '', alt: '', is_primary: true, sort_order: 0 },
    ],
  );
  const [variants, setVariants] = useState(
    product?.product_variants?.map((v) => ({
      sku: v.sku, width: v.width, length: v.length, height: v.height,
      price: v.price, stock_level: v.stock_level, lead_time_days: v.lead_time_days, is_available: v.is_available,
    })) ?? [
      { sku: '', width: 0, length: 0, height: null as number | null, price: 0, stock_level: 0, lead_time_days: 14, is_available: true },
    ],
  );
  const [specs, setSpecs] = useState(
    product?.product_specifications?.map((s) => ({ key: s.key, value: s.value, sort_order: s.sort_order })) ?? [
      { key: '', value: '', sort_order: 0 },
    ],
  );

  const inputCls = 'w-full border border-[#dedede] rounded-md px-4 py-2.5 text-sm text-[#111] bg-white focus:outline-none focus:border-[#265954] focus:ring-2 focus:ring-[#265954]/10 transition-all';
  const labelCls = 'block text-[10px] uppercase tracking-[0.18em] text-[#777] mb-1.5 font-medium';

  function slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const slug = form.slug || slugify(form.name);
      if (!form.name || !form.sku || !slug) {
        setError('Name, SKU, and slug are required.');
        setSaving(false);
        return;
      }

      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
      const input = {
        slug,
        sku: form.sku,
        name: form.name,
        short_description: form.short_description,
        description: form.description,
        subcategory: form.subcategory,
        is_featured: form.is_featured,
        tags,
        delivery_info: form.delivery_info,
        warranty_years: form.warranty_years,
        is_active: form.is_active,
      };

      const cleanImages = images.filter((i) => i.url).map((i, idx) => ({ ...i, sort_order: idx }));
      const cleanVariants = variants.filter((v) => v.sku).map((v) => ({
        ...v,
        price: Number(v.price),
        width: Number(v.width),
        length: Number(v.length),
        stock_level: Number(v.stock_level),
        lead_time_days: Number(v.lead_time_days),
      }));
      const cleanSpecs = specs.filter((s) => s.key).map((s, idx) => ({ ...s, sort_order: idx }));

      if (product) {
        await updateProduct(product.id, input);
        await replaceProductImages(product.id, cleanImages);
        await replaceProductVariants(product.id, cleanVariants);
        await replaceProductSpecs(product.id, cleanSpecs);
      } else {
        const newId = await createProduct(input);
        await replaceProductImages(newId, cleanImages);
        await replaceProductVariants(newId, cleanVariants);
        await replaceProductSpecs(newId, cleanSpecs);
      }
      onSaved();
    } catch (err: any) {
      setError(err.message ?? 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-[#050505]/50 flex items-start justify-center overflow-y-auto p-4 md:p-8">
      <div className="bg-white rounded-lg w-full max-w-3xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#dedede] px-6 py-4 sticky top-0 bg-white rounded-t-lg z-10">
          <h2 className="text-lg font-black uppercase tracking-tight text-[#050505]">
            {product ? 'Edit Product' : 'New Product'}
          </h2>
          <button onClick={onClose} className="text-[#999] hover:text-[#050505] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6">
          {error && (
            <div className="bg-[#b00000]/10 border border-[#b00000]/20 rounded-md px-4 py-3 text-sm text-[#b00000]">
              {error}
            </div>
          )}

          {/* Basic info */}
          <section>
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#050505] mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelCls}>Product Name *</label>
                <input className={inputCls} value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: f.slug || slugify(e.target.value) }))}
                />
              </div>
              <div>
                <label className={labelCls}>SKU *</label>
                <input className={inputCls} value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Slug (URL) *</label>
                <input className={inputCls} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Short Description</label>
                <input className={inputCls} value={form.short_description} onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Full Description</label>
                <textarea className={inputCls} rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Delivery Info</label>
                <input className={inputCls} value={form.delivery_info} onChange={(e) => setForm((f) => ({ ...f, delivery_info: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Warranty (years)</label>
                <input type="number" className={inputCls} value={form.warranty_years} onChange={(e) => setForm((f) => ({ ...f, warranty_years: Number(e.target.value) }))} />
              </div>
              <div>
                <label className={labelCls}>Tags (comma-separated)</label>
                <input className={inputCls} value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="rooflight, fixed, 1000x1500" />
              </div>
              <div className="flex items-center gap-6 pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} className="w-4 h-4 accent-[#265954]" />
                  <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-[#555]">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-[#265954]" />
                  <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-[#555]">Active</span>
                </label>
              </div>
            </div>
          </section>

          {/* Images */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#050505]">Images</h3>
              <button
                onClick={() => setImages((prev) => [...prev, { url: '', alt: '', is_primary: false, sort_order: prev.length }])}
                className="flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] font-semibold text-[#265954] hover:text-[#3B8A82] transition-colors"
              >
                <Plus size={12} /> Add Image
              </button>
            </div>
            <div className="space-y-3">
              {images.map((img, idx) => (
                <div key={idx} className="flex gap-3 items-start border border-[#dedede] rounded-md p-3">
                  <div className="w-16 h-16 flex-shrink-0 bg-[#FAFAF8] border border-[#dedede] rounded overflow-hidden">
                    {img.url ? <img src={img.url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={16} className="text-[#dedede]" /></div>}
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input className={inputCls} placeholder="Image URL" value={img.url}
                      onChange={(e) => setImages((prev) => prev.map((im, i) => i === idx ? { ...im, url: e.target.value } : im))}
                    />
                    <input className={inputCls} placeholder="Alt text" value={img.alt}
                      onChange={(e) => setImages((prev) => prev.map((im, i) => i === idx ? { ...im, alt: e.target.value } : im))}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="primary-image" checked={img.is_primary}
                        onChange={() => setImages((prev) => prev.map((im, i) => ({ ...im, is_primary: i === idx })))}
                        className="w-3.5 h-3.5 accent-[#265954]"
                      />
                      <span className="text-[9px] uppercase tracking-[0.15em] text-[#777]">Primary</span>
                    </label>
                    {images.length > 1 && (
                      <button onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))} className="text-[#b00000] hover:text-[#050505]">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Variants */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#050505]">Pricing & Variants</h3>
              <button
                onClick={() => setVariants((prev) => [...prev, { sku: '', width: 0, length: 0, height: null, price: 0, stock_level: 0, lead_time_days: 14, is_available: true }])}
                className="flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] font-semibold text-[#265954] hover:text-[#3B8A82] transition-colors"
              >
                <Plus size={12} /> Add Variant
              </button>
            </div>
            <div className="space-y-3">
              {variants.map((v, idx) => (
                <div key={idx} className="grid grid-cols-2 sm:grid-cols-4 gap-2 border border-[#dedede] rounded-md p-3">
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.15em] text-[#999]">SKU</label>
                    <input className={inputCls} value={v.sku}
                      onChange={(e) => setVariants((prev) => prev.map((vv, i) => i === idx ? { ...vv, sku: e.target.value } : vv))}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.15em] text-[#999]">Width (mm)</label>
                    <input type="number" className={inputCls} value={v.width}
                      onChange={(e) => setVariants((prev) => prev.map((vv, i) => i === idx ? { ...vv, width: Number(e.target.value) } : vv))}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.15em] text-[#999]">Length (mm)</label>
                    <input type="number" className={inputCls} value={v.length}
                      onChange={(e) => setVariants((prev) => prev.map((vv, i) => i === idx ? { ...vv, length: Number(e.target.value) } : vv))}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.15em] text-[#999]">Price (pence)</label>
                    <input type="number" className={inputCls} value={v.price}
                      onChange={(e) => setVariants((prev) => prev.map((vv, i) => i === idx ? { ...vv, price: Number(e.target.value) } : vv))}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.15em] text-[#999]">Stock</label>
                    <input type="number" className={inputCls} value={v.stock_level}
                      onChange={(e) => setVariants((prev) => prev.map((vv, i) => i === idx ? { ...vv, stock_level: Number(e.target.value) } : vv))}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.15em] text-[#999]">Lead time (days)</label>
                    <input type="number" className={inputCls} value={v.lead_time_days}
                      onChange={(e) => setVariants((prev) => prev.map((vv, i) => i === idx ? { ...vv, lead_time_days: Number(e.target.value) } : vv))}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer pb-2.5">
                      <input type="checkbox" checked={v.is_available}
                        onChange={(e) => setVariants((prev) => prev.map((vv, i) => i === idx ? { ...vv, is_available: e.target.checked } : vv))}
                        className="w-4 h-4 accent-[#265954]"
                      />
                      <span className="text-[9px] uppercase tracking-[0.15em] text-[#777]">Available</span>
                    </label>
                  </div>
                  {variants.length > 1 && (
                    <div className="flex items-end pb-2">
                      <button onClick={() => setVariants((prev) => prev.filter((_, i) => i !== idx))} className="text-[#b00000] hover:text-[#050505]">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-[#999] mt-2">Price is in pence (e.g. 39500 = £395.00)</p>
          </section>

          {/* Specifications */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#050505]">Specifications</h3>
              <button
                onClick={() => setSpecs((prev) => [...prev, { key: '', value: '', sort_order: prev.length }])}
                className="flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] font-semibold text-[#265954] hover:text-[#3B8A82] transition-colors"
              >
                <Plus size={12} /> Add Spec
              </button>
            </div>
            <div className="space-y-2">
              {specs.map((s, idx) => (
                <div key={idx} className="flex gap-2">
                  <input className={`${inputCls} flex-[1]`} placeholder="Key (e.g. Outer)" value={s.key}
                    onChange={(e) => setSpecs((prev) => prev.map((sp, i) => i === idx ? { ...sp, key: e.target.value } : sp))}
                  />
                  <input className={`${inputCls} flex-[2]`} placeholder="Value" value={s.value}
                    onChange={(e) => setSpecs((prev) => prev.map((sp, i) => i === idx ? { ...sp, value: e.target.value } : sp))}
                  />
                  {specs.length > 1 && (
                    <button onClick={() => setSpecs((prev) => prev.filter((_, i) => i !== idx))} className="text-[#b00000] hover:text-[#050505] px-2">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#dedede] px-6 py-4 sticky bottom-0 bg-white rounded-b-lg">
          <button onClick={onClose} className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#777] hover:text-[#050505] px-4 py-2.5 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#265954] text-white text-[11px] uppercase tracking-[0.18em] font-semibold px-6 py-2.5 rounded-md hover:bg-[#3B8A82] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : <><Check size={14} /> Save Product</>}
          </button>
        </div>
      </div>
    </div>
  );
}
