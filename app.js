// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBII51GAaqwOSRePYgtcfXCz3LBsEuipHA",
    authDomain: "maillard-lens-prototype.firebaseapp.com",
    projectId: "maillard-lens-prototype",
    storageBucket: "maillard-lens-prototype.firebasestorage.app",
    messagingSenderId: "605811625955",
    appId: "1:605811625955:web:d72d4ee6f33e59c5df5ad6",
    measurementId: "G-JBJR3MJC0M"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    getDoc,
    updateDoc, 
    deleteDoc, 
    doc,
    query,
    orderBy 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const addProductBtn = document.getElementById('addProductBtn');
const productFormContainer = document.getElementById('productFormContainer');
const productForm = document.getElementById('productForm');
const formTitle = document.getElementById('formTitle');
const cancelBtn = document.getElementById('cancelBtn');
const productsList = document.getElementById('productsList');

// Form fields
const productId = document.getElementById('productId');
const productName = document.getElementById('productName');
const proteinSource = document.getElementById('proteinSource');
const reducingSugar = document.getElementById('reducingSugar');
const sweetenerType = document.getElementById('sweetenerType');
const browningRisk = document.getElementById('browningRisk');
const notes = document.getElementById('notes');

// Show/hide form
addProductBtn.addEventListener('click', () => {
    productFormContainer.classList.remove('hidden');
    formTitle.textContent = 'Add New Product';
    resetForm();
});

cancelBtn.addEventListener('click', () => {
    productFormContainer.classList.add('hidden');
    resetForm();
});

// Reset form
function resetForm() {
    productForm.reset();
    productId.value = '';
}

// Handle form submission
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate product name
    if (!productName.value.trim()) {
        alert('Please enter a product name.');
        return;
    }

    const productData = {
        productName: productName.value.trim(),
        proteinSource: proteinSource.value.trim(),
        reducingSugar: reducingSugar.value.trim(),
        sweetenerType: sweetenerType.value.trim(),
        browningRisk: browningRisk.value,
        notes: notes.value.trim(),
        updatedAt: new Date().toISOString()
    };

    try {
        if (productId.value) {
            // Update existing product
            const productRef = doc(db, 'products', productId.value);
            await updateDoc(productRef, productData);
            alert('Product updated successfully!');
        } else {
            // Add new product
            productData.createdAt = new Date().toISOString();
            await addDoc(collection(db, 'products'), productData);
            alert('Product added successfully!');
        }

        productFormContainer.classList.add('hidden');
        resetForm();
        loadProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Error saving product. Please try again.');
    }
});

// Load products from Firestore
async function loadProducts() {
    productsList.innerHTML = '<div class="loading">Loading products...</div>';

    try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        productsList.innerHTML = '';

        if (querySnapshot.empty) {
            productsList.innerHTML = `
                <div class="empty-state">
                    <p>No products yet. Click "Add Product" to get started!</p>
                </div>
            `;
            return;
        }

        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const productCard = createProductCard(doc.id, product);
            productsList.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        productsList.innerHTML = `
            <div class="error-message">
                Error loading products. Please check your Firebase configuration.
            </div>
        `;
    }
}

// Create product card element
function createProductCard(id, product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    const riskClass = getRiskClass(product.browningRisk);

    card.innerHTML = `
        <h3>${escapeHtml(product.productName)}</h3>
        <div class="product-info">
            ${product.proteinSource ? `<div class="product-info-item"><strong>Protein:</strong> ${escapeHtml(product.proteinSource)}</div>` : ''}
            ${product.reducingSugar ? `<div class="product-info-item"><strong>Reducing Sugar:</strong> ${escapeHtml(product.reducingSugar)}</div>` : ''}
            ${product.sweetenerType ? `<div class="product-info-item"><strong>Sweetener:</strong> ${escapeHtml(product.sweetenerType)}</div>` : ''}
            ${product.browningRisk ? `<div class="product-info-item"><strong>Risk:</strong> <span class="risk-badge ${riskClass}">${escapeHtml(product.browningRisk)}</span></div>` : ''}
        </div>
        ${product.notes ? `<div class="product-notes">${escapeHtml(product.notes)}</div>` : ''}
        <div class="product-actions">
            <button class="btn btn-edit" onclick="editProduct('${id}')">Edit</button>
            <button class="btn btn-danger" onclick="deleteProduct('${id}')">Delete</button>
        </div>
    `;

    return card;
}

// Get risk class for styling
function getRiskClass(risk) {
    switch (risk?.toLowerCase()) {
        case 'low':
            return 'risk-low';
        case 'moderate':
            return 'risk-moderate';
        case 'high':
            return 'risk-high';
        default:
            return '';
    }
}

// Edit product
window.editProduct = async (id) => {
    try {
        const productRef = doc(db, 'products', id);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
            const product = productSnap.data();
            productId.value = id;
            productName.value = product.productName || '';
            proteinSource.value = product.proteinSource || '';
            reducingSugar.value = product.reducingSugar || '';
            sweetenerType.value = product.sweetenerType || '';
            browningRisk.value = product.browningRisk || '';
            notes.value = product.notes || '';

            formTitle.textContent = 'Edit Product';
            productFormContainer.classList.remove('hidden');
            
            // Scroll to form
            productFormContainer.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Error loading product for edit:', error);
        alert('Error loading product. Please try again.');
    }
};

// Delete product
window.deleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await deleteDoc(doc(db, 'products', id));
            alert('Product deleted successfully!');
            loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product. Please try again.');
        }
    }
};

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load products on page load
loadProducts();
