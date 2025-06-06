mon-projet-technique

Ce dépôt contient deux sous-projets :

- backend/ : API Django REST Framework
- frontend/ : application ReactJS

---

Prérequis

- Python 3.11+
- Node.js 18+ et npm
- Git
- (Optionnel en dev) SQLite (fourni par défaut avec Django)

---

1. Cloner le dépôt

     git clone [https://github.com/haykel/mon-projet-technique.git]
     cd mon-projet-technique

---

2. Lancer le back-end (Django)

      cd backend

      2.1. Créer et activer un environnement virtuel :

            python3 -m venv .venv

            source .venv/bin/activate

      2.2. Installer les dépendances :

            pip install --upgrade pip
   
            pip install -r requirements.txt

      2.3. Configurer les variables d’environnement
            Créez un fichier .env à la racine de backend/ (ne pas versionner ce fichier) :

            SECRET_KEY=une_clé_secrète_de_votre_choix
   
            DEBUG=True
   
            DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
   
            DATABASE_URL=sqlite:///db.sqlite3

      2.4. Appliquer les migrations et créer un super-utilisateur :

            python manage.py migrate
   
            python manage.py createsuperuser

      2.5. Démarrer le serveur Django :

            python manage.py runserver

            - L’API est disponible sur http://localhost:8000/api/
   
            - La documentation Swagger sur http://localhost:8000/swagger/

---

3. Lancer le front-end (React)

      cd frontend

      3.1. Installer les dépendances :

         npm install

      3.2. Configurer la variable d’environnement
         Créez un fichier .env à la racine de frontend/ (qui contient l'url de base de DRF) :

         REACT_APP_API_BASE_URL=http://localhost:8000/api/

      3.3. Démarrer le serveur de développement :

         npm start

         - L’application React est disponible sur http://localhost:3000

