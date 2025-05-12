# **MemeGenerator - Générateur de Mèmes**  

**🚀 Transformez vos images en mèmes hilarants en quelques clics !**  
Un projet full-stack (React + Django) permettant de créer, éditer, partager et stocker des mèmes personnalisés.  

---

## **✨ Fonctionnalités**  

### **🎨 Création de Mèmes**  
- **Upload d'images** (sélection de fichier)  
- **Édition de texte** (haut/bas) avec personnalisation avancée :  
  - Choix de la couleur du texte et du contour  
  - Ajustement de la taille de police  
  - Positionnement dynamique (glisser-déposer)  
- **Aperçu en temps réel**  

### **📂 Gestion des Mèmes**  
- **Galerie** pour visualiser tous les mèmes créés  
- **Téléchargement** des mèmes au format JPG  
- **Partage** sur les réseaux sociaux (Facebook, Twitter, WhatsApp)  

### **🛠️ Technologie**  
| **Frontend**       | **Backend**       |  
|---------------------|-------------------|  
| React               | Django            |  
| React Router        | Django REST       |  
| Axios (HTTP)        | PostgreSQL        |  
| Canvas API          |                   |  

---

## **🎯 Installation**  

### **Prérequis**  
- Node.js (v16+)  
- Python (v3.9+)  
- PostgreSQL  

### **1. Frontend (React)**  
```bash
cd Frontend/meme_generator/
npm install
npm run dev  # http://localhost:5173/
```

### **2. Backend (Django)**  
```bash
cd Backend/
python manage.py runserver  # http://localhost:8000
```


## **📂 Structure du Projet**  
```
meme-generator/  
├── frontend/               # Application React  
│   ├── src/  
│   │   ├── pages/          # Vues (, Galerie, Aperçu)  
│   └── package.json  
│  
├── backend/                # API Django  
│   ├── core/                
│   │   ├── models.py       # Modèle "Meme"  
│   │   ├── views.py        # Logique API  
│   │   └── urls.py         # Routes  
│   └── manage.py  
│  
└── README.md  
```

---


## **📝 Licence**  
MIT License © 2023 - [Yoann DOSSOU-YOVO]  

---

## **💡 Auteurs & Contributions**  
- **Développeur** : [Yoann DOSSOU-YOVO]  
- **Contact** : [dossouyovoyoann@email.com]  

🔗 **Lien GitHub** : [github.com/Yoann2006](https://github.com/Yoann2006)  

---

**🎉 Prêt à créer des mèmes ? Lancez le projet et amusez-vous !**  

---

### **📌 Notes Supplémentaires**  
- **Optimisation** :  
  - Cache Cloudinary pour accélérer le chargement  
  - Lazy loading des images dans la galerie  
- **Améliorations Futures** :  
  - Ajout de templates prédéfinis  
  - Système de likes/commentaires  
  - Deploiement
  - Comptes utilisateurs

---
