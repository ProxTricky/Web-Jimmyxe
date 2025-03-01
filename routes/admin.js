const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authMiddleware } = require('./auth');
const Schedule = require('../models/Schedule');
const SocialLink = require('../models/SocialLink');

// Configuration de Multer pour l'upload des images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/banners')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // limite à 5MB
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});

// Protéger toutes les routes admin avec le middleware d'authentification
router.use(authMiddleware);

// Routes pour le planning
router.get('/schedule', async (req, res) => {
    try {
        const schedule = await Schedule.find();
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.post('/schedule', async (req, res) => {
    try {
        const newSchedule = new Schedule(req.body);
        await newSchedule.save();
        res.json(newSchedule);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.put('/schedule/:id', async (req, res) => {
    try {
        const updatedSchedule = await Schedule.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedSchedule);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.delete('/schedule/:id', async (req, res) => {
    try {
        await Schedule.findByIdAndDelete(req.params.id);
        res.json({ message: 'Planning supprimé' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Routes pour les réseaux sociaux
router.get('/social-links', async (req, res) => {
    try {
        const links = await SocialLink.find();
        res.json(links);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.put('/social-links/:id', async (req, res) => {
    try {
        const updatedLink = await SocialLink.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedLink);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Routes pour les bannières
router.post('/banners', upload.single('banner'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier uploadé' });
        }
        
        const bannerUrl = `/uploads/banners/${req.file.filename}`;
        res.json({ url: bannerUrl });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.get('/banners', (req, res) => {
    try {
        // Lire le dossier des bannières et renvoyer la liste
        const fs = require('fs');
        const bannerDir = path.join(__dirname, '../public/uploads/banners');
        const banners = fs.readdirSync(bannerDir)
            .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
            .map(file => ({
                url: `/uploads/banners/${file}`,
                id: path.parse(file).name
            }));
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.delete('/banners/:id', (req, res) => {
    try {
        const fs = require('fs');
        const filePath = path.join(__dirname, '../public/uploads/banners', req.params.id);
        fs.unlinkSync(filePath);
        res.json({ message: 'Bannière supprimée' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
