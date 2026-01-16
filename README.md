# Dashboard - Gestion de Stock avec IA

Application web de gestion de stock développée avec Next.js, intégrant une IA pour enrichir l'expérience utilisateur.

## 🚀 Fonctionnalités

### Dashboard
- **Statistiques principales** : Stock total, valeur du stock, produits vendus, valeur des ventes
- **Graphique des ventes** : Visualisation des ventes par catégorie (Bar chart)
- **Analyse IA** : Génération automatique d'analyses de performance des ventes
- **Tableau des dernières ventes** : Filtrage par catégorie et tri par date/quantité

### Gestion des Produits
- **Liste des produits** : Affichage en tableau avec recherche, filtres et tri
- **Détail produit** : Consultation et modification des informations
- **Ajout de produit** : Formulaire complet avec validation
- **Modification/Suppression** : Gestion complète du CRUD

## 🛠️ Technologies

- **Next.js 14** (App Router)
- **Redux Toolkit** pour la gestion d'état globale
- **Tailwind CSS** pour le styling
- **Chart.js** pour les graphiques
- **React Hot Toast** pour les notifications
- **Framer Motion** pour les animations
- **Lucide React** pour les icônes
- **JSON-server** pour simuler l'API backend
- **Jest & React Testing Library** pour les tests

## 📦 Installation

1. Installer les dépendances :
```bash
npm install
```

2. Démarrer JSON-server (dans un terminal séparé) :
```bash
npm run json-server
```

3. Démarrer l'application Next.js :
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`
JSON-server sera accessible sur `http://localhost:3001`

## 📁 Structure du Projet

```
app/
├── components/          # Composants réutilisables
│   ├── Cards/          # Cartes statistiques
│   ├── Charts/         # Graphiques
│   ├── Forms/          # Formulaires
│   ├── Layout/         # Layout (Header, etc.)
│   ├── Modal/          # Modales
│   └── Table/          # Tableaux
├── pages/              # Pages Next.js
│   ├── page.js         # Dashboard
│   └── products/       # Pages produits
├── store/              # Redux Store
│   ├── slices/         # Redux Slices
│   ├── selectors.js    # Selectors Redux
│   └── store.js        # Configuration du store
├── services/           # Services (IA, API, etc.)
└── providers/          # Providers React
```

## 🔧 Configuration Redux

Le store Redux contient deux slices principaux :
- **productsSlice** : Gestion des produits (fetch, add, update, delete)
- **salesSlice** : Gestion des ventes (fetch)

Les selectors permettent d'accéder facilement aux données calculées :
- `selectTotalStock` : Stock total
- `selectTotalStockValue` : Valeur totale du stock
- `selectTotalProductsSold` : Nombre de produits vendus
- `selectTotalSalesValue` : Valeur totale des ventes

## 🧪 Tests

Exécuter les tests :
```bash
npm test
```

Exécuter les tests en mode watch :
```bash
npm run test:watch
```

## 📝 Notes

- L'analyse IA est actuellement simulée. Pour utiliser une vraie API IA (OpenAI, Gemini), modifier le fichier `app/services/aiService.js`
- Les images utilisent Cloudinary (configuré dans `next.config.js`)
- Le projet utilise JavaScript (JSX) et non TypeScript pour faciliter la compréhension

## 🎯 Prochaines Étapes

- Intégration d'une vraie API IA (OpenAI ou Google Gemini)
- Ajout de plus de tests unitaires
- Amélioration de la gestion des erreurs
- Ajout de la pagination pour les grandes listes
- Export des données en CSV/Excel

