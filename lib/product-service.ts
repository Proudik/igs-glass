'use client';

import { supabase } from '@/lib/supabase';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  width: number;
  length: number;
  height: number | null;
  price: number;
  stock_level: number;
  lead_time_days: number;
  is_available: boolean;
}

export interface ProductSpecification {
  id: string;
  key: string;
  value: string;
  sort_order: number;
}

export interface ProductWithRelations {
  id: string;
  slug: string;
  sku: string;
  name: string;
  short_description: string;
  description: string;
  category: string;
  subcategory: string | null;
  is_featured: boolean;
  tags: string[];
  delivery_info: string;
  warranty_years: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_images: ProductImage[];
  product_variants: ProductVariant[];
  product_specifications: ProductSpecification[];
}

const PRODUCT_SELECT = `
  id, slug, sku, name, short_description, description, category, subcategory,
  is_featured, tags, delivery_info, warranty_years, is_active, created_at, updated_at,
  product_images (id, url, alt, is_primary, sort_order),
  product_variants (id, sku, width, length, height, price, stock_level, lead_time_days, is_available),
  product_specifications (id, key, value, sort_order)
`;

export async function fetchActiveRooflights(): Promise<ProductWithRelations[]> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('category', 'rooflights')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as ProductWithRelations[];
}

export async function fetchAllRooflightsAdmin(): Promise<ProductWithRelations[]> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('category', 'rooflights')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as ProductWithRelations[];
}

export async function fetchRooflightBySlug(slug: string): Promise<ProductWithRelations | null> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data as ProductWithRelations | null;
}

export interface ProductInput {
  slug: string;
  sku: string;
  name: string;
  short_description: string;
  description: string;
  subcategory: string | null;
  is_featured: boolean;
  tags: string[];
  delivery_info: string;
  warranty_years: number;
  is_active: boolean;
}

export async function createProduct(input: ProductInput): Promise<string> {
  const { data, error } = await supabase
    .from('products')
    .insert({
      slug: input.slug,
      sku: input.sku,
      name: input.name,
      short_description: input.short_description,
      description: input.description,
      category: 'rooflights',
      subcategory: input.subcategory,
      is_featured: input.is_featured,
      tags: input.tags,
      delivery_info: input.delivery_info,
      warranty_years: input.warranty_years,
      is_active: input.is_active,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({
      slug: input.slug,
      sku: input.sku,
      name: input.name,
      short_description: input.short_description,
      description: input.description,
      subcategory: input.subcategory,
      is_featured: input.is_featured,
      tags: input.tags,
      delivery_info: input.delivery_info,
      warranty_years: input.warranty_years,
      is_active: input.is_active,
    })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function replaceProductImages(
  productId: string,
  images: { url: string; alt: string; is_primary: boolean; sort_order: number }[],
): Promise<void> {
  await supabase.from('product_images').delete().eq('product_id', productId);
  if (images.length > 0) {
    const { error } = await supabase
      .from('product_images')
      .insert(images.map((img) => ({ ...img, product_id: productId })));
    if (error) throw error;
  }
}

export async function replaceProductVariants(
  productId: string,
  variants: { sku: string; width: number; length: number; height: number | null; price: number; stock_level: number; lead_time_days: number; is_available: boolean }[],
): Promise<void> {
  await supabase.from('product_variants').delete().eq('product_id', productId);
  if (variants.length > 0) {
    const { error } = await supabase
      .from('product_variants')
      .insert(variants.map((v) => ({ ...v, product_id: productId })));
    if (error) throw error;
  }
}

export async function replaceProductSpecs(
  productId: string,
  specs: { key: string; value: string; sort_order: number }[],
): Promise<void> {
  await supabase.from('product_specifications').delete().eq('product_id', productId);
  if (specs.length > 0) {
    const { error } = await supabase
      .from('product_specifications')
      .insert(specs.map((s) => ({ ...s, product_id: productId })));
    if (error) throw error;
  }
}

import type { Product, ProductVariant as TypedVariant, ProductSpecification as TypedSpec, ProductCategory, GlassType, FrameFinish } from '@/lib/types';

function mapDbProductToProduct(p: ProductWithRelations): Product {
  return {
    id: p.id,
    slug: p.slug,
    sku: p.sku,
    name: p.name,
    shortDescription: p.short_description,
    description: p.description,
    category: (p.category ?? 'rooflights') as ProductCategory,
    subcategory: p.subcategory ?? undefined,
    images: p.product_images.map((i) => ({
      id: i.id,
      url: i.url,
      alt: i.alt,
      isPrimary: i.is_primary,
    })),
    variants: p.product_variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      dimensions: { width: v.width, length: v.length },
      price: v.price,
      stockLevel: v.stock_level,
      leadTimeDays: v.lead_time_days,
      isAvailable: v.is_available,
    })),
    specifications: p.product_specifications.map((s) => ({
      key: s.key,
      value: s.value,
    })),
    features: [],
    glassType: [] as GlassType[],
    frameFinish: [] as FrameFinish[],
    certifications: [],
    uValue: undefined,
    isConfigurable: false,
    isFeatured: p.is_featured,
    tags: p.tags,
    deliveryInfo: p.delivery_info,
    warrantyYears: p.warranty_years,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

export function mapDbToProduct(p: ProductWithRelations): Product {
  return mapDbProductToProduct(p);
}

export async function fetchActiveRooflightProducts(): Promise<Product[]> {
  const data = await fetchActiveRooflights();
  return data.map(mapDbProductToProduct);
}

export async function fetchRooflightProductBySlug(slug: string): Promise<Product | null> {
  const data = await fetchRooflightBySlug(slug);
  if (!data) return null;
  return mapDbProductToProduct(data);
}

export interface ProfileRow {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company: string | null;
  phone: string | null;
  role: string;
  last_sign_in_at: string | null;
  created_at: string;
}

export async function fetchAllProfiles(): Promise<ProfileRow[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name, company, phone, role, last_sign_in_at, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as ProfileRow[];
}

export async function updateUserRole(userId: string, role: string): Promise<void> {
  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
  if (error) throw error;
}

// ─── Orders ────────────────────────────────────────────────────────────────────

export interface OrderRow {
  id: string;
  order_number: string;
  status: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  customer_company: string | null;
  delivery_method: string;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  vat_amount: number;
  delivery_amount: number;
  total: number;
  notes: string | null;
  status_history: { status: string; timestamp: string; note?: string }[];
  created_at: string;
  updated_at: string;
  order_items: OrderItemRow[];
}

export interface OrderItemRow {
  id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  width: number | null;
  length: number | null;
}

const ORDER_SELECT = `
  id, order_number, status,
  customer_first_name, customer_last_name, customer_email, customer_phone, customer_company,
  delivery_method, payment_method, payment_status,
  subtotal, vat_amount, delivery_amount, total, notes,
  status_history, created_at, updated_at,
  order_items (id, product_name, product_sku, quantity, unit_price, total_price, width, length)
`;

export async function fetchAllOrdersAdmin(): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as OrderRow[];
}

export async function fetchUserOrders(userId: string): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as OrderRow[];
}

