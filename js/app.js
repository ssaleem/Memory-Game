// Deck card values
const cities = ['Chicago', 'Boston', 'Miami', 'Las Vegas', 'Atlanta', 'Seattle', 'New York', 'Houston', 'Chicago', 'Boston', 'Miami', 'Las Vegas', 'Atlanta', 'Seattle', 'New York', 'Houston' ];
const languages = ['Arabic', 'Spanish', 'Portuguese', 'English', 'German', 'Russian', 'Hindi', 'Chinese', 'Arabic', 'Spanish', 'Portuguese', 'English', 'German', 'Russian', 'Hindi', 'Chinese' ];
const vehicles = ["fa-car", "fa-bus", "fa-motorcycle", "fa-bicycle", "fa-subway", "fa-space-shuttle", "fa-taxi", "fa-fighter-jet", "fa-car", "fa-bus", "fa-motorcycle", "fa-bicycle", "fa-subway", "fa-space-shuttle", "fa-taxi", "fa-fighter-jet"]
const animals = ["fa-cat", "fa-dog", "fa-crow", "fa-dragon", "fa-dove", "fa-fish", "fa-frog", "fa-spider", "fa-cat", "fa-dog", "fa-crow", "fa-dragon", "fa-dove", "fa-fish", "fa-frog", "fa-spider"];

const itemsCount = 16;
let openCards = [];
let intervalID = null;
let clickEnabled = true;

// Game Panel Controls
const selectDeck = document.querySelector('.select-deck');
// Deck selection
let selectedDeck = document.querySelector('.selected');
let deckItems = cities;

const moves = document.querySelector('.moves');
let movesCount = 0;
const stars = document.getElementsByClassName('fa-star');
let starCount = 3;
const reset = document.querySelector('.reset');
const timeDisplay = document.querySelector('.time-display');
let timeInSeconds = 0;

// Main Deck
const deck = document.querySelector('.deck');
const cardTexts = document.getElementsByClassName('card');

// Live collection of open and matched cards
const matched = document.getElementsByClassName('matched');
const openClassElements = document.getElementsByClassName('open');

// Fastest Time
const fastest = document.querySelector('.fastest');
const fastestTimeSpan = document.getElementById('fastest-time');
let storageAvailable = false;

// Game completed Modal
const modal = document.querySelector('.win-modal');
const modalTime = document.querySelector('.modal-time');
const modalStars = document.querySelector('.modal-stars');
const modalYes = document.querySelector('.modal-yes');
const modalNo = document.querySelector('.modal-no');



// Check if localStorage is available and fastestTime is stored already
if (typeof(Storage) !== "undefined") {
    storageAvailable = true;
    if(localStorage.fastestTime){
    	fastestTimeSpan.innerHTML = localStorage.fastestTime;
    	fastest.classList.add('show');
    }
}

function shuffle(items){
	for(let index = 0; index < itemsCount; index++){
		let randomIndex = Math.floor(Math.random() * (itemsCount - index)) + index;
		if(randomIndex !== index){
			let temp = items[index];
			items[index] = items[randomIndex];
			items[randomIndex] = temp;
		}
	}
}

function loadDeck(){
	shuffle(deckItems);
	let item = 0;
	if(deckItems[0].includes('fa-')){
		for(const card of cardTexts){
			card.innerHTML = `<i class="fas ${deckItems[item]} card-icon"></i>`;
			item++;
		}
	}
	else {
		for(const card of cardTexts){
			card.innerHTML = `<p class="card-text">${deckItems[item]}</p>`;
			item++;
		}
	}
}

function resetGame(){
	// 1. Clear last deck
	// use live collection of elements with open/matched classes and remove those classes
	while(openClassElements[0]) {
		openClassElements[0].firstElementChild.classList.remove('mirror');
		openClassElements[0].classList.remove('open','matched');
	}
	// clear the openCards array in case game was reset in the middle of play
	openCards = [];

	// 2. Create new deck
	loadDeck();

	// 3. Reset Game Panel Controls
	//reset stars
	starCount = 3;
	for(const star of stars){
		star.classList.remove('far');
		star.classList.add('fas');
	}
	// set moves to 0
	movesCount = 0;
	moves.textContent = movesCount;

	// set timer to 0
	timeInSeconds = 0;
	// console.log('timer value in reset function:' + intervalID);
	clearInterval(intervalID);
	intervalID = null;
	timeDisplay.textContent = timeInSeconds;
}

