require('dotenv').config();
const mongoose = require('mongoose');
const Schedule = require('./models/Schedule');
const SocialLink = require('./models/SocialLink');

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Données initiales pour le planning
const initialSchedule = [
    {
        day: 'Lundi',
        time: '20:00',
        game: 'Just Chatting',
        description: 'Discussion avec la communauté'
    },
    {
        day: 'Mercredi',
        time: '20:00',
        game: 'Jeux variés',
        description: 'Découverte de nouveaux jeux'
    },
    {
        day: 'Vendredi',
        time: '21:00',
        game: 'Soirée spéciale',
        description: 'Events et surprises'
    }
];

// Données initiales pour les réseaux sociaux
const initialSocialLinks = [
    {
        platform: 'twitch',
        url: 'https://twitch.tv/twitchjimmyxe'
    },
    {
        platform: 'youtube',
        url: 'https://youtube.com/@JimmyXE'
    },
    {
        platform: 'twitter',
        url: 'https://twitter.com/jimmyxe_'
    },
    {
        platform: 'tiktok',
        url: 'https://tiktok.com/@jimmyxe'
    }
];

// Fonction pour initialiser la base de données
async function initDatabase() {
    try {
        // Supprimer les données existantes
        await Schedule.deleteMany({});
        await SocialLink.deleteMany({});

        // Insérer les nouvelles données
        await Schedule.insertMany(initialSchedule);
        await SocialLink.insertMany(initialSocialLinks);

        console.log('Base de données initialisée avec succès !');
        
        // Afficher les données insérées
        const schedules = await Schedule.find();
        const socialLinks = await SocialLink.find();
        
        console.log('\nPlanning créé :');
        console.log(schedules);
        
        console.log('\nRéseaux sociaux créés :');
        console.log(socialLinks);

        mongoose.disconnect();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        mongoose.disconnect();
    }
}

// Exécuter l'initialisation
initDatabase();
