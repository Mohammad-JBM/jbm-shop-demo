// Dom Node Selector
const hamIcon = document.querySelector(".hamber");
const mobileNav = document.querySelector(".mobileNav");
const productsSection = document.querySelector(".products");
const discountCloseBTN = document.querySelector(".discount .content .close");
const discountSection = document.querySelector(".discount");
const discountCodeSection = document.querySelector(".discount .content .right span");
const basket = document.querySelector("header .options .basket");
const myBasket = document.querySelector(".myBasket");
const basketContetentSection = document.querySelector(".myBasket .content");
const closeMyBaksetSection = document.querySelector(".myBasket .content .close");
const buySection = document.querySelector(".buy");
const closeBuySection = document.querySelector(".buy .contents .close");
const payButton = document.querySelector(".myBasket .content .payBTN .payButton");
const productInBasket = document.querySelector(".productsInBasket");
const deleteProductFromBasket = document.querySelectorAll(".productsInBasket .product .delete");
const subtotalSection = document.querySelector(".myBasket .content .payment .total .finalPrice .totalPrice")

const discountInputCode = document.querySelector(".discountInput input");
const discountActivateBTN = document.querySelector(".discountInput .activateDiscount");
const priceAfterDiscountSpan = document.querySelector(".money .number .priceToPay");
const buyAllProduct = document.querySelector(".contents .btn .buyBTN");

const accessCloseBTN = document.querySelector(".access .allOptions .close");
const accessOptions = document.querySelector(".access .allOptions");
const eyeForShowAccess = document.querySelector(".eye");

let subtotal = 0;

let basketAddedProduct = []


const basketCountNumber = document.querySelector(".basket span");
let basketCount = 0;

const successfullSection = document.querySelector(".successful");

// Access FontSize
const increaseFontBtn = document.querySelector(".increaseFontSize");
const decreaseFontBtn = document.querySelector(".decreaseFontSize");

let currentFontSize = 16;
const minFontSize = 14;
const maxFontSize = 20;


function updateFontSize() {
    document.documentElement.style.fontSize = `${currentFontSize}px`;
}

increaseFontBtn.addEventListener("click", () => {
    if (currentFontSize < maxFontSize) {
        currentFontSize += 1.5;
        updateFontSize();
    } else {
        ""
    }
});

decreaseFontBtn.addEventListener("click", () => {
    if (currentFontSize > minFontSize) {
        currentFontSize -= 1.5;
        updateFontSize();
    } else {
        ""
    }
});

updateFontSize();

// Contrast
const increaseContrastBtn = document.querySelector(".increaseContrast");
const decreaseContrastBtn = document.querySelector(".decreaseContrast");

const contrastLayer = document.querySelector(".contrast-layer");

let currentContrast = 100;
const minContrast = 70;
const maxContrast = 140;

function updateContrast() {
    contrastLayer.style.backdropFilter = `contrast(${currentContrast}%)`;
}

increaseContrastBtn.addEventListener("click", () => {
    if (currentContrast < maxContrast) {
        currentContrast += 10;
        updateContrast();
    }
});

decreaseContrastBtn.addEventListener("click", () => {
    if (currentContrast > minContrast) {
        currentContrast -= 10;
        updateContrast();
    }
});

updateContrast();




// Event
hamIcon.addEventListener("click", mobileNavBar);
discountCloseBTN.addEventListener("click", discountClose)
basket.addEventListener("click", seeAllProduct)
closeMyBaksetSection.addEventListener("click", () => {
    myBasket.classList.remove("showMyBasket");
    basketContetentSection.classList.remove("contentShow");
})
closeBuySection.addEventListener("click", () => {
    buySection.classList.remove("showBuySection")
})
payButton.addEventListener("click", finalPurchase);

productInBasket.addEventListener("click", (e) => {
    if (productInBasket.children.length === 0) return;

    // Delete Product
    if (e.target.classList.contains("fa-trash")) {
        const parent = e.target.closest(".product");
        if (parent) {
            const title = parent.querySelector("h5").textContent.trim();

            parent.remove();
            basketAddedProduct = basketAddedProduct.filter(item => item.title !== title);

            basketCount--;
            basketCountNumber.textContent = basketCount;
            updateSubtotal()
        }
    }

    // increase count
    if (e.target.classList.contains("increase")) {
        const parent = e.target.closest(".product");
        const title = parent.querySelector("h5").textContent.trim();
        const countElement = parent.querySelector(".count");

        const product = basketAddedProduct.find(item => item.title === title);
        if (product) {
            product.count++;
            countElement.textContent = product.count;
            updateSubtotal()
        }
    }

    // decrease count
    if (e.target.classList.contains("decrease")) {
        const parent = e.target.closest(".product");
        const title = parent.querySelector("h5").textContent.trim();
        const countElement = parent.querySelector(".count");

        const product = basketAddedProduct.find(item => item.title === title);
        if (product && product.count > 1) {
            product.count--;
            countElement.textContent = product.count;
            updateSubtotal()
        }
    }
});