export interface CreateOrderInput {
  orderNumber: string;
  userId: string | null;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
  };
  billing: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
    country: string;
  };
  delivery: {
    method: 'collection' | 'delivery';
    line1?: string;
    line2?: string;
    city?: string;
    postcode?: string;
    country?: string;
  };
  paymentMethod: 'online' | 'invoice';
  subtotal: number;
  vatAmount: number;
  deliveryAmount: number;
  total: number;
  items: {
    productId: string | null;
    productName: string;
    productSku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    width?: number;
    length?: number;
  }[];
}

export async function createOrder(input: CreateOrderInput): Promise<string> {
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: input.orderNumber,
      user_id: input.userId,
      status: 'pending',
      customer_first_name: input.customer.firstName,
      customer_last_name: input.customer.lastName,
      customer_email: input.customer.email,
      customer_phone: input.customer.phone,
      customer_company: input.customer.company ?? null,
      billing_line1: input.billing.line1,
      billing_line2: input.billing.line2 ?? null,
      billing_city: input.billing.city,
      billing_postcode: input.billing.postcode,
      billing_country: input.billing.country,
      delivery_method: input.delivery.method,
      delivery_line1: input.delivery.line1 ?? null,
      delivery_line2: input.delivery.line2 ?? null,
      delivery_city: input.delivery.city ?? null,
      delivery_postcode: input.delivery.postcode ?? null,
      delivery_country: input.delivery.country ?? null,
      payment_method: input.paymentMethod,
      payment_status: input.paymentMethod === 'online' ? 'paid' : 'pending',
      subtotal: input.subtotal,
      vat_amount: input.vatAmount,
      delivery_amount: input.deliveryAmount,
      total: input.total,
      status_history: [{ status: 'pending', timestamp: new Date().toISOString(), note: 'Order placed' }],
    })
    .select('id')
    .single();

  if (orderError) throw orderError;

  const orderId = orderData.id;

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(
      input.items.map((item) => ({
        order_id: orderId,
        product_id: item.productId,
        product_name: item.productName,
        product_sku: item.productSku,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.totalPrice,
        width: item.width ?? null,
        length: item.length ?? null,
      })),
    );

  if (itemsError) throw itemsError;

  return orderId;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: string,
): Promise<{
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  newStatus: string;
}> {
  const { data, error } = await supabase.rpc('update_order_status', {
    p_order_id: orderId,
    p_new_status: newStatus,
  });

  if (error) throw error;
  return {
    orderNumber: data.order_number,
    customerEmail: data.customer_email,
    customerName: data.customer_name,
    newStatus: data.new_status,
  };
}
