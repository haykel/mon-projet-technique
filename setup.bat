:: Auteur : Haykel Jabri – http://extia-group.com/
@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

:: -------------------------------------------------------------------
:: Variables (à adapter si besoin)
:: -------------------------------------------------------------------
set BASE_DIR=%~dp0
set BACKEND_DIR=%BASE_DIR%mon_projet
set FRONTEND_DIR=%BASE_DIR%devis-front
set VENV_DIR=%BACKEND_DIR%\.venv

:: Valeurs par défaut pour .env (back-end)
set DJANGO_SECRET_KEY=changez_cette_cle_secrete
set DJANGO_DEBUG=True
set DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
set DJANGO_DATABASE_URL=sqlite:///%BACKEND_DIR%/db.sqlite3

:: Valeur par défaut pour .env (front-end)
set REACT_APP_API_BASE_URL=http://localhost:8000/api/

:: Identifiants du super-utilisateur
set SUPERUSER_NAME=admin
set SUPERUSER_EMAIL=admin@example.com
set SUPERUSER_PASSWORD=admin

:: -------------------------------------------------------------------
:: 1. Back-end Django
:: -------------------------------------------------------------------
echo.
echo ================================
echo 1. Configuration du back-end
echo ================================
echo.

cd /d "%BACKEND_DIR%" || (
  echo ERREUR : dossier "mon_projet" introuvable.
  pause
  exit /b 1
)

:: 1.1. Créer et activer le virtualenv si nécessaire
if not exist "%VENV_DIR%" (
    echo -> Création de l'environnement virtuel…
    python -m venv .venv
    if %ERRORLEVEL% neq 0 (
        echo ERREUR : échec de la création du virtualenv.
        pause
        exit /b 1
    )
) else (
    echo -> Virtualenv existant détecté, on le réutilise…
)

echo -> Activation du virtualenv…
call "%VENV_DIR%\Scripts\activate.bat" || (
    echo ERREUR : impossible d'activer le virtualenv.
    pause
    exit /b 1
)

:: 1.2. Installer les dépendances
echo -> Installation des dépendances Python…
pip install --upgrade pip
pip install -r requirements.txt

:: 1.3. Créer .env si absent
if not exist ".env" (
    echo -> Création du fichier .env pour Django…
    (
      echo SECRET_KEY=%DJANGO_SECRET_KEY%
      echo DEBUG=%DJANGO_DEBUG%
      echo DJANGO_ALLOWED_HOSTS=%DJANGO_ALLOWED_HOSTS%
      echo DATABASE_URL=%DJANGO_DATABASE_URL%
    ) > .env
    echo (.env créé)
) else (
    echo -> Fichier .env déjà existant (backend\.env).
)

:: 1.4. Appliquer les migrations
echo -> Appliquer les migrations Django…
python manage.py migrate

:: 1.5. Créer automatiquement le super-utilisateur "%SUPERUSER_NAME%" si nécessaire
echo -> Vérification/création du super-utilisateur "%SUPERUSER_NAME%"…
:: Génération d'un petit script Python temporaire pour créer le superuser
(
  echo import os
  echo import django
  echo os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mon_projet.settings")
  echo django.setup()
  echo from django.contrib.auth import get_user_model
  echo User = get_user_model()
  echo if not User.objects.filter(username="%SUPERUSER_NAME%").exists():
  echo     User.objects.create_superuser(username="%SUPERUSER_NAME%",^
  echo     email="%SUPERUSER_EMAIL%",^
  echo     password="%SUPERUSER_PASSWORD%")
) > create_superuser.py

python create_superuser.py
del create_superuser.py

:: 1.6. Démarrage du serveur Django en arrière-plan
echo -> Démarrage du serveur Django sur http://localhost:8000/ …
start "Back-end Django" cmd /k "call \"%VENV_DIR%\Scripts\activate.bat\" ^&^& python manage.py runserver"

:: Revenir au dossier principal
cd /d "%BASE_DIR%"

:: -------------------------------------------------------------------
:: 2. Front-end React
:: -------------------------------------------------------------------
echo.
echo ================================
echo 2. Configuration du front-end
echo ================================
echo.

cd /d "%FRONTEND_DIR%" || (
  echo ERREUR : dossier "devis-front" introuvable.
  pause
  exit /b 1
)

:: 2.1. Installer les dépendances npm
echo -> Installation des dépendances npm…
npm install

:: 2.2. Créer .env si absent
if not exist ".env" (
    echo -> Création du fichier .env pour React…
    echo REACT_APP_API_BASE_URL=%REACT_APP_API_BASE_URL% > .env
    echo (.env créé)
) else (
    echo -> Fichier .env déjà existant (frontend\.env).
)

:: 2.3. Démarrage du serveur React dans une nouvelle fenêtre
echo -> Démarrage du serveur React sur http://localhost:3000/ …
start "Front-end React" cmd /k "npm start"

:: Retour au dossier principal
cd /d "%BASE_DIR%"

echo.
echo ================================
echo Serveurs Django et React démarrés
echo ================================
echo - Django : http://localhost:8000/
echo - React  : http://localhost:3000/
echo.
pause
