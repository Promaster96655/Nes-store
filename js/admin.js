// FILE: js/admin.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Auth (Using nesStoreUser logic now)
    checkAdminAccess(); // Defined in main.js

    // 2. Initialize
    loadSettings();
    renderProductTable();
    setupTabs();

    // 3. Listeners
    document.getElementById('save-theme-config').addEventListener('click', saveThemeConfig);
    document.getElementById('save-content-config').addEventListener('click', saveContentConfig);
    document.getElementById('add-product-form').addEventListener('submit', addProduct);
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('nesStoreUser');
        window.location.href = 'index.html';
    });
});

function setupTabs() {
    const tabs = document.querySelectorAll('.sidebar li');
    tabs.forEach(tab => {
        if(tab.id === 'logout') return;
        tab.addEventListener('click', () => {
            document.querySelectorAll('.sidebar li').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.remove('hidden');
        });
    });
}

function loadSettings() {
    const config = JSON.parse(localStorage.getItem('nes_config'));
    const content = JSON.parse(localStorage.getItem('nesStoreSettings')); // New content settings
    
    // Tab 1 (Theme)
    document.getElementById('conf-name').value = config.siteName;
    document.getElementById('conf-theme').value = config.theme;

    // Tab 2 (Content)
    if (content) {
        document.getElementById('conf-hero-title').value = content.heroTitle || "";
        document.getElementById('conf-hero-sub').value = content.heroSubtitle || "";
        
        // Slider
        if(content.slider && content.slider[0]) {
            document.getElementById('slide1-img').value = content.slider[0].image;
            document.getElementById('slide1-title').value = content.slider[0].title;
            document.getElementById('slide1-desc').value = content.slider[0].text;
        }
        if(content.slider && content.slider[1]) {
            document.getElementById('slide2-img').value = content.slider[1].image;
            document.getElementById('slide2-title').value = content.slider[1].title;
            document.getElementById('slide2-desc').value = content.slider[1].text;
        }
        if(content.slider && content.slider[2]) {
            document.getElementById('slide3-img').value = content.slider[2].image;
            document.getElementById('slide3-title').value = content.slider[2].title;
            document.getElementById('slide3-desc').value = content.slider[2].text;
        }

        // Promo
        if(content.promo) {
            document.getElementById('promo-enabled').checked = content.promo.enabled;
            document.getElementById('promo-title').value = content.promo.title;
            document.getElementById('promo-desc').value = content.promo.desc;
            document.getElementById('promo-img').value = content.promo.image;
        }
    }
}

function saveThemeConfig() {
    const current = JSON.parse(localStorage.getItem('nes_config'));
    const newConfig = {
        ...current,
        siteName: document.getElementById('conf-name').value,
        theme: document.getElementById('conf-theme').value
    };
    localStorage.setItem('nes_config', JSON.stringify(newConfig));
    alert("Theme Settings Saved!");
}

function saveContentConfig() {
    const sliderData = [
        {
            image: document.getElementById('slide1-img').value,
            title: document.getElementById('slide1-title').value,
            text: document.getElementById('slide1-desc').value
        },
        {
            image: document.getElementById('slide2-img').value,
            title: document.getElementById('slide2-title').value,
            text: document.getElementById('slide2-desc').value
        },
        {
            image: document.getElementById('slide3-img').value,
            title: document.getElementById('slide3-title').value,
            text: document.getElementById('slide3-desc').value
        }
    ];

    const promoData = {
        enabled: document.getElementById('promo-enabled').checked,
        title: document.getElementById('promo-title').value,
        desc: document.getElementById('promo-desc').value,
        image: document.getElementById('promo-img').value
    };

    const newContent = {
        heroTitle: document.getElementById('conf-hero-title').value,
        heroSubtitle: document.getElementById('conf-hero-sub').value,
        slider: sliderData,
        promo: promoData
    };

    localStorage.setItem('nesStoreSettings', JSON.stringify(newContent));
    alert("Content Settings Saved! Refresh home page.");
}

function addProduct(e) {
    e.preventDefault();
    const file = document.getElementById('prod-file').files[0];
    if(!file) return alert("Upload image");

    const reader = new FileReader();
    reader.onload = (ev) => {
        const products = JSON.parse(localStorage.getItem('nes_products')) || [];
        products.push({
            id: Date.now(),
            name: document.getElementById('prod-name').value,
            price: document.getElementById('prod-price').value,
            image: ev.target.result
        });
        localStorage.setItem('nes_products', JSON.stringify(products));
        renderProductTable();
        e.target.reset();
    };
    reader.readAsDataURL(file);
}

function renderProductTable() {
    const products = JSON.parse(localStorage.getItem('nes_products')) || [];
    document.getElementById('prod-table').innerHTML = products.map((p, i) => `
        <tr>
            <td style="padding:10px;"><img src="${p.image}" style="width:50px;"></td>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td><button onclick="delProd(${i})" style="color:red; background:none; border:none; cursor:pointer;">X</button></td>
        </tr>
    `).join('');
}

window.delProd = (i) => {
    if(confirm('Delete?')) {
        const p = JSON.parse(localStorage.getItem('nes_products'));
        p.splice(i, 1);
        localStorage.setItem('nes_products', JSON.stringify(p));
        renderProductTable();
    }
}