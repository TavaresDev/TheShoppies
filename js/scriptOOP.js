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
        let itemBtn = document.createElement('button')
        itemBtn.innerText = 'Delete';
        itemBtn.classList.add("itemDeleteBtn", "btn", "btn-danger", "btn-sm");

        todoItem.appendChild(itemText);
        todoItem.appendChild(itemBtn);

        // append item to the to do list
        nominationList.appendChild(todoItem);
    }

    static deleteItem(el) {
        if (el.classList.contains('itemDeleteBtn')) {
            el.parentElement.remove();
        }
    }
    static showAlert(message, className){
		const div = document.createElement('div');
		div.className = `alert alert-${className}`
        div.appendChild(document.createTextNode(message));
        
		const container = document.querySelector('.container');
		const form = document.querySelector('#form');
		container.insertBefore(div, form);
		// Make desapear in 3 sec
		setTimeout(() => document.querySelector('.alert').remove(),3000);
	}

    static clearField() {
        searchInput.value = '';

    }
    static clearSearch() {
        searchList.innerHTML = ""

    }

}

class Api {
    static searchItem(inputValue) {
        // size of the query to be shown
        let size = 5;
        const apiURL = `https://www.omdbapi.com/?s=${inputValue}&type=movie&page=1&apikey=8a2a252`;
        fetch(apiURL)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                if(data.Error == "Too many results."){
                    UI.showAlert("Too many results. Try a diferent search", "danger");
                    return
                }else if(data.Error == "Movie not found!"){
                    UI.showAlert("Sorry, Movie not found", "danger");
                    return
                }
     
                searchList.innerHTML = ""
                // searchList.parentElement.innerHTML = ""
                // searchList.insertAdjacentHTML("beforebegin", "<h2>Results:</h2>"); 
                // searchList.innerHTML = "<h2>Results:</h2>"

                data.Search.slice(0, size).map(item => {

                    console.log(item);
                    let serchItemList = `
                        <div class="card"> 
                            <img class="card-img-top" src="${item.Poster != 'N/A' ? item.Poster :'noPoster2.png'}" alt="${item.Title} Poster">
                            <div class="card-body">
                                <p class="card-text">${item.Title}  (${item.Year})  </p>
                                <button id="" class="btn btn-secondary btn-block"> Add </button>
                            </div>
                        </div>     
                        `
                    searchList.innerHTML += serchItemList
                })
            })
            .catch(error => {
                console.log("error");
                console.error(error);

            })
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

        //iterate list to find and delete the right one
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

const nominationList = document.getElementById('nominationList');


// ----------------------- Events  -----------------------//

//Event: First event called to update the list from the local storage
document.addEventListener("DOMContentLoaded", UI.displayItems);


// Events on the Search button
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // get name of the item
    let inputValue = document.getElementById('searchInput').value;
    //validation
    if (inputValue == ""){
        UI.showAlert("Movie name must be filled out", "info");
        return false;
    }
    //Call the API
    Api.searchItem(inputValue)

    // //instanciate a item
    // const item = new Item(inputValue);

    // //add item to UI (create)
    // UI.addItemToList(item);
    // //add to store
    // Store.addItem(item);

});


//Event to add Movie to Nomination List
searchList.addEventListener('click', (e) => {

    if (e.target.nodeName == "BUTTON") {
        // console.log(e.target.previousElementSibling.textContent);
        let movieName = e.target.previousElementSibling.textContent

        UI.clearSearch()

        itemsArray = Store.getItems()
        
        console.log(itemsArray)
        console.log(itemsArray.length)
     
        if(itemsArray.length == 5){
                UI.showAlert("You have Nominate 5 Movies", "info")
                return
        }
                
        //instanciate a item
        const item = new Item(movieName);
        // //add item to UI (create)
        UI.addItemToList(item);
        // //add to store
        Store.addItem(item);

    }

});


//Event on the List to Remove nominationList
nominationList.addEventListener('click', (e) => {

    if (e.target.nodeName == "BUTTON") {
        UI.deleteItem(e.target);
        Store.removeItem(e.target.previousElementSibling.textContent);
    }


});