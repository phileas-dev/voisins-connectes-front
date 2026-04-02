import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser, isAuthenticated as checkAuth } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('jwt_token') || null);
    const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    const userData = await getCurrentUser();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, [token]);

    const login = async (email, password) => {
        const data = await apiLogin(email, password);
        setToken(data.token);
        setIsAuthenticated(true);
        
        // Charger immédiatement les données utilisateur
        try {
            const userData = await getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error('Failed to fetch user after login:', error);
        }
        
        return data;
    };

    const logout = () => {
        apiLogout();
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const refreshUser = async () => {
        if (isAuthenticated) {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Failed to refresh user:', error);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ 
            token, 
            isAuthenticated, 
            user, 
            loading,
            login, 
            logout,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
