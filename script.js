// ========================================
// ELECTROBENIN - JAVASCRIPT PRINCIPAL
// Version: 2.2.0 - PRODUCTION READY
// ========================================

class ElectroBeninApp {
    constructor() {
        this.products = [];
        this.cart = JSON.parse(localStorage.getItem('electrobenin_cart')) || [];
        this.init();
    }

    async init() {
        console.log('⚡ ElectroBénin - Initialisation...');
        
        this.updateCartCounter();
        await this.loadProducts();
        this.setupEventListeners();
        this.setupUserMenu();
    }

    async loadProducts() {
        console.log('📦 Chargement des produits depuis l\'API...');
        
        try {
            const result = await getProducts();
            
            if (result.success) {
                this.products = result.products;
                console.log(`✅ ${this.products.length} produits chargés`);
                this.displayProducts();
            } else {
                console.error('❌ Erreur API:', result.message);
                this.showNotification('Erreur lors du chargement des produits', 'error');
            }
        } catch (error) {
            console.error('❌ Erreur réseau:', error);
            this.showNotification('Impossible de charger les produits', 'error');
        }
    }

    displayProducts(filter = 'all', search = '') {
        const container = document.getElementById('products-container');
        if (!container) return;

        let filteredProducts = this.products;
        
        if (filter !== 'all') {
            filteredProducts = filteredProducts.filter(p => p.category === filter);
        }
        
        if (search) {
            const searchLower = search.toLowerCase();
            filteredProducts = filteredProducts.filter(p => 
                p.name.toLowerCase().includes(searchLower) ||
                p.description.toLowerCase().includes(searchLower) ||
                p.category.toLowerCase().includes(searchLower)
            );
        }

        if (filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-search" style="font-size: 64px; color: #ddd; margin-bottom: 20px;"></i>
                    <h3 style="margin-bottom: 10px;">Aucun produit trouvé</h3>
                    <p style="color: #666;">Essayez d'autres termes de recherche</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredProducts.map((product, index) => `
            <div class="product-card" data-index="${index}">
                <div class="product-image">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%2300A8CC%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22white%22 text-anchor=%22middle%22 dy=%22.3em%22%3EProduit%3C/text%3E%3C/svg%3E'"
                         loading="lazy">
                    ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}
                </div>
                
                <div class="product-content">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-price">${product.price.toLocaleString()} FCFA</div>
                    
                    <div class="product-stock ${product.stock > 20 ? 'in-stock' : 'low-stock'}">
                        <i class="fas ${product.stock > 20 ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                        ${product.stock > 20 ? 'En stock' : 'Stock limité'} (${product.stock})
                    </div>
                    
                    <button class="add-to-cart btn-add-cart" onclick="window.ElectroBeninApp.addToCartByIndex(${index})">
                        <i class="fas fa-cart-plus"></i> Ajouter au panier
                    </button>
                </div>
            </div>
        `).join('');
    }

    addToCartByIndex(index) {
        const product = this.products[index];
        
        if (!product) {
            console.error('Produit non trouvé à l\'index:', index);
            this.showNotification('Erreur: Produit introuvable', 'error');
            return;
        }
        
        this.addToCart(product);
    }

    addToCartById(productId) {
        const product = this.products.find(p => p._id === productId);
        
        if (!product) {
            console.error('Produit non trouvé:', productId);
            this.showNotification('Erreur: Produit introuvable', 'error');
            return;
        }
        
        this.addToCart(product);
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item._id === product._id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                quantity: 1
            });
        }
        
        localStorage.setItem('electrobenin_cart', JSON.stringify(this.cart));
        this.updateCartCounter();
        this.showNotification(`${product.name} ajouté au panier`, 'success');
        
        // Animation bouton - chercher par le produit dans le DOM
        const allCards = document.querySelectorAll('.product-card');
        allCards.forEach(card => {
            const button = card.querySelector('.btn-add-cart');
            if (button && button.onclick && button.onclick.toString().includes(product._id)) {
                const originalHTML = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Ajouté !';
                button.style.background = '#10b981';
                button.disabled = true;
                
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.style.background = '';
                    button.disabled = false;
                }, 1500);
            }
        });
    }

    updateCartCounter() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        document.querySelectorAll('.cart-count').forEach(counter => {
            counter.textContent = totalItems;
            counter.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    }

    showNotification(message, type = 'success') {
        // Supprimer les anciennes notifications
        document.querySelectorAll('.eb-notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = 'eb-notification eb-notification-' + type;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Styles inline
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '15px',
            fontWeight: '500',
            minWidth: '300px',
            zIndex: '999999',
            animation: 'slideInFromRight 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutToRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    setupUserMenu() {
        const userMenu = document.getElementById('user-menu');
        const authLink = document.getElementById('auth-link');
        
        if (!userMenu || !authLink) return;
        
        if (typeof isAuthenticated === 'function' && isAuthenticated()) {
            const user = getUser();
            const userName = document.getElementById('user-name');
            if (userName && user) {
                userName.textContent = user.name;
            }
            userMenu.style.display = 'block';
            authLink.style.display = 'none';
        } else {
            userMenu.style.display = 'none';
            authLink.style.display = 'block';
        }
    }

    setupEventListeners() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const filter = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
                this.displayProducts(filter, e.target.value);
            });
        }

        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                e.target.classList.add('active');
                
                const search = searchInput?.value || '';
                this.displayProducts(e.target.dataset.category, search);
            });
        });

        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('.nav');
        if (menuToggle && nav) {
            menuToggle.addEventListener('click', function() {
                nav.classList.toggle('active');
                this.classList.toggle('active');
            });
        }
    }
}

// Ajouter les animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInFromRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutToRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Démarrer l'application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation ElectroBénin...');
    
    const app = new ElectroBeninApp();
    window.ElectroBeninApp = app;
    
    console.log('✅ ElectroBénin initialisé avec succès');
});