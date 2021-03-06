// ----------------------- Classes -----------------------//

// Item class to be instanciated:
class Item {
    constructor(name, year) {
        this.name = name;
        this.year = year;
    }
}

// This class control the user interface, the visual and functionality of the list
class UI {

    static displayItems() {
        const items = Store.getItems();
        items.forEach((item) => UI.addItemToList(item));
        
    }
       static addItemToList(item) {
        // Using a diferent way to create elements
        // create li
        let todoItem = document.createElement('li');
        todoItem.classList.add("list-group-item", "d-flex");

        // create text 
        let itemText = document.createElement('p');
        itemText.classList.add("m-0");
        // itemText.textContent = inputValue;
        itemText.textContent = item.name;
 
        // create Year 
        let itemYear = document.createElement('p');
        itemYear.classList.add("ml-2");
        // itemText.textContent = inputValue;
        itemYear.textContent = item.year;

        // create button
        let itemBtn = document.createElement('button')
        itemBtn.innerText = 'Delete';
        itemBtn.classList.add("itemDeleteBtn", "btn", "btn-danger", "btn-sm", "ml-auto");

        todoItem.appendChild(itemText);
        todoItem.appendChild(itemYear);
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
    static infoShow(){
        let howToUse = document.getElementById('howToUse');
        howToUse.classList.toggle("d-none");
        
    }

}

class Api {
    static searchItem(inputValue) {
        // size of the query to be shown
        let size = 10;
        const apiURL = `https://www.omdbapi.com/?s=${inputValue}&type=movie&page=1&apikey=8a2a252`;
        fetch(apiURL)
            .then(response => {
                return response.json();
            })
            .then(data => {
                // console.log(data);
                if(data.Error == "Too many results."){
                    UI.showAlert("Too many results. Try a diferent key word", "danger");
                    return
                }else if(data.Error == "Movie not found!"){
                    UI.showAlert("Sorry, Movie not found", "danger");
                    return
                }
     
                searchList.innerHTML = ""

                data.Search.slice(0, size).map(item => {

                    // console.log(item);
                    let serchItemList = `
                        <div class="card"> 
                            <img class="card-img-top" src="${item.Poster != 'N/A' ? item.Poster :'noPoster.png'}" alt="${item.Title} Poster">
                            <div class="card-body d-flex justify-content-end h-100 flex-column ">
                            <div> 
                                <p class="card-text d-inline">${item.Title}</p>
                                <p class="card-text d-inline">(${item.Year}) </p>
                            </div>
                                <button id="" class="btn btn-secondary mt-2 btn-block"> Nominate  </button>
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
        if (localStorage.getItem('movieItems') === null) {
            items = [];
        } else {
            //local storage store as a string. so we need to parse
            items = JSON.parse(localStorage.getItem('movieItems'));
        }
        return items;
    }
    static addItem(item) {
        const items = Store.getItems();
        items.push(item);
        //stringiy to be able to add to local storage
        localStorage.setItem('movieItems', JSON.stringify(items));
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
        localStorage.setItem('movieItems', JSON.stringify(items));

    }
}

// ----------------------- Declarations  -----------------------//

const searchBtn = document.getElementById('searchBtn');
const searchList = document.getElementById('resultList');

const nominationList = document.getElementById('nominationList');
const infoIcon = document.getElementById('infoIcon');


// ----------------------- Events  -----------------------//

//Event: First event called to update the list from the local storage
// DOMContentLoaded may fire before script run, so check before adding a listener
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", UI.displayItems);
} else {  
    UI.displayItems();
}



//Event: info mouseover
infoIcon.addEventListener("mouseenter", UI.infoShow);
//for mobile
infoIcon.addEventListener("touchenter ", UI.infoShow);


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
    
});


//Event to add Movie to Nomination List
searchList.addEventListener('click', (e) => {

    if (e.target.nodeName == "BUTTON") {

        let movieName = e.target.previousElementSibling.firstElementChild.textContent
        let movieYear = e.target.previousElementSibling.lastElementChild.textContent
        
        itemsArray = Store.getItems()
        //check the amout of movies
        if(itemsArray.length == 4){
            UI.showAlert("Congratulation, You have nominated five Movies", "success")
                //clean seachList
            UI.clearSearch()
                
        }else if(itemsArray.length >= 5){
            UI.showAlert("You have already nominated five Movies", "info")
            //clean seachList
            UI.clearSearch()
            return
        }
        //Disable add btn
        e.target.classList.add("disabled")
        e.target.setAttribute("disabled", true);

        //instanciate a item
        const item = new Item(movieName, movieYear);
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
        Store.removeItem(e.target.previousElementSibling.previousElementSibling.textContent);

    }


});