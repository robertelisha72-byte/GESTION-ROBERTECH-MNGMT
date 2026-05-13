// ========================================
// ROBERTECH - JavaScript Global
// Fonctionnalités: Loader, Dark mode, Panier, Animations, Formulaires
// ========================================

// Attendre le chargement complet
document.addEventListener('DOMContentLoaded', () => {
    // Loader
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1500);
    }
    
    initNavigation();
    initDarkMode();
    initScrollAnimations();
    initCart();
    initContactForm();
    initStatsCounter();
    initFAQ();
    initPortfolioFilter();
    initAuthForms();
    setActiveNavLink();
});

// ========== NAVIGATION ==========
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navbar = document.querySelector('.Bariki');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ========== DARK MODE ==========
function initDarkMode() {
    const darkBtn = document.getElementById('darkModeToggle');
    const body = document.body;
    
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'false') {
        body.classList.remove('dark');
    } else {
        body.classList.add('dark');
    }
    
    darkBtn.addEventListener('click', () => {
        body.classList.toggle('dark');
        const isDark = body.classList.contains('dark');
        localStorage.setItem('darkMode', isDark);
        showNotification(`Mode ${isDark ? 'sombre' : 'clair'} activé`);
    });
}

// ========== ANIMATIONS SCROLL ==========
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
}

// ========== NOTIFICATIONS ==========
function showNotification(message, type = 'success') {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.innerHTML = `${message}`;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.remove();
    }, 3000);
}

// ========== PANIER (localStorage) ==========
let cart = [];

function initCart() {
    loadCart();
    renderCart();
    
    document.getElementById('cartIconBtn')?.addEventListener('click', () => {
        document.getElementById('cartSidebar').classList.add('open');
        document.getElementById('cartOverlay').classList.add('active');
    });
    
    document.getElementById('closeCartBtn')?.addEventListener('click', () => {
        document.getElementById('cartSidebar').classList.remove('open');
        document.getElementById('cartOverlay').classList.remove('active');
    });
    
    document.getElementById('cartOverlay')?.addEventListener('click', () => {
        document.getElementById('cartSidebar').classList.remove('open');
        document.getElementById('cartOverlay').classList.remove('active');
    });
    
    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Votre panier est vide');
            return;
        }
        let message = 'Commande ROBERTECH:%0A';
        cart.forEach(item => {
            message += `- ${item.name} : ${item.price} FC%0A`;
        });
        message += `Total: ${getCartTotal()} FC`;
        window.open(`https://wa.me/243970779971?text=${message}`, '_blank');
    });
}

function addToCart(name, price) {
    cart.push({ name, price, id: Date.now() });
    saveCart();
    renderCart();
    showNotification(`${name} ajouté au panier`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price, 0);
}

function saveCart() {
    localStorage.setItem('robertech_cart', JSON.stringify(cart));
    updateCartCount();
}

function loadCart() {
    const saved = localStorage.getItem('robertech_cart');
    if (saved) cart = JSON.parse(saved);
    updateCartCount();
}

function updateCartCount() {
    const countEl = document.getElementById('cartCount');
    if (countEl) countEl.textContent = cart.length;
}

function renderCart() {
    const container = document.getElementById('cartItemsList');
    const totalSpan = document.getElementById('cartTotal');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:2rem;">Panier vide</p>';
        if (totalSpan) totalSpan.textContent = '0';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div><strong>${item.name}</strong><br>${item.price} FC</div>
            <button onclick="removeFromCart(${item.id})" style="background:red; color:white; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer;">×</button>
        </div>
    `).join('');
    
    if (totalSpan) totalSpan.textContent = getCartTotal();
}

window.removeFromCart = removeFromCart;
window.addToCart = addToCart;

// ========== STATS COMPTEUR ==========
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stats.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    let current = 0;
                    const increment = target / 50;
                    const update = () => {
                        if (current < target) {
                            current += increment;
                            stat.textContent = Math.ceil(current);
                            setTimeout(update, 20);
                        } else {
                            stat.textContent = target;
                        }
                    };
                    update();
                });
                observer.unobserve(entry.target);
            }
        });
    });
    
    const container = document.querySelector('.stats-container');
    if (container) observer.observe(container);
}

// ========== FAQ ACCORDÉON ==========
function initFAQ() {
    const faqItems = document.querySelectorAll('.Lumoo');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
}

// ========== PORTFOLIO FILTRE ==========
function initPortfolioFilter() {
    const btns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-item');
    
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            
            items.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ========== FORMULAIRE CONTACT ==========
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName')?.value;
            if (name) {
                showNotification(`Merci ${name}, nous vous contacterons sous 24h`);
                form.reset();
            }
        });
    }
}

// ========== FORMULAIRES AUTH ==========
function initAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Connexion réussie ! Bienvenue');
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Inscription réussie ! Connectez-vous');
            // Basculer vers login
            document.querySelector('.login-form')?.classList.add('active');
            document.querySelector('.register-form')?.classList.remove('active');
        });
    }
    
    // Upload photo preview
    const photoInput = document.getElementById('profilePhoto');
    const preview = document.getElementById('photoPreview');
    if (photoInput && preview) {
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    preview.innerHTML = `<img src="${event.target.result}" style="width:100px; height:100px; border-radius:50%; object-fit:cover;">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// ========== PAGE ACTIVE ==========
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}