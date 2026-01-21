// FILE: js/main.js

const DEFAULT_CONFIG = {
    siteName: "NES STORE",
    theme: "light",
};

// 15 Sample Products for Long Scrolling
const DEFAULT_PRODUCTS = [
    { id: 1, name: "Geometric Cube", price: "2,500", image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500" },
    { id: 2, name: "Abstract Vase", price: "4,200", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500" },
    { id: 3, name: "Minimal Chair", price: "15,000", image: "https://images.unsplash.com/photo-1503602642458-232111445857?w=500" },
    { id: 4, name: "Analog Watch", price: "8,900", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500" },
    { id: 5, name: "Silk Bomber", price: "12,000", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500" },
    { id: 6, name: "Obsidian Sneaker", price: "9,500", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500" },
    { id: 7, name: "Gold Lens", price: "5,500", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500" },
    { id: 8, name: "Leather Tote", price: "18,000", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500" },
    { id: 9, name: "Ceramic Bowl", price: "3,100", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500" },
    { id: 10, name: "Wireless Headphones", price: "22,000", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
    { id: 11, name: "Marble Lamp", price: "6,700", image: "https://images.unsplash.com/photo-1513506003011-3b03c373c770?w=500" },
    { id: 12, name: "Classic Oxford", price: "8,200", image: "https://images.unsplash.com/photo-1482329233113-df8e1085c169?w=500" },
    { id: 13, name: "Pendant Light", price: "4,500", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=500" },
    { id: 14, name: "Velvet Sofa", price: "45,000", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500" },
    { id: 15, name: "Art Print", price: "1,500", image: "https://images.unsplash.com/photo-1581447109200-bf2769116351?w=500" }
];

// Default Content Settings (Hero, Slider, Promo)
const DEFAULT_CONTENT = {
    heroTitle: "NES STORE",
    heroSubtitle: "Curated Luxury Objects",
    slider: [
        { image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000", title: "New Season", text: "Discover the latest trends." },
        { image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1000", title: "Minimalist Edit", text: "Less is always more." },
        { image: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=1000", title: "Luxury Streetwear", text: "Define your style." }
    ],
    promo: {
        enabled: true,
        title: "Minimalist. Luxury.",
        desc: "We curate objects of desire. Designed in India, shipped globally.",
        image: "https://images.unsplash.com/photo-1549439602-43ebca2327af?w=800"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initData();
    initAdminBadge();
    applySettings();
    renderProducts();
    initCashboxAnimation(); 
    initHeroSlider();
});

// --- DATA INIT ---
function initData() {
    if(!localStorage.getItem('nes_config')) localStorage.setItem('nes_config', JSON.stringify(DEFAULT_CONFIG));
    if(!localStorage.getItem('nesStoreSettings')) localStorage.setItem('nesStoreSettings', JSON.stringify(DEFAULT_CONTENT));
    if(!localStorage.getItem('nes_products')) localStorage.setItem('nes_products', JSON.stringify(DEFAULT_PRODUCTS));
}

// --- AUTH & BADGE LOGIC ---
function initAdminBadge() {
    const user = JSON.parse(localStorage.getItem('nesStoreUser'));
    const badge = document.getElementById('admin-badge');
    if (badge && user && user.role === 'admin') {
        badge.classList.remove('hidden');
    }
}

function handleLogin(email, password) {
    if (email === 'Admin1234@gmail.com' && password === 'nesstore') {
        const user = { email: email, role: 'admin' };
        localStorage.setItem('nesStoreUser', JSON.stringify(user));
        window.location.href = 'admin.html';
    } else {
        const user = { email: email, role: 'user' };
        localStorage.setItem('nesStoreUser', JSON.stringify(user));
        // Treat as normal user
        window.location.href = 'index.html';
    }
}

function checkAdminAccess() {
    const user = JSON.parse(localStorage.getItem('nesStoreUser'));
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
    }
}

// --- RENDERING & SETTINGS ---
function applySettings() {
    const config = JSON.parse(localStorage.getItem('nes_config'));
    const content = JSON.parse(localStorage.getItem('nesStoreSettings')) || DEFAULT_CONTENT;
    
    // Apply Theme & Site Name
    document.documentElement.setAttribute('data-theme', config.theme);
    document.title = config.siteName;
    document.querySelectorAll('.brand-name').forEach(el => el.textContent = config.siteName);
    
    // Apply Content Settings
    const heroTitle = document.querySelector('.hero-brand');
    if(heroTitle && content.heroTitle) heroTitle.textContent = content.heroTitle;

    const heroSub = document.getElementById('hero-subtitle-display');
    if(heroSub && content.heroSubtitle) heroSub.textContent = content.heroSubtitle;

    const promoSec = document.getElementById('promo');
    if(promoSec && content.promo) {
        if(content.promo.enabled) {
            promoSec.classList.remove('hidden');
            document.getElementById('promo-title-display').textContent = content.promo.title;
            document.getElementById('promo-desc-display').textContent = content.promo.desc;
            document.getElementById('promo-img-display').src = content.promo.image;
        } else {
            promoSec.classList.add('hidden');
        }
    }
}

function renderProducts() {
    const list = document.getElementById('product-list');
    if(!list) return;

    const products = JSON.parse(localStorage.getItem('nes_products'));
    list.innerHTML = products.map(p => `
        <div class="product-card" onclick="openCheckout('${p.name}', '${p.price}')">
            <div class="card-img-container">
                <img src="${p.image}" alt="${p.name}">
            </div>
            <h3>${p.name}</h3>
            <span class="price">₹${p.price}</span>
        </div>
    `).join('');
}

// --- HERO SLIDER ---
let slideInterval;
function initHeroSlider() {
    const slider = document.getElementById('hero-slider');
    if(!slider) return;

    const track = document.getElementById('slider-track');
    const dotsContainer = document.getElementById('slider-dots');
    const content = JSON.parse(localStorage.getItem('nesStoreSettings')) || DEFAULT_CONTENT;
    const slides = content.slider || [];

    // Render Slides
    track.innerHTML = slides.map(s => `
        <div class="hero-slide">
            <img src="${s.image}" alt="${s.title}">
            <div class="hero-slide-overlay">
                <h2>${s.title}</h2>
                <p>${s.text}</p>
            </div>
        </div>
    `).join('');

    // Render Dots
    dotsContainer.innerHTML = slides.map((_, i) => `<div class="dot" onclick="setSlide(${i})"></div>`).join('');

    // Logic
    startSliderAuto();
}

let currentSlideIndex = 0;
function moveSlide(dir) {
    const slides = document.querySelectorAll('.hero-slide');
    if(slides.length === 0) return;
    
    currentSlideIndex += dir;
    if(currentSlideIndex >= slides.length) currentSlideIndex = 0;
    if(currentSlideIndex < 0) currentSlideIndex = slides.length - 1;
    
    updateSliderUI();
    resetSliderAuto();
}

function setSlide(idx) {
    currentSlideIndex = idx;
    updateSliderUI();
    resetSliderAuto();
}

function updateSliderUI() {
    const track = document.getElementById('slider-track');
    if(track) track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    
    const dots = document.querySelectorAll('.dot');
    dots.forEach(d => d.classList.remove('active'));
    if(dots[currentSlideIndex]) dots[currentSlideIndex].classList.add('active');
}

function startSliderAuto() {
    if(document.querySelectorAll('.hero-slide').length > 1) {
        slideInterval = setInterval(() => moveSlide(1), 5000);
    }
    updateSliderUI();
}

function resetSliderAuto() {
    clearInterval(slideInterval);
    startSliderAuto();
}

// --- GEOMETRIC ANIMATION ---
function initCashboxAnimation() {
    const canvas = document.getElementById('bg-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height, shapes = [];
    const config = JSON.parse(localStorage.getItem('nes_config'));
    const isDark = config.theme === 'dark';

    function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }

    class Shape {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 40 + 10;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.rotation = 0;
            this.vRot = (Math.random() - 0.5) * 0.02;
        }
        update() {
            this.x += this.vx; this.y += this.vy; this.rotation += this.vRot;
            if(this.x < 0 || this.x > width) this.vx *= -1;
            if(this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.strokeStyle = isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 0, 0, 0.1)';
            ctx.lineWidth = 2;
            ctx.strokeRect(-this.size/2, -this.size/2, this.size, this.size);
            ctx.restore();
        }
    }

    function init() { shapes = []; for(let i=0; i<30; i++) shapes.push(new Shape()); }
    function animate() {
        ctx.clearRect(0, 0, width, height);
        shapes.forEach(s => { s.update(); s.draw(); });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => { resize(); init(); });
    resize(); init(); animate();
}

// --- CHECKOUT ---
const modal = document.getElementById('checkout-modal');

window.openCheckout = (name, price) => {
    const elItem = document.getElementById('modal-item');
    const elPrice = document.getElementById('modal-price');
    if(elItem && elPrice) {
        elItem.textContent = name;
        elPrice.textContent = "Total: ₹" + price;
        modal.style.display = 'flex';
    }
};

window.closeModal = () => {
    modal.style.display = 'none';
    const qr = document.getElementById('qr-box');
    if(qr) qr.style.display = 'none';
};

window.payUPI = () => {
    const qr = document.getElementById('qr-box');
    if(qr) {
        qr.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=UPI_DEMO";
        qr.style.display = 'block';
    }
};

window.payPayPal = () => {
    alert("Redirecting to PayPal...");
    closeModal();
};

window.onclick = (e) => { if(e.target == modal) closeModal(); }