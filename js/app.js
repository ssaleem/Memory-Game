// Deck card values
let cities = ['Chicago', 'Los Angeles', 'Miami', 'Las Vegas', 'Atlanta', 'Seattle', 'New York', 'Houstan', 'Chicago', 'Los Angeles', 'Miami', 'Las Vegas', 'Atlanta', 'Seattle', 'New York', 'Houstan' ];
let languages = ['Arabic', 'Spanish', 'Portuguese', 'English', 'German', 'Russian', 'Hindi', 'Chinese', 'Arabic', 'Spanish', 'Portuguese', 'English', 'German', 'Russian', 'Hindi', 'Chinese' ];
let brandIcons = ['fa-amazon', 'fa-apple', 'fa-android', 'fa-btc', 'fa-chrome', 'fa-dropbox', 'fa-facebook-official', 'fa-github','fa-amazon',
'fa-apple', 'fa-android', 'fa-btc', 'fa-chrome', 'fa-dropbox', 'fa-facebook-official', 'fa-github']
const itemsCount = 16;
let openCards = [];
// let timer;


// Game Panel Controls
const moves = document.querySelector('.moves');
let movesCount = 0;
const stars = document.getElementsByClassName('fa-star');
let starCount = 3;
const reset = document.querySelector('.reset');
const timeDisplay = document.querySelector('.time-display');
let timeInSeconds = 0;

// Main Deck
const deck = document.querySelector('.deck');
const cardTexts = document.getElementsByClassName('card-text');

// Live collection of open and matched cards
const matched = document.getElementsByClassName('matched');
const open = document.getElementsByClassName('open');

// Game completed Modal
const modal = document.querySelector('.win-modal');
const modalTime = document.querySelector('.modal-time');
const modalStars = document.querySelector('.modal-stars');
const modalYes = document.querySelector('.modal-yes');
const modalNo = document.querySelector('.modal-no');


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
	shuffle(cities);
	let item = 0;
	for(const text of cardTexts){
		text.textContent = cities[item];
		item++;
	}
}

function resetGame(){
	//reset game here
	// 1. Clear last deck
	// use live collection of elements with open/matched classes and remove those classes
	while(open[0]) {
		open[0].classList.remove('open','matched');
	}
	// clear the openCards array in case game was reset in the middle of play
	openCards = [];

	// 2. Create new deck
	loadDeck();

	// 3. Reset Game Panel Controls
	//reset stars
	starCount = 3;
	for(const star of stars){
		star.classList.remove('fa-star-o');
	}
	// set moves to 0
	movesCount = 0;
	moves.textContent = movesCount;
	// set timer to 0
	timeInSeconds = 0;
	clearInterval(timer);
	timeDisplay.textContent = timeInSeconds;
}


function displaySeconds(){
	timeInSeconds++;
	timeDisplay.textContent = timeInSeconds;
}

function setStars(){
	if(movesCount === 15) {
		stars[1].classList.add('fa-star-o');
		starCount--;
	}
	else if(movesCount === 9) {
		stars[0].classList.add('fa-star-o');
		starCount--;
	}
}

function gameCompleted(){
	clearInterval(timer);
	modal.classList.add('show');
	modalTime.textContent = `Game Completion Time: ${timeInSeconds} seconds`;
	// xmodalStars =
	let htmlString = "Rating: ";
	for(let i = 1; i <= (3 - starCount); i++){
		htmlString += '<i class="fa fa-star fa-star-o"></i>';

	}
	for(let i = 1; i <= starCount; i++){
		htmlString += '<i class="fa fa-star"></i>';

	}
	modalStars.innerHTML = htmlString;

}

// Event listeners

document.addEventListener('DOMContentLoaded', function () {
	loadDeck();
});

deck.addEventListener('click', function(event){
	event.preventDefault();
	// start timer if it already is not running
	if(timeInSeconds === 0){
		timer = setInterval(displaySeconds, 1000);
	}
	if(!event.target.classList.contains('matched')) {
		if(event.target.classList.contains('card') && !event.target.classList.contains('open')){
			if(openCards.length === 2){
				movesCount++;
				if(movesCount >= 9){
					setStars();
				}
				moves.textContent = movesCount;
				for(const card of openCards){
					card.classList.remove('open');
				}
				openCards = [];
			}
			openCards.push(event.target);
			event.target.classList.add('open');
			event.target.firstElementChild.classList.add('mirror');
			console.log(openCards.length);
			//matched
			if(openCards.length === 2 && (openCards[0].textContent === openCards[1].textContent)){
				movesCount++;
				if(movesCount >= 9){
					setStars();
				}
				moves.textContent = movesCount;
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
		}
	}
});

reset.addEventListener('click', function(){
	resetGame();
});

// Modal related event listeners
// When the user clicks on No <button>, close the modal
modalNo.onclick = function() {
	modal.classList.remove('show');
}

// When the user clicks on Yes <button>, close the modal, restart the game
modalYes.onclick = function() {
	modal.classList.remove('show');
	resetGame();
}

// When the user clicks anywhere outside of the modal, close the modal
window.onclick = function(event) {
	if (event.target == modal) {
		modal.classList.remove('show');
	}
}
