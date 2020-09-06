// ----------------------- Classes -----------------------//

// Item class to be instanciated:
class Item {
    constructor(name) {
        this.name = name;
    }
}

// This class control the user interface, the visual and functionality of the list
class UI {

    static displayItems() {
        const items = Store.getItems();
        items.forEach((item) => UI.addItemToList(item));
    }

    static searchItem(inputValue) {
        // size of the query to be shown
        let size = 5;
        const apiCall = `http://www.omdbapi.com/?s=${inputValue}&apikey=8a2a252`;
        fetch(apiCall)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                console.log(data.Search);
                searchList.innerHTML = ""
                searchList.insertAdjacentHTML("beforebegin", "<h2>Results:</h2>"); 
                // searchList.innerHTML = "<h2>Results:</h2>"

                data.Search.slice(0, size).map(item => {

                    console.log(item);
                    let serchItemList = `
                <div class="card"> 
					<img class="card-img-top" src="${item.Poster}" alt="${item.Title} Poster">
					<div class="card-body">
						<p class="card-text">${item.Title}  (${item.Year})   </p>
						<button id="" class="btn btn-secondary btn-block"> Add </button>
					</div>
				</div>     

                `

                    searchList.innerHTML += serchItemList

                })
            });
    }

    static addItemToList(item) {
        // showing a diferent way to create elements

        // create li
        let todoItem = document.createElement('li');
        todoItem.classList.add("list-group-item", "d-flex", "justify-content-between");

        // create text 
        let itemText = document.createElement('p');
        itemText.classList.add("m-0");
        // itemText.textContent = inputValue;
        itemText.textContent = item.name;

        // create button
        let itemBtn = document.createElement('button');
        itemBtn.innerText = 'Delete';
        itemBtn.classList.add("itemDeleteBtn", "btn", "btn-danger", "btn-sm");

        todoItem.appendChild(itemText);
        todoItem.appendChild(itemBtn);

        // append item to the to do list
        todoList.appendChild(todoItem);
    }

    static deleteItem(el) {
        if (el.classList.contains('itemDeleteBtn')) {
            el.parentElement.remove();
        }
    }

    static playSound() {
        const audio = document.getElementById('soundBell');
        // set the audio to star from begin
        audio.currentTime = 0;
        audio.play();
    }

    static clearFields() {
        todoInput.value = '';

    }

}

// store class
class Store {

    static getItems() {
        let items;
        //localStorege.getItem to get things from local
        if (localStorage.getItem('items') === null) {
            items = [];
        } else {
            //local storage store as a string. so we need to parse
            items = JSON.parse(localStorage.getItem('items'));
        }
        return items;
    }
    static addItem(item) {
        const items = Store.getItems();
        items.push(item);
        //stringiy to be able to add to local storage
        localStorage.setItem('items', JSON.stringify(items));
    }

    static removeItem(name) {
        const items = Store.getItems();

        //iterate thu list to find and delete the right one
        items.forEach((item, index) => {
            if (item.name === name) {
                //remove one item from the list
                items.splice(index, 1);
            }
        });
        //add the new array of items to the the local storage
        localStorage.setItem('items', JSON.stringify(items));

    }
}

// ----------------------- Declararions  -----------------------//
// Declaration 
const searchBtn = document.getElementById('searchBtn');
const searchList = document.getElementById('resultList');

const todoList = document.getElementById('todoList');


// ----------------------- Events  -----------------------//

//Event: First event called to update the list from the local storage
document.addEventListener("DOMContentLoaded", UI.displayItems);


// Events on the button to add items
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // get name of tudo item
    let inputValue = document.getElementById('searchInput').value;
    //validation
    if (inputValue == ""){
        //todo new ui
        alert("Name must be filled out");
        return false;
    }
    //Call the API
    UI.searchItem(inputValue)

    // //instanciate a item
    // const item = new Item(inputValue);

    // //add item to UI (create)
    // UI.addItemToList(item);
    // //add to store
    // Store.addItem(item);

});


//Event on the List to call: remove item and checkbox
searchList.addEventListener('click', (e) => {

    if (e.target.nodeName == "BUTTON") {
        console.log(e.target.previousElementSibling.textContent)
        // console.log(e.target)


        //instanciate a item
        const item = new Item(e.target.previousElementSibling.textContent);

        // if(list< 5){
        //     do it
        // }else{
        //     You have chosen 5 
        // }

        // //add item to UI (create)
        UI.addItemToList(item);
        // //add to store
        Store.addItem(item);


        // UI.deleteItem(e.target);
        // Store.removeItem(e.target.previousElementSibling.textContent);
    }
    if (e.target.nodeName == "INPUT") {
        UI.checkItem(e.target);
        UI.plTaySound();
        Store.removeItem(e.target.nextElementSibling.textContent);

    }

});

//to delete
//Event on the List to call: remove item and checkbox
todoList.addEventListener('click', (e) => {

    if (e.target.nodeName == "BUTTON") {
        UI.deleteItem(e.target);
        Store.removeItem(e.target.previousElementSibling.textContent);
    }
    if (e.target.nodeName == "INPUT") {
        UI.checkItem(e.target);
        UI.plTaySound();
        Store.removeItem(e.target.nextElementSibling.textContent);

    }

});