function displaySeconds(){
	timeInSeconds++;
	timeDisplay.textContent = timeInSeconds;
}

function setStars(){
	if(movesCount === 18) {
		stars[1].classList.remove('fas');
		stars[1].classList.add("far");
		starCount--;
	}
	else if(movesCount === 12) {
		stars[2].classList.remove("fas");
		stars[2].classList.add("far");
		starCount--;
	}
}

function incrementMoves(){
	movesCount++;
	if(movesCount >= 9){
		setStars();
	}
	moves.textContent = movesCount;
}

function gameCompleted(){
	clearInterval(intervalID);
	intervalID = null;
	// check if fastest time was beaten and update
	if(localStorage.fastestTime && localStorage.fastestTime > timeInSeconds){
		localStorage.fastestTime = timeInSeconds;
	}
	else {
		localStorage.fastestTime = timeInSeconds;
	}
	fastestTimeSpan.innerHTML = localStorage.fastestTime;
	fastest.classList.add('show');

	//show modal
	modal.classList.add('show');
	modalTime.textContent = `Game Completion Time: ${timeInSeconds} seconds`;
	// add html for star rating
	let htmlString = "Rating: ";
	for(let i = 1; i <= starCount; i++){
		htmlString += '<i class="fas fa-star"></i>';
	}
	for(let i = 1; i <= (3 - starCount); i++){
		htmlString += '<i class="far fa-star"></i>';
	}
	modalStars.innerHTML = htmlString;

}

// Event listeners

document.addEventListener('DOMContentLoaded', function () {
	loadDeck();
});

selectDeck.addEventListener('click', function(event){
	if(event.target.classList.contains('fas')){
		selectedDeck.classList.remove("selected");
		selectedDeck = event.target;
		selectedDeck.classList.add("selected");
	}
	if(event.target.classList.contains('fa-building')){
		deckItems = cities;
	}
	else if(event.target.classList.contains('fa-language')){
		deckItems = languages;
	}
	else if(event.target.classList.contains('fa-bus')){
		deckItems = vehicles;
	}
	else if(event.target.classList.contains('fa-cat')){
		deckItems = animals;
	}
	resetGame();
});

deck.addEventListener('click', function(event){
	event.preventDefault();
	// start timer if it already is not running
	if(!intervalID){
		intervalID = setInterval(displaySeconds, 1000);
		// console.log('timer value in click event listener:' + intervalID);
	}
	if(!event.target.classList.contains('matched') && clickEnabled && event.target.classList.contains('card') && !event.target.classList.contains('open')) {
			event.target.classList.add('open');
			event.target.firstElementChild.classList.add('mirror');
			openCards.push(event.target);

			if(openCards.length === 2){
				incrementMoves();
				// matched
				// if(openCards[0].textContent === openCards[1].textContent){
				if(openCards[0].innerHTML === openCards[1].innerHTML){
					for(const card of openCards){
						card.classList.add('matched');
					}
					//check for winning condition
					if(matched.length == itemsCount){
						gameCompleted();
						console.log('game over');
					}
					openCards = [];
				}
				// not matched, close open cards with a delay
				else {
					clickEnabled = false;
					let timerId = setTimeout(function(){
						for(const card of openCards){
							card.classList.remove('open');
							card.firstElementChild.classList.remove('mirror');
						}
					openCards = [];
					clickEnabled = true;
					}, 1400);
				}

			}
	}
});

reset.onclick =  function(){
	resetGame();
};

// Modal related event listeners
// a.When the user clicks on No <button>, close the modal
modalNo.onclick = function() {
	modal.classList.remove('show');
};

// b.When the user clicks on Yes <button>, close the modal, restart the game
modalYes.onclick = function() {
	modal.classList.remove('show');
	resetGame();
};

// c.When the user clicks anywhere outside of the modal, close the modal
window.onclick = function(event) {
	if (event.target == modal) {
		modal.classList.remove('show');
	}
};
