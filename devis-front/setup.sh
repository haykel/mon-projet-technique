#!/usr/bin/env bash
set -e

# Auteur : Haykel Jabri – http://extia-group.com/

# --------------------------------------------
# Variables (à adapter si nécessaire)
# --------------------------------------------
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$BASE_DIR/mon_projet"
FRONTEND_DIR="$BASE_DIR/devis-front"
VENV_DIR="$BACKEND_DIR/.venv"

# Valeurs par défaut pour .env (backend)
DJANGO_SECRET_KEY="changez_cette_cle_secrete"
DJANGO_DEBUG="True"
DJANGO_ALLOWED_HOSTS="localhost,127.0.0.1"
DJANGO_DATABASE_URL="sqlite:///$BACKEND_DIR/db.sqlite3"

# Valeur par défaut pour .env (frontend)
REACT_APP_API_BASE_URL="http://localhost:8000/api/"

# Identifiants du super-utilisateur
SUPERUSER_NAME="admin"
SUPERUSER_EMAIL="admin@example.com"
SUPERUSER_PASSWORD="admin"

# --------------------------------------------
# 1. Back-end Django
# --------------------------------------------
echo
echo "================================"
echo "1. Configuration du back-end"
echo "================================"
echo

if [ ! -d "$BACKEND_DIR" ]; then
  echo "ERREUR : dossier 'mon_projet' introuvable."
  exit 1
fi

cd "$BACKEND_DIR"

# 1.1. Créer et activer le virtualenv si nécessaire
if [ ! -d "$VENV_DIR" ]; then
  echo "-> Création de l'environnement virtuel Python…"
  python3 -m venv .venv
fi

echo "-> Activation du virtualenv…"
source "$VENV_DIR/bin/activate"

# 1.2. Installer les dépendances
echo "-> Installation des dépendances Python…"
pip install --upgrade pip
pip install -r requirements.txt

# 1.3. Créer .env si absent
if [ ! -f ".env" ]; then
  echo "-> Création du fichier .env pour Django…"
  cat << EOF > .env
SECRET_KEY=$DJANGO_SECRET_KEY
DEBUG=$DJANGO_DEBUG
DJANGO_ALLOWED_HOSTS=$DJANGO_ALLOWED_HOSTS
DATABASE_URL=$DJANGO_DATABASE_URL
EOF
  echo "(.env créé)"
fi

# 1.4. Appliquer les migrations
echo "-> Appliquer les migrations Django…"
python manage.py migrate

# 1.5. Créer automatiquement le super-utilisateur 'admin' si besoin
echo "-> Vérification/création du super-utilisateur '$SUPERUSER_NAME'…"
python3 - <<PYCODE
import os
import django
from django.contrib.auth import get_user_model

# Charger le settings Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mon_projet.settings")
django.setup()

User = get_user_model()
if not User.objects.filter(username="$SUPERUSER_NAME").exists():
    print("   Création du super-utilisateur '$SUPERUSER_NAME'")
    User.objects.create_superuser(
        username="$SUPERUSER_NAME",
        email="$SUPERUSER_EMAIL",
        password="$SUPERUSER_PASSWORD"
    )
else:
    print("   Le super-utilisateur '$SUPERUSER_NAME' existe déjà.")
PYCODE

# 1.6. Démarrage du serveur Django en arrière-plan
echo "-> Démarrage du serveur Django sur http://localhost:8000/"
python manage.py runserver &

# Revenir au dossier racine
cd "$BASE_DIR"

# --------------------------------------------
# 2. Front-end React
# --------------------------------------------
echo
echo "================================"
echo "2. Configuration du front-end"
echo "================================"
echo

if [ ! -d "$FRONTEND_DIR" ]; then
  echo "ERREUR : dossier 'devis-front' introuvable."
  exit 1
fi

cd "$FRONTEND_DIR"

# 2.1. Installer les dépendances npm
echo "-> Installation des dépendances npm…"
npm install

# 2.2. Créer .env si absent
if [ ! -f ".env" ]; then
  echo "-> Création du fichier .env pour React…"
  cat << EOF > .env
REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
EOF
  echo "(.env créé)"
fi

# 2.3. Démarrage du serveur React
echo "-> Démarrage du serveur React sur http://localhost:3000/"
npm start &

# Retour au dossier racine
cd "$BASE_DIR"

echo
echo "================================"
echo "Serveurs Django et React démarrés"
echo "================================"
echo "- Django : http://localhost:8000/"
echo "- React  : http://localhost:3000/"
echo
