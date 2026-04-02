const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('jwt_token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorJson.error || errorText;
        } catch {
            errorMessage = errorText;
        }
        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

// Auth functions
export const login = async (email, password) => {
    const data = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
        localStorage.setItem('jwt_token', data.token);
    }
    
    return data;
};

export const register = async (userData) => {
    // Pour l'instant, on retire la photo de profil car le backend attend du JSON
    // On utilisera la photo par défaut du backend
    const { profile_picture, confirm_password, ...dataToSend } = userData;
    
    const data = await apiFetch('/register', {
        method: 'POST',
        body: JSON.stringify(dataToSend),
    });
    
    return data;
};

export const logout = () => {
    localStorage.removeItem('jwt_token');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('jwt_token');
};

export const getCurrentUser = async () => {
    return apiFetch('/users/me');
};

// Services functions
export const getServices = async ({ categoryId = null, status = null } = {}) => {
    const params = new URLSearchParams();
    if (categoryId) params.set('category', categoryId);
    if (status) params.set('status', status);
    const query = params.toString();
    const endpoint = query ? `/services?${query}` : '/services';
    return apiFetch(endpoint);
};

export const getService = async (id) => {
    return apiFetch(`/services/${id}`);
};

export const getMyServices = async () => {
    return apiFetch('/services?my=true');
};

export const getCategories = async () => {
    return apiFetch('/categories');
};

export const deleteService = async (id) => {
    return apiFetch(`/services/${id}`, {
        method: 'DELETE',
    });
};

export const createService = async (serviceData) => {
    return apiFetch('/services', {
        method: 'POST',
        body: JSON.stringify(serviceData),
    });
};

export const completeService = async (serviceId) => {
    return apiFetch(`/services/${serviceId}/complete`, {
        method: 'PATCH',
    });
};

export const archiveService = async (serviceId) => {
    return apiFetch(`/services/${serviceId}/archive`, {
        method: 'PATCH',
    });
};

export const createProposal = async (serviceId, proposalData) => {
    return apiFetch(`/services/${serviceId}/proposals`, {
        method: 'POST',
        body: JSON.stringify(proposalData),
    });
};

export const acceptProposal = async (proposalId) => {
    return apiFetch(`/proposals/${proposalId}/accept`, {
        method: 'PATCH',
    });
};

export const rejectProposal = async (proposalId) => {
    return apiFetch(`/proposals/${proposalId}`, {
        method: 'DELETE',
    });
};
