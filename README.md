# Site Web JimmyXE

Site web moderne pour le streamer TwitchJimmyXE développé avec Django et Tailwind CSS.

## Prérequis

- Python 3.10+
- pip (gestionnaire de paquets Python)
- virtualenv
- Apache2

## Installation sur Debian 12

### 1. Mise à jour du système et installation des dépendances

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y python3-pip python3-venv apache2 libapache2-mod-wsgi-py3
```

### 2. Configuration de l'environnement Python

```bash
# Cloner le dépôt
git clone https://github.com/ProxTricky/Web-Jimmyxe.git
cd Web-Jimmyxe

# Créer et activer l'environnement virtuel
python3 -m venv venv
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

### 3. Configuration de Django

```bash
# Créer le fichier .env
cat > .env << EOL
SECRET_KEY=votre_clé_secrète_ici
DEBUG=False
ALLOWED_HOSTS=votre_domaine.com,www.votre_domaine.com
EOL

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Collecter les fichiers statiques
python manage.py collectstatic
```

### 4. Configuration d'Apache2

```bash
# Créer la configuration Apache
sudo nano /etc/apache2/sites-available/jimmyxe.conf
```

Ajouter la configuration suivante :

```apache
<VirtualHost *:80>
    ServerName votre_domaine.com
    ServerAlias www.votre_domaine.com
    
    Alias /static/ /var/www/jimmyxe/static/
    Alias /media/ /var/www/jimmyxe/media/
    
    <Directory /var/www/jimmyxe/static>
        Require all granted
    </Directory>
    
    <Directory /var/www/jimmyxe/media>
        Require all granted
    </Directory>
    
    <Directory /var/www/jimmyxe/jimmyxe>
        <Files wsgi.py>
            Require all granted
        </Files>
    </Directory>
    
    WSGIDaemonProcess jimmyxe python-path=/var/www/jimmyxe python-home=/var/www/jimmyxe/venv
    WSGIProcessGroup jimmyxe
    WSGIScriptAlias / /var/www/jimmyxe/jimmyxe/wsgi.py
</VirtualHost>
```

### 5. Finalisation de l'installation

```bash
# Copier le projet dans /var/www/
sudo mkdir -p /var/www/jimmyxe
sudo cp -r . /var/www/jimmyxe

# Définir les permissions
sudo chown -R www-data:www-data /var/www/jimmyxe
sudo chmod -R 755 /var/www/jimmyxe

# Activer le site et redémarrer Apache
sudo a2ensite jimmyxe
sudo a2enmod wsgi
sudo systemctl restart apache2
```

### 6. Configuration SSL (optionnel mais recommandé)

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-apache

# Obtenir un certificat SSL
sudo certbot --apache -d votre_domaine.com -d www.votre_domaine.com
```

## Administration

1. Accédez à `http://votre_domaine.com/admin`
2. Connectez-vous avec les identifiants du superutilisateur
3. Gérez le planning, les réseaux sociaux et les bannières

## Fonctionnalités

- Gestion du planning des streams
- Gestion des réseaux sociaux
- Gestion des bannières
- Interface responsive
- Design moderne avec Tailwind CSS

## Maintenance

Pour mettre à jour le site :

```bash
cd /var/www/jimmyxe
source venv/bin/activate
git pull
python manage.py migrate
python manage.py collectstatic
sudo systemctl restart apache2
```

## Sauvegarde

Pour sauvegarder la base de données :
```bash
python manage.py dumpdata > backup.json
```

Pour restaurer :
```bash
python manage.py loaddata backup.json
