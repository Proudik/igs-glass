'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { Cart, CartItem, Product, ProductVariant } from '@/lib/types';
import { formatPrice } from '@/lib/products';

const VAT_RATE = 0.2;

// ─── State ────────────────────────────────────────────────────────────────────

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; variant: ProductVariant; quantity: number }
  | { type: 'REMOVE_ITEM'; itemId: string }
  | { type: 'UPDATE_QUANTITY'; itemId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

const initialState: CartState = { items: [], isOpen: false };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (i) => i.productId === action.product.id && i.variantId === action.variant.id
      );
      if (existingIndex >= 0) {
        const items = [...state.items];
        const item = items[existingIndex];
        const newQty = item.quantity + action.quantity;
        items[existingIndex] = {
          ...item,
          quantity: newQty,
          totalPrice: item.unitPrice * newQty,
        };
        return { ...state, items };
      }
      const newItem: CartItem = {
        id: `${action.product.id}_${action.variant.id}_${Date.now()}`,
        productId: action.product.id,
        variantId: action.variant.id,
        product: action.product,
        variant: action.variant,
        quantity: action.quantity,
        unitPrice: action.variant.price,
        totalPrice: action.variant.price * action.quantity,
      };
      return { ...state, items: [...state.items, newItem] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.itemId) };
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== action.itemId) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.itemId
            ? { ...i, quantity: action.quantity, totalPrice: i.unitPrice * action.quantity }
            : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  vatAmount: number;
  total: number;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  formatCartPrice: (pence: number) => string;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const subtotal = state.items.reduce((sum, i) => sum + i.totalPrice, 0);
  const vatAmount = Math.round(subtotal * VAT_RATE);
  const total = subtotal + vatAmount;
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  const addItem = useCallback(
    (product: Product, variant: ProductVariant, quantity = 1) => {
      dispatch({ type: 'ADD_ITEM', product, variant, quantity });
      dispatch({ type: 'OPEN_CART' });
    },
    []
  );

  const removeItem = useCallback((itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', itemId });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', itemId, quantity });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), []);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        itemCount,
        subtotal,
        vatAmount,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        formatCartPrice: formatPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
