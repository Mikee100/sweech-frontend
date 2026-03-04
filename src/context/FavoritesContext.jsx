import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

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
                const response = await fetch('http://localhost:5000/api/users/favourites', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setFavourites(data);
                } else {
                    console.error('Failed to load favourites', data);
                }
            } catch (error) {
                console.error('Error loading favourites', error);
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
            let response;
            if (isFavourite(product._id)) {
                response = await fetch(
                    `http://localhost:5000/api/users/favourites/${product._id}`,
                    {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );
            } else {
                response = await fetch('http://localhost:5000/api/users/favourites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({ productId: product._id }),
                });
            }

            const data = await response.json();
            if (response.ok) {
                setFavourites(data);
            } else {
                console.error('Failed to update favourites', data);
            }
        } catch (error) {
            console.error('Error updating favourites', error);
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

