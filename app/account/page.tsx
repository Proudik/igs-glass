'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User, Package, MapPin, LogOut, ChevronRight, Clock,
  Truck, CheckCircle, XCircle, Factory, AlertCircle,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { fetchUserOrders, type OrderRow } from '@/lib/product-service';

// ─── Order helpers (real data from DB) ────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', color: 'text-[#777]', icon: Clock },
  processing: { label: 'Processing', color: 'text-blue-600', icon: AlertCircle },
  manufacturing: { label: 'Manufacturing', color: 'text-[#265954]', icon: Factory },
  dispatched: { label: 'Dispatched', color: 'text-blue-600', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-[#265954]', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-[#b00000]', icon: XCircle },
};

const ORDER_STEPS: { status: string; label: string }[] = [
  { status: 'pending', label: 'Order Placed' },
  { status: 'processing', label: 'Processing' },
  { status: 'manufacturing', label: 'Manufacturing' },
  { status: 'dispatched', label: 'Dispatched' },
  { status: 'delivered', label: 'Delivered' },
];

function OrderStatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] font-bold ${cfg.color}`}>
      <Icon size={12} />
      {cfg.label}
    </span>
  );
}

function OrderTracker({ status }: { status: string }) {
  const currentIdx = ORDER_STEPS.findIndex((s) => s.status === status);
  return (
    <div className="mt-4 pt-4 border-t border-[#f0f0f0]">
      <p className="text-[9px] uppercase tracking-[0.2em] text-[#999] mb-3 font-medium">Order Progress</p>
      <div className="flex items-center gap-0 overflow-x-auto pb-2">
        {ORDER_STEPS.map((step, i) => (
          <div key={step.status} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                i < currentIdx ? 'bg-[#265954] border-[#265954]' :
                i === currentIdx ? 'border-[#265954] bg-white' :
                'border-[#dedede] bg-white'
              }`}>
                {i < currentIdx && <CheckCircle size={8} className="text-white" />}
                {i === currentIdx && <div className="w-1.5 h-1.5 bg-[#265954] rounded-full" />}
              </div>
              <span className={`text-[8px] uppercase tracking-[0.08em] text-center max-w-[60px] leading-tight ${
                i <= currentIdx ? 'text-[#050505]' : 'text-[#ccc]'
              }`}>
                {step.label}
              </span>
            </div>
            {i < ORDER_STEPS.length - 1 && (
              <div className={`h-[2px] w-8 mx-1 -mt-4 ${i < currentIdx ? 'bg-[#265954]' : 'bg-[#dedede]'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

type AccountSection = 'overview' | 'orders' | 'addresses' | 'profile';

type AdminSection = AccountSection | 'admin';

export default function AccountPage() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [section, setSection] = useState<AdminSection>('overview');
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setOrdersLoading(true);
    fetchUserOrders(user.id)
      .then((data) => { if (!cancelled) setOrders(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setOrdersLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  if (isLoading) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#777]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="pt-[72px] min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <User size={40} className="text-[#dedede]" />
        <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#777]">Please sign in to access your account</p>
        <div className="flex gap-3">
          <Link href="/sign-in" className="bg-[#265954] text-white text-[11px] uppercase tracking-[0.2em] font-semibold px-5 py-3 rounded-md hover:bg-[#3B8A82] transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="border border-[#265954] text-[#265954] text-[11px] uppercase tracking-[0.2em] font-semibold px-5 py-3 rounded-md hover:bg-[#265954] hover:text-white transition-colors">
            Register
          </Link>
        </div>
      </div>
    );
  }

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  const nav: { key: AdminSection; label: string; icon: typeof User }[] = [
    { key: 'overview', label: 'Overview', icon: User },
    { key: 'orders', label: 'Orders', icon: Package },
    { key: 'addresses', label: 'Addresses', icon: MapPin },
    { key: 'profile', label: 'Profile', icon: User },
    ...(isAdmin ? [{ key: 'admin' as AdminSection, label: 'Admin Panel', icon: Shield }] : []),
  ];

  return (
    <div className="pt-[72px] min-h-screen">
      {/* Header */}
      <div className="border-b border-[#dedede] px-6 md:px-14 py-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#b00000] mb-1 font-semibold">My Account</p>
        <h1 className="font-display text-[clamp(32px,5vw,52px)] text-[#050505] leading-none">
          WELCOME, {user?.firstName?.toUpperCase()}
        </h1>
        {user?.role === 'admin' && (
          <span className="inline-flex items-center gap-1.5 mt-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#265954] bg-[#265954]/10 px-3 py-1 rounded-full">
            <Shield size={12} /> Administrator
          </span>
        )}
        {user?.lastSignInAt && (
          <p className="text-xs text-[#999] mt-2 flex items-center gap-1.5">
            <Clock size={12} /> Last signed in: {new Date(user.lastSignInAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <nav className="border-b lg:border-b-0 lg:border-r border-[#dedede] bg-white">
          <ul className="lg:pt-6">
            {nav.map(({ key, label, icon: Icon }) => (
              <li key={key}>
                <button
                  onClick={() => setSection(key)}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-[11px] uppercase tracking-[0.18em] font-semibold transition-colors text-left ${
                    section === key
                      ? 'text-[#050505] bg-[#FAFAF8] border-l-2 border-[#b00000]'
                      : 'text-[#777] hover:text-[#050505] hover:bg-[#FAFAF8]'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              </li>
            ))}
            <li className="mt-4 border-t border-[#dedede]">
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
          <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {section === 'overview' && <OverviewSection user={user} orders={orders} loading={ordersLoading} />}
            {section === 'orders' && <OrdersSection orders={orders} loading={ordersLoading} />}
            {section === 'addresses' && <AddressesSection user={user} />}
            {section === 'profile' && <ProfileSection user={user} />}
            {section === 'admin' && isAdmin && (
              <div className="text-center py-12">
                <Shield size={40} className="text-[#265954] mx-auto mb-4" />
                <h2 className="text-xl font-black uppercase tracking-tight text-[#050505] mb-3">Admin Dashboard</h2>
                <p className="text-sm text-[#777] mb-6 max-w-md mx-auto">Manage products, view users, and assign roles from the admin dashboard.</p>
                <Link href="/admin" className="inline-flex items-center gap-2 bg-[#265954] text-white text-[11px] uppercase tracking-[0.2em] font-semibold px-6 py-3 rounded-md hover:bg-[#3B8A82] transition-colors">
                  Go to Admin Dashboard <ChevronRight size={14} />
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function OverviewSection({ user, orders, loading }: { user: any; orders: OrderRow[]; loading: boolean }) {
  const formatPrice = (p: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(p / 100);
  return (
    <div>
      <h2 className="text-xl font-black uppercase tracking-tight text-[#050505] mb-6">Account Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="border border-[#dedede] rounded-lg p-5 bg-[#FAFAF8]">
          <p className="text-[9px] uppercase tracking-[0.2em] text-[#777] mb-2">Total Orders</p>
          <p className="text-3xl font-black text-[#050505]">{loading ? '—' : orders.length}</p>
        </div>
        <div className="border border-[#dedede] rounded-lg p-5 bg-[#FAFAF8]">
          <p className="text-[9px] uppercase tracking-[0.2em] text-[#777] mb-2">Active Orders</p>
          <p className="text-3xl font-black text-[#265954]">{loading ? '—' : orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length}</p>
        </div>
        <div className="border border-[#dedede] rounded-lg p-5 bg-[#FAFAF8]">
          <p className="text-[9px] uppercase tracking-[0.2em] text-[#777] mb-2">Saved Addresses</p>
          <p className="text-3xl font-black text-[#050505]">{user?.addresses?.length ?? 0}</p>
        </div>
      </div>

      <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#050505] font-bold mb-4">Recent Orders</h3>
      <div className="space-y-3">
        {orders.slice(0, 2).map((order) => (
          <div key={order.id} className="border border-[#dedede] rounded-lg p-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <p className="text-sm font-bold text-[#050505]">{order.order_number}</p>
                <p className="text-xs text-[#777]">{new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="text-right">
                <OrderStatusBadge status={order.status} />
                <p className="text-sm font-bold text-[#050505] mt-1">{formatPrice(order.total)}</p>
              </div>
            </div>
            <OrderTracker status={order.status} />
          </div>
        ))}
        {!loading && orders.length === 0 && (
          <div className="text-center py-8 border border-[#dedede] rounded-lg">
            <Package size={28} className="text-[#dedede] mx-auto mb-2" />
            <p className="text-sm text-[#777]">No orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function OrdersSection({ orders, loading }: { orders: OrderRow[]; loading: boolean }) {
  const formatPrice = (p: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(p / 100);

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-black uppercase tracking-tight text-[#050505] mb-6">Order History</h2>
        <div className="text-center py-12 border border-[#dedede] rounded-lg">
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#777]">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-black uppercase tracking-tight text-[#050505] mb-6">Order History</h2>
      {orders.length === 0 ? (
        <div className="text-center py-12 border border-[#dedede] rounded-lg">
          <Package size={32} className="text-[#dedede] mx-auto mb-3" />
          <p className="text-sm text-[#777]">No orders yet.</p>
          <Link href="/marketplace" className="mt-3 inline-block text-[11px] uppercase tracking-[0.18em] text-[#b00000] hover:underline font-semibold">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-[#dedede] rounded-lg overflow-hidden">
              <div className="p-5 border-b border-[#dedede] flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#050505] mb-0.5">{order.order_number}</p>
                  <p className="text-xs text-[#777]">{new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <OrderStatusBadge status={order.status} />
                  <p className="text-base font-bold text-[#050505] mt-1">{formatPrice(order.total)}</p>
                </div>
              </div>
              <div className="p-5">
                <div className="space-y-2 mb-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm text-[#555]">
                      <span>{item.product_name} × {item.quantity}</span>
                      <span>{formatPrice(item.total_price)}</span>
                    </div>
                  ))}
                </div>
                <OrderTracker status={order.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressesSection({ user }: { user: any }) {
  return (
    <div>
      <h2 className="text-xl font-black uppercase tracking-tight text-[#050505] mb-6">Saved Addresses</h2>
      {!user?.addresses?.length ? (
        <div className="text-center py-12 border border-[#dedede] rounded-lg">
          <MapPin size={32} className="text-[#dedede] mx-auto mb-3" />
          <p className="text-sm text-[#777] mb-4">No saved addresses yet.</p>
          <p className="text-xs text-[#999]">Addresses will be saved after your first order.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {user.addresses.map((addr: any) => (
            <div key={addr.id} className="border border-[#dedede] rounded-lg p-5">
              <p className="text-sm text-[#333]">{addr.line1}</p>
              {addr.line2 && <p className="text-sm text-[#333]">{addr.line2}</p>}
              <p className="text-sm text-[#333]">{addr.city}</p>
              <p className="text-sm text-[#333]">{addr.postcode}</p>
              <p className="text-sm text-[#333]">{addr.country}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileSection({ user }: { user: any }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    company: user?.company ?? '',
    phone: user?.phone ?? '',
  });

  const inputCls = 'w-full border border-[#dedede] rounded-md px-4 py-3 text-[15px] text-[#111] bg-white placeholder:text-[#bbb] focus:outline-none focus:border-[#265954] focus:ring-2 focus:ring-[#265954]/10 transition-all disabled:bg-[#FAFAF8] disabled:text-[#777]';
  const labelCls = 'block text-[11px] uppercase tracking-[0.18em] text-[#777] mb-1.5 font-medium';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black uppercase tracking-tight text-[#050505]">Profile</h2>
        <button
          onClick={() => setEditing((v) => !v)}
          className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#b00000] hover:text-[#050505] transition-colors"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="max-w-lg border border-[#dedede] rounded-lg p-6 bg-[#FAFAF8]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>First Name</label>
            <input
              className={inputCls}
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              disabled={!editing}
            />
          </div>
          <div>
            <label className={labelCls}>Last Name</label>
            <input
              className={inputCls}
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              disabled={!editing}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Email</label>
            <input
              className={inputCls}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              disabled={!editing}
            />
          </div>
          <div>
            <label className={labelCls}>Company</label>
            <input
              className={inputCls}
              value={form.company}
              placeholder="—"
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              disabled={!editing}
            />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input
              className={inputCls}
              value={form.phone}
              placeholder="—"
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              disabled={!editing}
            />
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-[#dedede]">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#777] mb-1 font-medium">Member Since</p>
          <p className="text-sm text-[#333]">{new Date(user?.createdAt ?? '').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
        </div>

        {editing && (
          <button
            onClick={() => setEditing(false)}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-[#265954] text-white text-[11px] uppercase tracking-[0.2em] font-semibold py-4 rounded-md hover:bg-[#3B8A82] transition-colors"
          >
            Save Changes
          </button>
        )}
      </div>

      {!editing && (
        <p className="mt-4 text-xs text-[#999]">To update your profile details, click Edit above or contact our team at <a href="mailto:accounts@igs-glass.co.uk" className="text-[#b00000] hover:underline">accounts@igs-glass.co.uk</a></p>
      )}
    </div>
  );
}