discountActivateBTN.addEventListener("click", activeDiscount);
buyAllProduct.addEventListener("click", buySuccessfull)
accessCloseBTN.addEventListener("click", () => {
    accessOptions.classList.remove("showAllOptions");
    eyeForShowAccess.classList.remove("hideEye");
})
eyeForShowAccess.addEventListener("click", () => {
    accessOptions.classList.add("showAllOptions");
    eyeForShowAccess.classList.add("hideEye");
})



// Fetch products
fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(product => {
        product.map(item => {
            if (
                item.category == "women's clothing" ||
                item.category == "men's clothing" ||
                item.category == "jewelery"
            ) {
                const { title, image, price } = item;
                let div = document.createElement("div");
                div.innerHTML = `
                    <div class="image">
                      <img src="${image}" width="150px">
                    </div>
                    <h4 class="title">${title}</h4>
                    <span class="price">$${price}</span>
                    <a>Add To Basket</a>
                    `;
                div.classList.add("product");
                productsSection.appendChild(div);
            }
        });

        const icons = document.querySelectorAll(".products .product a");
        for (const icon of icons) {
            icon.addEventListener("click", addProductToBasket);
        }
    });

// Functions
function mobileNavBar() {
    hamIcon.classList.toggle("hamberRotate");
    mobileNav.classList.toggle("mobileNavCliked");
}

function addProductToBasket(e) {
    e.preventDefault();

    const parent = e.target.closest(".product");

    const title = parent.querySelector(".title").textContent.trim();
    const price = parent.querySelector(".price").textContent.trim().replace("$", "");
    const image = parent.querySelector("img").src;

    const productInfo = {
        title,
        price,
        image,
        count: 1
    };

    const existingProduct = basketAddedProduct.find(item => item.title === productInfo.title);

    if (existingProduct) {
        existingProduct.count++;

        const basketProduct = [...productInBasket.querySelectorAll(".product")]
            .find(div => div.querySelector("h5").textContent.trim() === productInfo.title);
        if (basketProduct) {
            const countElement = basketProduct.querySelector(".count");
            countElement.textContent = existingProduct.count;
        }

    } else {
        basketAddedProduct.push(productInfo);

        let div = document.createElement("div");
        div.classList.add("product");
        div.innerHTML = `
            <img src="${productInfo.image}" alt="" width="90px">
            <div class="information">
                <h5>${productInfo.title}</h5>
                <i class="fa fa-minus decrease"></i>
                <span class="count">${productInfo.count}</span>
                <i class="fa fa-plus increase"></i>
                × $<span class="price">${productInfo.price}</span>
            </div>
            <div class="delete">
                <i class="fa fa-trash"></i>
            </div>
        `;
        productInBasket.appendChild(div);

        basketCount++;
        basketCountNumber.textContent = basketCount;
    }
}


// Discount Code Generator
let discountCode = "";
for (let i = 0; i < 10; i++) {
    if (Math.random() >= 0 && Math.random() < .25) {
        let uppercase = String.fromCharCode(Math.random() * 26 + 65);
        discountCode += uppercase
    } else if (Math.random() >= .25 && Math.random() < .5) {
        let lowercase = String.fromCharCode(Math.random() * 26 + 97);
        discountCode += lowercase
    } else if (Math.random() >= .5 && Math.random() < .75) {
        let number = String.fromCharCode(Math.random() * 10 + 48);
        discountCode += number
    } else if (Math.random() >= .75 && Math.random() < 1) {
        let specialCahracter = String.fromCharCode(Math.random() * 14 + 34);
        discountCode += specialCahracter
    }
}

setTimeout(() => {
    discountSection.classList.add("discountShown")
    discountCodeSection.textContent = discountCode
}, 3000)

function discountClose() {
    discountSection.classList.remove("discountShown");
}


function seeAllProduct() {
    myBasket.classList.add("showMyBasket");
    basketContetentSection.classList.add("contentShow");
    updateSubtotal()
}

function finalPurchase() {
    buySection.classList.add("showBuySection")
    priceAfterDiscountSpan.textContent = totalWithTax;
}


let totalWithTax;
function updateSubtotal() {
    subtotal = basketAddedProduct.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.count);
    }, 0);

    const tax = subtotal * 0.09;
    totalWithTax = subtotal + tax;

    subtotalSection.textContent = `$${subtotal}`;
}

function activeDiscount() {
    if (discountInputCode.value == "") {
        discountInputCode.classList.add("incorrectCode");
        setTimeout(() => {
            discountInputCode.classList.remove("incorrectCode");
        }, 4000)

    } else if (discountInputCode.value !== discountCode) {
        discountInputCode.value = ""
        discountInputCode.classList.add("incorrectCode");
        setTimeout(() => {
            discountInputCode.classList.remove("incorrectCode");
        }, 4000)

    } else {
        let discount = totalWithTax * 0.8
        priceAfterDiscountSpan.textContent = discount;
    }
}

function buySuccessfull() {
    successfullSection.classList.add("showSuccessfull");
    setTimeout(() => {
        successfullSection.classList.remove("showSuccessfull");
    }, 3000)
}
