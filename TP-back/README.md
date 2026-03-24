🛒 TP – Mon Petit Commerce

API Express + MongoDB + Authentification JWT

1. Contexte

Vous allez développer le back-end d’un mini site e-commerce nommé « Mon Petit Commerce ».
Le front-end (HTML, CSS, JavaScript avec Tailwind) est déjà fourni et communique avec une API REST.
Votre mission consiste à implémenter l’ensemble de l’API en utilisant Node.js, Express, MongoDB et Mongoose, ainsi que les outils suivants : JWT, bcrypt et Joi (ou express-validator).

2. Objectifs pédagogiques

À la fin de ce TP, vous devez être capable de :
    Mettre en place un projet Express structuré (routes, contrôleurs, middlewares)
    Connecter une application Node.js à MongoDB via Mongoose
    Modéliser des données avec des schémas Mongoose
    Implémenter des opérations CRUD complètes
    Gérer une authentification avec bcrypt et JSON Web Token (JWT)
    Protéger des routes avec des middlewares d’authentification et de rôles
    Valider les données d’une requête via Joi ou express-validator
    Implémenter des opérations métier simples (commande, calcul de total)

3. Description fonctionnelle
3.1 Rôles et acteurs

Visiteur (non authentifié)
    Peut consulter le catalogue de produits
    Peut ajouter des produits au panier côté front (localStorage)
    Ne peut pas créer de commande

Client (rôle customer)
    Peut créer un compte et se connecter
    Peut consulter le catalogue
    Peut passer une commande
    Peut consulter ses propres commandes

Administrateur (rôle admin)
    Dispose de tous les droits du client
    Peut gérer les produits (CRUD complet)
    Peut consulter toutes les commandes
    Peut modifier le statut des commandes

3.2 Pages front-end (déjà fournies)

index.html
    Affiche le catalogue des produits avec recherche, filtres et ajout au panier

cart.html
    Gestion du panier et validation de commande

auth.html
    Inscription et connexion

admin.html
    Dashboard administrateur (gestion des produits et des commandes)

Le front-end ne doit pas être modifié (sauf ajustements mineurs).
Votre rôle est de connecter l’API afin de le rendre fonctionnel.

4. Travail demandé

    Initialiser un projet Node.js avec Express
    Configurer la connexion à MongoDB avec Mongoose
    Créer les modèles User, Product et Order
    Implémenter les routes de l’API
    Mettre en place l’authentification avec bcrypt et JWT
    Protéger certaines routes avec des middlewares :
    auth : vérifie le token JWT
    isAdmin : vérifie le rôle admin
    Valider les données des requêtes avec Joi ou express-validator
    Gérer les erreurs avec des codes HTTP appropriés et des messages explicites

5. Spécifications techniques
5.2 Modèles de données
5.2.1 Modèle User

Collection : users

Champs :
    email
    Type : String
    Obligatoire
    Unique
    Format email

password
    Type : String
    Obligatoire
    Longueur minimale : 6

role
    Type : String
    Valeurs possibles : customer, admin
    Valeur par défaut : customer

createdAt
    Type : Date
    Valeur par défaut : Date.now


Contraintes
Le mot de passe doit être hashé avec bcrypt avant enregistrement
Le mot de passe ne doit jamais être renvoyé dans les réponses JSON