const productDiv = document.querySelector('#productItems');
const productsCompleteCount = document.querySelector('#allProducts');
const shimmerWrapperContainer = document.querySelector('#shimmer_container');
const loadBtn = document.querySelector('#load_btn');
const categoryChecks = document.querySelectorAll('.filter__category-checkbox');
const sortDropdown = document.querySelector('#sort');
const searchInputField = document.querySelector('#searchInput');

let productDetails = [];
let allProductCount = 0;
let orderedProducts = [];

async function retireveProducts() {
    startShimmer();  
    try {
        const res = await fetch('https://fakestoreapi.com/products',{mode:'cors'});
        if (res.ok) {
            const data = await res.json();
            productDetails = data;
            productsCompleteCount.textContent = `${productDetails.length} Results`;
            renderProducts();
        }
         
    } catch (error) {
        console.error('Error in fetching the api:', error);
        renderError('No Product Found!');
    } finally {
        stopShimmer();
    }
}

function startShimmer() {
    shimmerWrapperContainer.style.display = 'grid'; 
    productDiv.style.display = 'none';  
}

function stopShimmer() {
    shimmerWrapperContainer.style.display = 'none'; 
    productDiv.style.display = 'grid';  
}

function renderError(message) {
    const errorBox = Object.assign(document.createElement('div'), {
        className: 'error-message-container', innerHTML: `<b>${message}</b>`
    });
    productDiv.appendChild(errorBox);
}

function renderProducts() {
    let errorDiv = document.querySelector(".error-message-container");
    if(!errorDiv){ 
    orderedProducts = filterProduct(productDetails);
    const sortedProducts = orderProductsByPrice(orderedProducts);
    const sortedProductBatch = sortedProducts.slice(allProductCount, allProductCount + 10);
    if (allProductCount === 0) {
        productDiv.innerHTML = ''; 
    }
    if (sortedProductBatch.length === 0) {
        loadBtn.style.display = 'none'; 
        return;
    }
    sortedProductBatch.forEach(product => {
        const productUnit = document.createElement('div');
        productUnit.classList.add('products__item');
        productUnit.innerHTML = `
            <div class="product__image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product__description">
                <p class="product_title">${product.title}</p>
                <p class="price">$${product.price}</p>
                <button class="products__like-button" aria-label="Like button">🤍</button>
            </div>`;

        const heartBtn = productUnit.querySelector('.products__like-button');
        heartBtn.addEventListener('click', () => {
            if (heartBtn.classList.toggle('liked')) {
                heartBtn.innerHTML = '🤍'; 
            } else {
                heartBtn.innerHTML = '🤍'; 
            }
        });

        productDiv.appendChild(productUnit);
    });

    allProductCount += sortedProductBatch.length; 
        if (allProductCount >= sortedProducts.length) {
            loadBtn.style.display = 'none'; 
        } else {
            loadBtn.style.display = 'block'; 
        }    
    }

}

function filterProduct(products) {
    const findProduct = searchInputField.value.toLowerCase();
    const checkCategory = Array.from(categoryChecks)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    const filtered = products.filter(product => {
        const findProductMatch = product.title.toLowerCase().includes(findProduct);
        const checkCategoryMatch = checkCategory.length > 0 ? checkCategory.includes(product.category) : true; 
        return findProductMatch && checkCategoryMatch;
    });
    productsCompleteCount.textContent = `${filtered.length} Results`; 
    if (allProductCount >= filtered.length) {
        allProductCount = 0; 
    }
    return filtered; 
}


function orderProductsByPrice(products) {
    const sortPriceCategory = sortDropdown.value;
    if (sortPriceCategory === 'low-to-high') {
        return products.sort((prodOne, prodTwo) => prodOne.price - prodTwo.price);
    } else if (sortPriceCategory === 'high-to-low') {
        return products.sort((prodOne, prodTwo) => prodTwo.price - prodOne.price);
    }
    return products;
}

loadBtn.addEventListener('click', renderProducts);

sortDropdown.addEventListener('change', () => {
    allProductCount = 0; 
    renderProducts();    
});

searchInputField.addEventListener('input', () => {
    allProductCount = 0; 
    renderProducts();     
});

categoryChecks.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
    allProductCount = 0; 
    renderProducts(); 
      
    });
});

window.onload = retireveProducts;

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const filters = document.querySelector('.filter');

    hamburger.addEventListener('click', () => {
        filters.classList.toggle('active');
    });
});
