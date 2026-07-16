// ─── Product Domain ───────────────────────────────────────────────────────────

export type ProductCategory = 'rooflights' | 'skylights' | 'flat-glass' | 'structural-glass';

export type GlassType =
  | 'double-glazed'
  | 'triple-glazed'
  | 'laminated'
  | 'toughened'
  | 'self-cleaning'
  | 'low-e';

export type FrameFinish = 'mill-finish' | 'white-ral9016' | 'black-ral9005' | 'anthracite-ral7016' | 'custom-ral';

export interface ProductDimension {
  width: number;   // mm
  length: number;  // mm
  height?: number; // mm
  weight?: number; // kg
}

export interface ProductSpecification {
  key: string;
  value: string;
  unit?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  dimensions: ProductDimension;
  price: number;         // pence
  compareAtPrice?: number;
  stockLevel: number;
  leadTimeDays: number;
  isAvailable: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortDescription: string;
  description: string;
  category: ProductCategory;
  subcategory?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  features: string[];
  glassType: GlassType[];
  frameFinish: FrameFinish[];
  certifications: string[];
  uValue?: number;
  isConfigurable: boolean;
  isFeatured?: boolean;
  tags: string[];
  deliveryInfo: string;
  warrantyYears: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Cart Domain ──────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  vatAmount: number;
  deliveryAmount: number;
  total: number;
  itemCount: number;
  userId?: string;
  sessionId?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Address Domain ───────────────────────────────────────────────────────────

export interface Address {
  id?: string;
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
  isDefault?: boolean;
}

// ─── Order Domain ─────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'awaiting_payment'
  | 'processing'
  | 'manufacturing'
  | 'ready_for_collection'
  | 'dispatched'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 'stripe' | 'invoice' | 'bacs';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type DeliveryMethod = 'collection' | 'delivery';

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  productSku: string;
  dimensions: ProductDimension;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
  };
  billingAddress: Address;
  deliveryAddress?: Address;
  deliveryMethod: DeliveryMethod;
  items: OrderItem[];
  subtotal: number;
  vatAmount: number;
  deliveryAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  notes?: string;
  userId?: string;
  sessionId?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── User / Auth Domain ───────────────────────────────────────────────────────

export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  role: UserRole;
  addresses: Address[];
  createdAt: string;
  lastSignInAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Checkout Domain ──────────────────────────────────────────────────────────

export type CheckoutStep = 'details' | 'delivery' | 'payment' | 'confirmation';
export type CheckoutMode = 'guest' | 'signin' | 'register';

export interface CheckoutCustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
}

export interface CheckoutDelivery {
  method: DeliveryMethod;
  billingAddress: Address;
  deliveryAddress?: Address;
  sameAsBilling: boolean;
}

export interface CheckoutPayment {
  method: PaymentMethod;
  stripePaymentIntentId?: string;
}

export interface CheckoutState {
  step: CheckoutStep;
  mode: CheckoutMode;
  customer: Partial<CheckoutCustomerDetails>;
  delivery: Partial<CheckoutDelivery>;
  payment: Partial<CheckoutPayment>;
}

// ─── Email Notifications (Interface only — not implemented) ───────────────────

export interface EmailNotificationPayload {
  to: string;
  orderNumber: string;
  customerName: string;
}

export interface OrderConfirmationPayload extends EmailNotificationPayload {
  items: OrderItem[];
  total: number;
  deliveryMethod: DeliveryMethod;
}

export interface InvoiceRequestPayload extends EmailNotificationPayload {
  items: OrderItem[];
  total: number;
  company?: string;
}

// ─── Cookie Consent ───────────────────────────────────────────────────────────

export interface CookieConsent {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  consentGiven: boolean;
  timestamp: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
