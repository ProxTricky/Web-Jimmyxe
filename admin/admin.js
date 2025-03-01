// Token Management
const getToken = () => localStorage.getItem('adminToken');
const setToken = (token) => localStorage.setItem('adminToken', token);
const removeToken = () => localStorage.removeItem('adminToken');

// API Calls
const API = {
    login: async (email, password) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return response.json();
    },

    getSchedule: async () => {
        const response = await fetch('/api/admin/schedule', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        return response.json();
    },

    updateSchedule: async (scheduleData) => {
        const response = await fetch('/api/admin/schedule', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(scheduleData)
        });
        return response.json();
    },

    getSocialLinks: async () => {
        const response = await fetch('/api/admin/social-links', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        return response.json();
    },

    updateSocialLink: async (linkData) => {
        const response = await fetch('/api/admin/social-links', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(linkData)
        });
        return response.json();
    },

    uploadBanner: async (file) => {
        const formData = new FormData();
        formData.append('banner', file);
        const response = await fetch('/api/admin/banners', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getToken()}` },
            body: formData
        });
        return response.json();
    },

    getBanners: async () => {
        const response = await fetch('/api/admin/banners', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        return response.json();
    },

    deleteBanner: async (bannerId) => {
        const response = await fetch(`/api/admin/banners/${bannerId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        return response.json();
    }
};

// UI Management
const UI = {
    showLoginForm: () => {
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('admin-dashboard').classList.add('hidden');
    },

    showDashboard: () => {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('hidden');
    },

    showTab: (tabId) => {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
        document.getElementById(`${tabId}-tab`).classList.remove('hidden');
        
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    },

    renderSchedule: (scheduleData) => {
        const container = document.getElementById('schedule-list');
        container.innerHTML = scheduleData.map(item => `
            <div class="schedule-item bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-medium">${item.day}</h3>
                        <p class="text-gray-600">${item.time} - ${item.game}</p>
                        ${item.description ? `<p class="text-sm text-gray-500">${item.description}</p>` : ''}
                    </div>
                    <div class="flex space-x-2">
                        <button class="edit-schedule text-blue-600 hover:text-blue-800" data-id="${item._id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-schedule text-red-600 hover:text-red-800" data-id="${item._id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    renderSocialLinks: (links) => {
        const container = document.getElementById('social-list');
        container.innerHTML = links.map(link => `
            <div class="social-link bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-medium capitalize">${link.platform}</h3>
                        <a href="${link.url}" target="_blank" class="text-blue-600 hover:text-blue-800 text-sm">${link.url}</a>
                    </div>
                    <div class="flex space-x-2">
                        <button class="edit-social text-blue-600 hover:text-blue-800" data-id="${link._id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-social text-red-600 hover:text-red-800" data-id="${link._id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    renderBanners: (banners) => {
        const container = document.getElementById('banners-list');
        container.innerHTML = banners.map(banner => `
            <div class="banner-item relative">
                <img src="${banner.url}" alt="Banner" class="w-full h-40 object-cover rounded">
                <button class="delete-banner absolute top-2 right-2 bg-red-500 text-white p-2 rounded" data-id="${banner._id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = getToken();
    if (token) {
        UI.showDashboard();
        loadDashboardData();
    }

    // Login Form
    document.getElementById('login').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const { token } = await API.login(email, password);
            setToken(token);
            UI.showDashboard();
            loadDashboardData();
        } catch (error) {
            alert('Erreur de connexion');
        }
    });

    // Schedule Form
    document.getElementById('schedule-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const scheduleData = {
            day: document.getElementById('schedule-day').value,
            time: document.getElementById('schedule-time').value,
            game: document.getElementById('schedule-game').value,
            description: document.getElementById('schedule-description').value
        };

        try {
            await API.updateSchedule(scheduleData);
            const schedule = await API.getSchedule();
            UI.renderSchedule(schedule);
            e.target.reset();
        } catch (error) {
            alert('Erreur lors de la mise à jour du planning');
        }
    });

    // Social Links Form
    document.getElementById('social-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const socialData = {
            platform: document.getElementById('social-platform').value,
            url: document.getElementById('social-url').value
        };

        try {
            await API.updateSocialLink(socialData);
            const links = await API.getSocialLinks();
            UI.renderSocialLinks(links);
            e.target.reset();
        } catch (error) {
            alert('Erreur lors de la mise à jour des réseaux sociaux');
        }
    });

    // Event delegation for schedule and social links editing
    document.getElementById('schedule-list').addEventListener('click', async (e) => {
        if (e.target.closest('.edit-schedule')) {
            const id = e.target.closest('.edit-schedule').dataset.id;
            const scheduleItem = await API.getSchedule(id);
            // Remplir le formulaire avec les données existantes
            document.getElementById('schedule-day').value = scheduleItem.day;
            document.getElementById('schedule-time').value = scheduleItem.time;
            document.getElementById('schedule-game').value = scheduleItem.game;
            document.getElementById('schedule-description').value = scheduleItem.description || '';
        }
    });

    document.getElementById('social-list').addEventListener('click', async (e) => {
        if (e.target.closest('.edit-social')) {
            const id = e.target.closest('.edit-social').dataset.id;
            const socialItem = await API.getSocialLinks(id);
            // Remplir le formulaire avec les données existantes
            document.getElementById('social-platform').value = socialItem.platform;
            document.getElementById('social-url').value = socialItem.url;
        }
    });

    // Logout
    document.getElementById('logout').addEventListener('click', () => {
        removeToken();
        UI.showLoginForm();
    });

    // Tab Navigation
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            UI.showTab(button.dataset.tab);
        });
    });

    // Banner Upload
    document.getElementById('banner-upload').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                await API.uploadBanner(file);
                const banners = await API.getBanners();
                UI.renderBanners(banners);
            } catch (error) {
                alert('Erreur lors de l\'upload');
            }
        }
    });
});

// Initial Data Load
async function loadDashboardData() {
    try {
        const [schedule, socialLinks, banners] = await Promise.all([
            API.getSchedule(),
            API.getSocialLinks(),
            API.getBanners()
        ]);

        UI.renderSchedule(schedule);
        UI.renderSocialLinks(socialLinks);
        UI.renderBanners(banners);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}
