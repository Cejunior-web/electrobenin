// ==========================================
// CONFIGURATION API ELECTROBENIN
// ==========================================


const API_URL = 'https://electrobenin-backend.vercel.app/api';
// ==========================================
// HELPERS
// ==========================================

// Récupérer le token depuis localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Sauvegarder le token
function saveToken(token) {
    localStorage.setItem('token', token);
}

// Supprimer le token (logout)
function removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

// Sauvegarder l'utilisateur
function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

// Récupérer l'utilisateur
function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Vérifier si l'utilisateur est connecté
function isAuthenticated() {
    return !!getToken();
}

// ==========================================
// AUTHENTIFICATION
// ==========================================

async function register(name, email, password, phone = '') {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, phone })
        });

        const data = await response.json();

        if (data.success) {
            saveToken(data.data.token);
            saveUser(data.data.user);
            return { success: true, user: data.data.user };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Erreur inscription:', error);
        return { success: false, message: 'Erreur réseau. Vérifiez que le backend est démarré.' };
    }
}

async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            saveToken(data.data.token);
            saveUser(data.data.user);
            return { success: true, user: data.data.user };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Erreur connexion:', error);
        return { success: false, message: 'Erreur réseau. Vérifiez que le backend est démarré.' };
    }
}

async function logout() {
    try {
        const token = getToken();
        if (token) {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }
    } catch (error) {
        console.error('Erreur déconnexion:', error);
    } finally {
        removeToken();
        window.location.href = '/';
    }
}

async function getProfile() {
    try {
        const token = getToken();
        if (!token) return { success: false, message: 'Non connecté' };

        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        if (data.success) {
            saveUser(data.data.user);
            return { success: true, user: data.data.user };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Erreur profil:', error);
        return { success: false, message: 'Erreur réseau' };
    }
}

// ==========================================
// PRODUITS
// ==========================================

async function getProducts(params = {}) {
    try {
        const queryParams = new URLSearchParams(params).toString();
        const url = queryParams ? `${API_URL}/products?${queryParams}` : `${API_URL}/products`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            return { success: true, products: data.data.products, pagination: data.data.pagination };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Erreur produits:', error);
        return { success: false, message: 'Erreur réseau. Vérifiez que le backend est démarré sur http://localhost:5000' };
    }
}

async function getProductById(id) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        const data = await response.json();

        if (data.success) {
            return { success: true, product: data.data.product };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Erreur produit:', error);
        return { success: false, message: 'Erreur réseau' };
    }
}

async function searchProducts(searchText) {
    return getProducts({ search: searchText });
}

async function getProductsByCategory(category) {
    return getProducts({ category });
}

async function getPopularProducts() {
    try {
        const response = await fetch(`${API_URL}/products/featured/popular`);
        const data = await response.json();

        if (data.success) {
            return { success: true, products: data.data.products };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Erreur produits populaires:', error);
        return { success: false, message: 'Erreur réseau' };
    }
}

// ==========================================
// COMMANDES
// ==========================================

async function createOrder(orderData) {
    try {
        const token = getToken();
        if (!token) {
            return { success: false, message: 'Vous devez être connecté' };
        }

        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (data.success) {
            return { success: true, order: data.data.order };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Erreur commande:', error);
        return { success: false, message: 'Erreur réseau' };
    }
}

async function getMyOrders() {
    try {
        const token = getToken();
        if (!token) {
            return { success: false, message: 'Vous devez être connecté' };
        }

        const response = await fetch(`${API_URL}/orders/my-orders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            return { success: true, orders: data.data.orders };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Erreur commandes:', error);
        return { success: false, message: 'Erreur réseau' };
    }
}

async function trackOrder(orderNumber) {
    try {
        const response = await fetch(`${API_URL}/orders/track/${orderNumber}`);
        const data = await response.json();

        if (data.success) {
            return { success: true, order: data.data.order };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Erreur suivi:', error);
        return { success: false, message: 'Erreur réseau' };
    }
}

async function cancelOrder(orderId, reason) {
    try {
        const token = getToken();
        if (!token) {
            return { success: false, message: 'Vous devez être connecté' };
        }

        const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ reason })
        });

        const data = await response.json();

        if (data.success) {
            return { success: true, order: data.data.order };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Erreur annulation:', error);
        return { success: false, message: 'Erreur réseau' };
    }
}

console.log('✅ API ElectroBénin chargée - URL:', API_URL);