const client = contentful.createClient({
  
  space: "a3vm02js8xw1",
 
  accessToken: "O_vjOpdaNFHwuT9o7i2NyjFdj6S4B1AR5PiazclAw2M"
});

console.log(client)

const productDOM = document.querySelector(".product-container")
const card = document.querySelector(".card")
const cartbtn = document.querySelector(".cart-btn")
const cartContent = document.querySelector(".cart-content")
let totalitem = document.querySelector(".total-item")
const clearcart = document.querySelector(".clear-cart")
const removeitem = document.querySelector(".removeitem")
const totalamount = document.querySelector(".totalamount")
const openCart= document.querySelector(".opencart")
const closeCart= document.querySelector(".close-cart")
const cartHome= document.querySelector(".carthome")
const Sidenav= document.querySelector(".sidenav")
const openList= document.querySelector(".listicon")
const closeList= document.querySelector(".closebtn")
const cartCard= document.querySelector(".cartcard")



let cart=[]
let ButtonDOM =[]

// to get the products
class Products {

async getProducts(){

//  to get ptoduct from contentful
        let contentful = await client.getEntries({
        content_type : "shopproducts"
            })
console.log(contentful)

//  to get ptoduct from local storage
let result =  await fetch("products.json")
let data = await result.json()

// console.log(data)

let products = contentful.items

products = products.map(item=>{
const {title,price} = item.fields
const {id} = item.sys
const image = item.fields.image.fields.file.url

return{ title,id,image,price}
})
// console.log(products)
return products
}


}


// the ui interface
class UI {

displayProduct(products){
let result = ""
 products.forEach(item => {
     result +=`
     <div class="card">
               <div class="img-container">
                    <img src=${item.image} alt="image">
           
                <button data-id=${item.id} class="cart-btn">
                
                    <i class="fas fa-cart-plus"></i>

                </button>
            </div>

                <div class="img-footer"> 
                    <h3> ${item.title}</h3>
                    <p> $${item.price}</p>
                </div>
                
        </div>`
 });
 
productDOM.innerHTML = result
}


getBagButton(){
    const buttons = [...document.querySelectorAll(".cart-btn")]
    ButtonDOM = buttons

    buttons.forEach(button =>{
        let id = button.dataset.id;
        let inCart = cart.find(item => item.id ===id)
        if(inCart){
            button.innerText = "in Cart"
            button.disable = true
        }
        else{
            button.addEventListener("click", (event)=>{
                button.innerText= "In Cart"
                button.disable = true

                let cartItem = {...Storage.getProduct(id),amount:1}
                // console.log(cartItem)
                cart =[...cart,cartItem]
                Storage.saveCart(cart)
                this.setCartValues(cart)
                this.getCartitems(cartItem)
                this.showCart()

            })
        }
    })

}

setCartValues(cart){

let tempTotal = 0;
let itemsTotal =0;
cart.forEach(item=>{
    tempTotal += item.price*item.amount;
    itemsTotal += item.amount;
})
totalamount.innerText = ` Amount : $${parseFloat(tempTotal.toFixed(2))}`;
totalitem.innerText = itemsTotal;

}


getCartitems(item){

    const div = document.createElement('div')
div.classList.add("cartitem");

div.innerHTML = `

        <div class="cart-item" >
            <img src=${item.image} alt="images">
            <div class="items">
                <h3>${item.title}</h3>
             <p> $${item.price}</p>
             <span class="removeitem" data-id=${item.id}>remove</span>
            </div>
            
        </div>

            <div class="item-btn">
                <button data-id=${item.id} class="plus-btn">+</button>
                <p class="item-amount" data-id=${item.id}>${item.amount}</p>
                    <button data-id=${item.id} class="minus-btn">-</button>
            </div>
`
cartContent.appendChild(div);
}


showCart(){
    
    cartHome.classList.add("tranparentBcg")
    cartCard.classList.add("showcart")
}
hideCart(){
    console.log("received")
    cartCard.classList.remove("showcart")
    cartHome.classList.remove("tranparentBcg")
   
}
// showcategories(){
    
//     // console.log("received")
// Sidenav.style.width = "250px";
// }

// closecategories(){
//     Sidenav.style.width = "0px";
// }

cartSetup(){

    cart = Storage.getCart();
    this.setCartValues(cart)
    this.populateCart(cart)
    // openList.addEventListener('click',this.showcategories)
    // closeList.addEventListener('click',this.closecategories)
    openCart.addEventListener('click',this.showCart);
    closeCart.addEventListener('click',this.hideCart)
}

populateCart(cart){
    cart.forEach(item => this.getCartitems(item))
}

hideCart(){
    // console.log("received")
    cartCard.classList.remove("showcart")
    cartHome.classList.remove("tranparentBcg")
   
}
 
// inside cart activities
cartAction(){


    clearcart.addEventListener("click",()=>{
        this.clearCart()
    })


    cartContent.addEventListener("click",(event)=>{

        if(event.target.classList.contains("removeitem")){
            let removeitem = event.target
            let id = removeitem.dataset.id
            cartContent.removeChild(removeitem.parentElement.parentElement);
            
            this.removeItem(id);
        }

        else if(event.target.classList.contains("plus-btn")){
            console.log(cart)
            let addamount = event.target;
            console.log(event.target.dataset.id)
            let id = addamount.dataset.id;
            console.log(id)
    let tempitem = cart.find(item =>item.id ===id);
  
    tempitem.amount = tempitem.amount + 1
    Storage.saveCart(cart)
    this.setCartValues(cart);

    addamount.nextElementSibling.innerText = tempitem.amount
       }
       
       else if(event.target.classList.contains("minus-btn")){
        let loweramount = event.target;
        let id = loweramount.dataset.id;
        let tempitem = cart.find(item =>item.id ===id);
        tempitem.amount = tempitem.amount - 1
            if(tempitem.amount >0){
                Storage.saveCart(cart)
                this.setCartValues(cart)
                loweramount.previousElementSibling.innerText = tempitem.amount
            }
            else{
                cartContent.removeChild(loweramount.parentElement.parentElement)
            this.removeItem(id)
            }
        
         }

    })



}


clearCart(){
let cartproducts = cart.map(item=> item.id)
cartproducts.forEach(id =>this.removeItem(id))

console.log(cartContent.children)

while(cartContent.children.length >0){
cartContent.removeChild(cartContent.children[0])
}
this.hideCart()
}

removeItem(id){
    cart =cart.filter(item => item.id !==id);
    this.setCartValues(cart);
    Storage.saveCart(cart);

    // to rest button back to normal
    let button = this.getSingleButton(id)
    button.disabled =false;
    button.innerHTML =`<i class="fas fa-cart-plus"></i>`
}

getSingleButton(id){
    return ButtonDOM.find(button=> button.dataset.id === id);
}

}





//  to store product in local storage
class Storage{
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products))

    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem("products"))
  return products.find (product => product.id === id);

    }
    static saveCart(cart){
        localStorage.setItem("cart",JSON.stringify(cart))
    }
    static getCart(){
        return localStorage.getItem("cart")? JSON.parse(localStorage.getItem("cart")):[]
    }
}


// loading the product
document.addEventListener("DOMContentLoaded",()=>{
    const products = new Products();
    const ui = new UI()

    ui.cartSetup()

    products.getProducts().then(data=>{
        ui.displayProduct(data)
        Storage.saveProducts(data)
        ui.getBagButton()
        ui.cartAction()
       

        
    })
})