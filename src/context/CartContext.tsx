'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Item } from '@/types';

export interface CartItem {
  id: string; // unique ID for cart item
  item: Item;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  notes: string;
  type?: 'dineIn' | 'takeaway';
  tableNum?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Item) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
  setIsOpen: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('catalog_cart');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('catalog_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: `cart_${Date.now()}_${Math.random().toString(36).substring(2)}`, item, quantity: 1 }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) => prev.map((i) => i.id === cartItemId ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => {
    const price = parseFloat(i.item.price || '0');
    return sum + (isNaN(price) ? 0 : price) * i.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isOpen, setIsOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
