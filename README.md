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

1. Créer et activer un environnement virtuel :

   python3 -m venv .venv
   
   source .venv/bin/activate

3. Installer les dépendances :

   pip install --upgrade pip
   
   pip install -r requirements.txt

5. Configurer les variables d’environnement
   Créez un fichier .env à la racine de backend/ (ne pas versionner ce fichier) :

   SECRET_KEY=une_clé_secrète_de_votre_choix
   
   DEBUG=True
   
   DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
   
   DATABASE_URL=sqlite:///db.sqlite3

7. Appliquer les migrations et créer un super-utilisateur :

   python manage.py migrate
   
   python manage.py createsuperuser

9. Démarrer le serveur Django :

   python manage.py runserver

   - L’API est disponible sur http://localhost:8000/api/
   - 
   - La documentation Swagger sur http://localhost:8000/swagger/

---

3. Lancer le front-end (React)

cd frontend

1. Installer les dépendances :

   npm install

2. Configurer la variable d’environnement
   Créez un fichier .env à la racine de frontend/ (ne pas versionner ce fichier) :

   REACT_APP_API_BASE_URL=http://localhost:8000/api/

3. Démarrer le serveur de développement :

   npm start

   - L’application React est disponible sur http://localhost:3000

---

4. Workflow rapide

1. Cloner le repo
2. Back-end

cd backend
source .venv/bin/activate       # ou .\.venv\Scripts\activate sous Windows
pip install -r requirements.txt
# Créer .env puis :
python manage.py migrate

python manage.py createsuperuser

python manage.py runserver

3. Front-end

cd frontend

npm install

npm start

4. Ouvrir le navigateur :
   - Back-end : http://localhost:8000/swagger/
   - Front-end : http://localhost:3000
