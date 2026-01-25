// ========================================
// ELECTROBENIN - JAVASCRIPT PRINCIPAL
// Version: 1.0.0 Production
// ========================================

// Classe principale ElectroBénin
class ElectroBeninApp {
    constructor() {
        this.products = [];
        this.cart = JSON.parse(localStorage.getItem('electrobenin_cart')) || [];
        this.init();
    }

    async init() {
        console.log('⚡ ElectroBénin - Initialisation...');
        
        // Mettre à jour le compteur panier
        this.updateCartCounter();
        
        // Charger les produits
        this.loadProducts();
        
        // Configurer les écouteurs
        this.setupEventListeners();
        
        // Charger les produits dans la page
        this.displayProducts();
    }

    loadProducts() {
        // Données produits statiques (pas de backend requis)
        this.products = [
            {
                _id: '1',
                name: 'Arduino Uno R3',
                description: 'Carte de développement idéale pour débutants',
                price: 12000,
                stock: 50,
                category: 'Microcontrôleurs',
                image: 'https://store-usa.arduino.cc/cdn/shop/files/A000073_00.front_1200x900.jpg',
                tag: 'POPULAIRE'
            },
            {
                _id: '2',
                name: 'LCD 16×2 avec I2C',
                description: 'Écran LCD avec interface simplifiée',
                price: 6500,
                stock: 35,
                category: 'Afficheurs',
                image: 'https://m.media-amazon.com/images/I/71z8VnS2bAL._AC_SL1500_.jpg',
                tag: 'POPULAIRE'
            },
            {
                _id: '3',
                name: 'ESP32 Dev Board',
                description: 'WiFi + Bluetooth intégré',
                price: 18000,
                stock: 25,
                category: 'Microcontrôleurs',
                image: 'https://m.media-amazon.com/images/I/61Y9EwKCj1L._AC_SL1500_.jpg'
            },
            {
                _id: '4',
                name: 'Capteur HC-SR04',
                description: 'Capteur ultrasonique de distance',
                price: 3500,
                stock: 100,
                category: 'Capteurs',
                image: 'https://m.media-amazon.com/images/I/61R1A7CuHTL._AC_SL1500_.jpg',
                tag: 'POPULAIRE'
            },
            {
                _id: '5',
                name: 'Pack Résistances 500pcs',
                description: 'Assortiment de résistances',
                price: 2500,
                stock: 30,
                category: 'Résistances',
                image: 'https://m.media-amazon.com/images/I/71YtGZ2PqRL._AC_SL1500_.jpg',
                tag: 'NOUVEAU'
            },
            {
                _id: '6',
                name: 'Module Relais 5V',
                description: 'Contrôle de charges AC/DC',
                price: 2800,
                stock: 60,
                category: 'Modules',
                image: 'https://m.media-amazon.com/images/I/71O-7U58WGL._AC_SL1500_.jpg'
            },
            {
                _id: '7',
                name: 'Raspberry Pi 4 Model B',
                description: 'Mini ordinateur 4GB RAM, idéal pour projets IoT',
                price: 45000,
                stock: 15,
                category: 'Microcontrôleurs',
                image: 'https://m.media-amazon.com/images/I/61n17rVxXtL._AC_SL1500_.jpg'
            },
            {
                _id: '8',
                name: 'Capteur DHT22',
                description: 'Capteur de température et humidité haute précision',
                price: 4500,
                stock: 65,
                category: 'Capteurs',
                image: 'https://m.media-amazon.com/images/I/61DGhJ1nTQL._AC_SL1500_.jpg'
            },
            {
                _id: '9',
                name: 'Fer à Souder 60W',
                description: 'Fer à souder avec contrôle de température',
                price: 9800,
                stock: 28,
                category: 'Outils',
                image: 'https://m.media-amazon.com/images/I/71cTlLWHtmL._AC_SL1500_.jpg'
            },
            {
                _id: '10',
                name: 'Multimètre Numérique',
                description: 'Multimètre avec testeur de continuité',
                price: 12500,
                stock: 22,
                category: 'Outils',
                image: 'https://m.media-amazon.com/images/I/71Ebj2lJawL._AC_SL1500_.jpg'
            },
            {
                _id: '11',
                name: 'Module Bluetooth HC-05',
                description: 'Module Bluetooth pour communication sans fil',
                price: 5500,
                stock: 40,
                category: 'Modules',
                image: 'https://m.media-amazon.com/images/I/61KKxJz+fNL._AC_SL1500_.jpg'
            },
            {
                _id: '12',
                name: 'Écran OLED 0.96"',
                description: 'Écran OLED I2C 128×64 pixels',
                price: 7500,
                stock: 30,
                category: 'Afficheurs',
                image: 'https://m.media-amazon.com/images/I/61mp6JVLJoL._AC_SL1500_.jpg',
                tag: 'NOUVEAU'
            }
        ];
        
        console.log(`✅ ${this.products.length} produits chargés`);
    }

