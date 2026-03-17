import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '../utils/apiClient';

const CartContext = createContext();
const MAX_PER_ITEM = 10;

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);

    // Load account-linked cart when user logs in
    useEffect(() => {
        const loadAccountCart = async () => {
            if (!user) return;

            try {
                const data = await apiFetch(`${import.meta.env.VITE_API_URL}/api/users/cart`);
                if (Array.isArray(data.items)) {
                    setCart(data.items);
                }
            } catch {
                // fail silently; fallback to local cart
            }
        };

        loadAccountCart();
    }, [user]);

    // Persist cart to backend when authenticated
    useEffect(() => {
        const syncAccountCart = async () => {
            if (!user) return;

            try {
                const payload = {
                    items: cart.map((item) => ({
                        productId: item._id,
                        quantity: item.quantity,
                    })),
                };

                await apiFetch(`${import.meta.env.VITE_API_URL}/api/users/cart`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
            } catch {
                // ignore sync failures on the client
            }
        };

        syncAccountCart();
    }, [cart, user]);

    const addToCart = (product, quantity = 1) => {
        if (!product) return;
        const safeIncomingQty = Math.max(1, quantity);
        const maxAllowedFromStock =
            typeof product.stock === 'number' && product.stock > 0
                ? product.stock
                : MAX_PER_ITEM;

        setCart((prevCart) => {
            const existing = prevCart.find((item) => item._id === product._id);

            if (existing) {
                const targetQty = Math.min(
                    existing.quantity + safeIncomingQty,
                    Math.min(maxAllowedFromStock, MAX_PER_ITEM)
                );

                return prevCart.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: targetQty }
                        : item
                );
            }

            const initialQty = Math.min(safeIncomingQty, Math.min(maxAllowedFromStock, MAX_PER_ITEM));
            return [...prevCart, { ...product, quantity: initialQty }];
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item._id !== productId) return item;

                const maxFromStock =
                    typeof item.stock === 'number' && item.stock > 0
                        ? item.stock
                        : MAX_PER_ITEM;
                const clampedQty = Math.min(quantity, Math.min(maxFromStock, MAX_PER_ITEM));

                return { ...item, quantity: clampedQty };
            })
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};
