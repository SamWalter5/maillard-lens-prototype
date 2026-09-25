# Maillard Lens Prototype

## Description
Maillard Lens Prototype is a simple web application for storing and managing food-product information related to Maillard browning. Users can add products and record information such as protein source, reducing sugar, sweetener type, browning risk, and notes. The application allows users to create, view, edit, and delete product records.

## Features
- Add food products with detailed Maillard browning information
- View all stored products in an organized list
- Edit existing product information
- Delete products from the database
- Store product data using Firebase Firestore
- Responsive design that works on desktop and mobile devices

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6+)
- Firebase Firestore
- GitHub
- Netlify

## Setup Instructions

### Prerequisites
- A modern web browser
- A Firebase account
- A GitHub account
- A Netlify account (for deployment)

### Local Setup
1. Clone this repository to your local machine
2. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
3. Enable Firestore Database in your Firebase project
4. Add a Web App in Firebase to get your configuration
5. Replace the `firebaseConfig` object in `app.js` with your actual Firebase configuration
6. Open `index.html` in your web browser

### Firebase Configuration
To connect your app to Firebase:
1. Go to your Firebase project console
2. Click on the gear icon (Project Settings)
3. Scroll down to "Your apps" and click on the web icon (</>)
4. Register your app and copy the configuration object
5. Replace the placeholder config in `app.js` with your actual values

## Deployed Application
https://6ab6ea926eda285cd22f5b16--whimsical-gecko-ec3928.netlify.app/

## Demo Video
[Link will be added after recording]

## Project Structure
```
maillard-lens-prototype/
├── index.html      # Main HTML structure
├── style.css       # Application styling
├── app.js          # JavaScript logic and Firebase integration
└── README.md       # Project documentation
```

## Database Schema
The application uses a single Firestore collection called `products` with the following fields:
- `productName`: Name of the food product (required)
- `proteinSource`: Protein type (e.g., Whey, Soy, Pea)
- `reducingSugar`: Reducing sugar type (e.g., Glucose, Fructose, Lactose)
- `sweetenerType`: Sweetener classification (e.g., Natural Sugar, Sugar Alcohol)
- `browningRisk`: Risk level (Low, Moderate, High)
- `notes`: Optional additional information
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

## Usage
1. Click "+ Add Product" to open the product form
2. Fill in the product details (Product Name is required)
3. Select the browning risk level from the dropdown
4. Click "Save Product" to add it to the database
5. Products will appear in the list below the form
6. Use "Edit" to modify product information
7. Use "Delete" to remove a product (with confirmation)

## License
This project is part of an academic assignment for EGN 4952.
