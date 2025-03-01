# Site Web JimmyXE

Site web moderne pour le streamer TwitchJimmyXE développé avec Django et Tailwind CSS.

## Prérequis

- Python 3.10+
- pip (gestionnaire de paquets Python)
- virtualenv

## Installation sur Debian 12

1. Mettre à jour le système et installer les dépendances :
```bash
sudo apt update
sudo apt upgrade
sudo apt install python3-pip python3-venv nginx
```

2. Créer et activer un environnement virtuel :
```bash
python3 -m venv venv
source venv/bin/activate
```

3. Cloner le projet et installer les dépendances :
```bash
git clone <votre-repo>
cd jimmyxe
pip install -r requirements.txt
```

4. Créer le fichier .env :
```bash
cat > .env << EOL
SECRET_KEY=votre_cle_secrete
DEBUG=False
ALLOWED_HOSTS=votre_domaine.com,www.votre_domaine.com
EOL
```

5. Configurer la base de données :
```bash
python manage.py migrate
python manage.py createsuperuser
```

6. Collecter les fichiers statiques :
```bash
python manage.py collectstatic
```

7. Configurer Nginx :
```bash
sudo nano /etc/nginx/sites-available/jimmyxe
```

Ajouter la configuration suivante :
```nginx
server {
    server_name votre_domaine.com www.votre_domaine.com;
    
    location = /favicon.ico { access_log off; log_not_found off; }
    
    location /static/ {
        root /chemin/vers/votre/projet;
    }

    location /media/ {
        root /chemin/vers/votre/projet;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/run/gunicorn.sock;
    }
}
```

8. Activer le site et configurer SSL avec Certbot :
```bash
sudo ln -s /etc/nginx/sites-available/jimmyxe /etc/nginx/sites-enabled/
sudo certbot --nginx -d votre_domaine.com -d www.votre_domaine.com
```

9. Configurer Gunicorn comme service systemd :
```bash
sudo nano /etc/systemd/system/gunicorn.service
```

Ajouter :
```ini
[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=votre_utilisateur
Group=www-data
WorkingDirectory=/chemin/vers/votre/projet
ExecStart=/chemin/vers/votre/projet/venv/bin/gunicorn \
    --access-logfile - \
    --workers 3 \
    --bind unix:/run/gunicorn.sock \
    jimmyxe.wsgi:application

[Install]
WantedBy=multi-user.target
```

10. Démarrer les services :
```bash
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
sudo systemctl restart nginx
```

## Administration

Accédez à l'interface d'administration via :
- URL : https://votre_domaine.com/admin
- Utilisez les identifiants créés avec createsuperuser

## Fonctionnalités

- Gestion du planning des streams
- Gestion des réseaux sociaux
- Gestion des bannières
- Interface responsive
- Design moderne avec Tailwind CSS

## Maintenance

Pour mettre à jour le site :
```bash
source venv/bin/activate
git pull
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart gunicorn
```

## Sauvegarde

Pour sauvegarder la base de données :
```bash
python manage.py dumpdata > backup.json
```

Pour restaurer :
```bash
python manage.py loaddata backup.json
