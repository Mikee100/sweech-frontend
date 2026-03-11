import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch, ApiError } from '../utils/apiClient';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
    const { user } = useAuth();
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFavourites = async () => {
            if (!user) {
                setFavourites([]);
                return;
            }

            setLoading(true);
            try {
                const data = await apiFetch(`${import.meta.env.VITE_API_URL}/api/users/favourites`);
                setFavourites(data);
            } catch (error) {
                if (error instanceof ApiError) {
                    console.error('Failed to load favourites', error.message);
                } else {
                    console.error('Error loading favourites', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchFavourites();
    }, [user]);

    const isFavourite = (productId) =>
        favourites.some((product) => product._id === productId);

    const toggleFavourite = async (product) => {
        if (!user) {
            return;
        }

        try {
            let data;
            if (isFavourite(product._id)) {
                data = await apiFetch(
                    `${import.meta.env.VITE_API_URL}/api/users/favourites/${product._id}`,
                    {
                        method: 'DELETE',
                    }
                );
            } else {
                data = await apiFetch(`${import.meta.env.VITE_API_URL}/api/users/favourites`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productId: product._id }),
                });
            }

            setFavourites(data);
        } catch (error) {
            if (error instanceof ApiError) {
                console.error('Failed to update favourites', error.message);
            } else {
                console.error('Error updating favourites', error);
            }
        }
    };

    return (
        <FavoritesContext.Provider
            value={{
                favourites,
                favouritesLoading: loading,
                isFavourite,
                toggleFavourite,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
};