    displayProducts(filter = 'all', search = '') {
        const container = document.getElementById('products-container');
        if (!container) return;

        // Filtrer les produits
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

        // Afficher les produits
        if (filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <h3>Aucun produit trouvé</h3>
                    <p>Essayez d'autres termes de recherche</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredProducts.map(product => `
            <div class="product-card" data-id="${product._id}">
                <div class="product-image">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%2300A8CC%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22white%22 text-anchor=%22middle%22 dy=%22.3em%22%3E${encodeURIComponent(product.name.substring(0, 20))}%3C/text%3E%3C/svg%3E'"
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
                    
                    <button class="add-to-cart" data-id="${product._id}">
                        <i class="fas fa-cart-plus"></i> Ajouter au panier
                    </button>
                </div>
            </div>
        `).join('');

        // Ajouter les écouteurs d'événements
        this.setupProductButtons();
    }

    setupProductButtons() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('[data-id]').dataset.id;
                const product = this.products.find(p => p._id === productId);
                
                if (product) {
                    this.addToCart(product);
                }
            });
        });
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item._id === product._id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }
        
        // Sauvegarder dans localStorage
        localStorage.setItem('electrobenin_cart', JSON.stringify(this.cart));
        
        // Mettre à jour le compteur
        this.updateCartCounter();
        
        // Afficher une notification
        this.showNotification(`${product.name} ajouté au panier`, 'success');
        
        // Animation du bouton
        const button = document.querySelector(`[data-id="${product._id}"] .add-to-cart`);
        if (button) {
            button.classList.add('added');
            button.innerHTML = '<i class="fas fa-check"></i> Ajouté !';
            setTimeout(() => {
                button.classList.remove('added');
                button.innerHTML = '<i class="fas fa-cart-plus"></i> Ajouter au panier';
            }, 1500);
        }
    }

    updateCartCounter() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        document.querySelectorAll('.cart-count').forEach(counter => {
            counter.textContent = totalItems;
            counter.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    }

    showNotification(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    setupEventListeners() {
        // Recherche
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const filter = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
                this.displayProducts(filter, e.target.value);
            });
        }

        // Filtres par catégorie
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                // Retirer active de tous les boutons
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Ajouter active au bouton cliqué
                e.target.classList.add('active');
                
                // Filtrer les produits
                const search = searchInput?.value || '';
                this.displayProducts(e.target.dataset.category, search);
            });
        });

        // Newsletter
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input').value;
                
                this.showNotification(`Merci ! Vous êtes inscrit avec : ${email}`);
                newsletterForm.reset();
            });
        }
    }
}

// Démarrer l'application quand le DOM est prêt
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser l'app
    const app = new ElectroBeninApp();
    
    // Exposer au global pour les autres pages
    window.ElectroBeninApp = app;
    
    console.log('✅ ElectroBénin initialisé avec succès');
});

// Service Worker pour PWA (optionnel)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker enregistré:', registration);
            })
            .catch(error => {
                console.log('❌ Erreur Service Worker:', error);
            });
    });
}