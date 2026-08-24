# 💱 Currency Converter

Un convertisseur de devises simple, rapide et pensé pour le mobile — né d'une frustration bien concrète : devoir jongler entre plusieurs sites pour connaître un taux de change au moment de finaliser un achat en ligne.

🔗 **Démo en ligne :** https://currency-converter-ep2x.onrender.com/

## Pourquoi ce projet

En naviguant régulièrement sur des sites d'achat et d'abonnement affichant leurs prix uniquement dans des devises étrangères, 
j'étais obligé de multiplier les onglets et les sites de conversion — souvent en oubliant lequel j'avais utilisé la fois précédente. 
Ce projet répond à ce besoin précis : un outil unique, fiable, et rapide d'accès.

## ✨ Fonctionnalités

- Conversion entre plus de 150 devises
- Recherche de devise par nom ou par code (Bientot disponible)
- Bouton d'inversion rapide entre devise source et devise cible
- Interface responsive, pensée mobile-first

## 🛠️ Stack technique

- **Backend :** Python / Django
- **Frontend :** HTML, CSS, JavaScript (vanilla, sans framework)
- **API de taux de change :** [AllRatesToday](https://allratestoday.com)
- **Déploiement :** Render

## 🚀 Installation en local

### Prérequis
- Python 3.10+
- Une clé API [AllRatesToday](https://allratestoday.com) (gratuite)

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/Carbouba/Currency_Converter.git
cd Currency_Converter

# 2. Créer et activer un environnement virtuel
python -m venv venv
source venv/bin/activate      # Linux/Mac
venv\Scripts\activate         # Windows

# 3. Installer les dépendances
pip install -r requirements.txt

# 4. Configurer les variables d'environnement
cp .env.example .env
# puis éditer .env et renseigner votre clé API :
# SECRET_KEY=votre_cle_secrete_django
# API_KEY=votre_cle_allratestoday
# DEBUG=True

# 5. Appliquer les migrations
python manage.py migrate

# 6. Lancer le serveur de développement
python manage.py runserver
```

L'application est alors accessible sur `http://127.0.0.1:8000`.

## 📁 Structure du projet

```
├── ConverApp/
│   ├── static/ConverApp/
│   │   ├── style.css
│   │   └── script.js
│   ├── templates/ConverApp/
│   │   └── index.html
│   ├── views.py
│   └── urls.py
├── manage.py
├── requirements.txt
└── .env.example
```

## 🔒 Sécurité

La clé API n'est jamais exposée côté client : toutes les requêtes vers l'API AllRatesToday transitent par une vue Django qui fait office de proxy, 
en gardant la clé côté serveur (variable d'environnement, jamais commitée).

## 🤝 Contribuer

Ce projet est libre et ouvert aux contributions — suggestions de fonctionnalités, corrections de bugs, ou améliorations sont les bienvenues. N'hésitez pas à ouvrir une issue ou une pull request.

📄 Licence

Distribué sous licence MIT — voir le fichier [LICENSE](https://github.com/Carbouba/Currency_Converter/blob/main/LICENSE) pour plus de détails.