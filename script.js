// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const nav = document.querySelector('nav');
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            const mobileMenu = document.querySelector('.mobile-menu');
            if (!mobileMenu) {
                const menu = document.createElement('div');
                menu.className = 'mobile-menu animate-fadeIn';
                menu.innerHTML = `
                    <a href="#about" class="block py-2 hover:text-purple-500 transition">À propos</a>
                    <a href="#streams" class="block py-2 hover:text-purple-500 transition">Streams</a>
                    <a href="#schedule" class="block py-2 hover:text-purple-500 transition">Planning</a>
                    <a href="#social" class="block py-2 hover:text-purple-500 transition">Réseaux</a>
                `;
                nav.appendChild(menu);
            } else {
                mobileMenu.classList.toggle('active');
            }
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
        });
    });
});

// Twitch Embed
const twitchEmbed = document.querySelector('.twitch-embed');
if (twitchEmbed) {
    new Twitch.Embed("twitch-embed", {
        width: "100%",
        height: 480,
        channel: "twitchjimmyxe",
        layout: "video",
        autoplay: false
    });
}

// Schedule Data
const scheduleData = [
    { day: 'Lundi', time: '20h00', game: 'Just Chatting' },
    { day: 'Mardi', time: '20h00', game: 'Jeux variés' },
    { day: 'Mercredi', time: '20h00', game: 'Nouveautés' },
    { day: 'Jeudi', time: '20h00', game: 'Jeux compétitifs' },
    { day: 'Vendredi', time: '20h00', game: 'Soirée spéciale' },
    { day: 'Samedi', time: '15h00', game: 'Marathon stream' },
    { day: 'Dimanche', time: 'OFF', game: 'Repos' }
];

// Populate Schedule
const scheduleContainer = document.querySelector('#schedule .grid');
if (scheduleContainer) {
    scheduleData.forEach(slot => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        scheduleItem.innerHTML = `
            <h3 class="font-bold text-xl mb-2">${slot.day}</h3>
            <p class="text-purple-400">${slot.time}</p>
            <p class="text-sm">${slot.game}</p>
        `;
        scheduleContainer.appendChild(scheduleItem);
    });
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
