// First fill the array with the values in order.
let cities = ['Chicago', 'Los Angeles', 'Miami', 'Las Vegas', 'Atlanta', 'Seattle', 'New York', 'Houstan', 'Chicago', 'Los Angeles', 'Miami', 'Las Vegas', 'Atlanta', 'Seattle', 'New York', 'Houstan' ];
let languages = ['Arabic', 'Spanish', 'Portuguese', 'English', 'German', 'Russian', 'Hindi', 'Chinese', 'Arabic', 'Spanish', 'Portuguese', 'English', 'German', 'Russian', 'Hindi', 'Chinese' ];
let brandIcons = ['fa-amazon', 'fa-apple', 'fa-android', 'fa-btc', 'fa-chrome', 'fa-dropbox', 'fa-facebook-official', 'fa-github','fa-amazon',
'fa-apple', 'fa-android', 'fa-btc', 'fa-chrome', 'fa-dropbox', 'fa-facebook-official', 'fa-github']
// Go through the array and exchange each element with the randomly chosen element in the range
// from itself to the end.
const itemsCount = 16;
let openCardCount = 0;
let openCards = [];
let matchedCards = [];
let movesCount = 0;
let timeInSeconds = 0;
let starCount = 3;
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
// Game Panel Controls
const moves = document.querySelector('.moves');
const reset = document.querySelector('.reset');
const timeDisplay = document.querySelector('.time-display');
// Main Deck
const deck = document.querySelector('.deck');
const cardTexts = document.getElementsByClassName('card-text');
const stars = document.getElementsByClassName('fa-star');
// Win Modal
const modal = document.querySelector('.win-modal');
const modalYes = document.querySelector('.modal-yes');
const modalNo = document.querySelector('.modal-no');
const modalTime = document.querySelector('.modal-time');
const modalStars = document.querySelector('.modal-star');


function resetGame(){
	//reset game here
	// use query selector to pick elements with open/matched classes and remove them
	//call loadDeck()
	//reset stars
	starCount = 3;
	for(const star of stars){
		star.classList.remove('hide-star');
	}
	// set moves to 0
	movesCount = 0;
	moves.textContent = movesCount;
	// set timer to 0
	timeInSeconds = 0;
	clearInterval(timer);
	timeDisplay.textContent = timeInSeconds;
}

function loadDeck(){
	shuffle(cities);
	let item = 0;
	for(const text of cardTexts){
		text.textContent = cities[item];
		item++;
	}
}
function displaySeconds(){
	timeInSeconds++;
	timeDisplay.textContent = timeInSeconds;
}

function setStars(){
	console.log('I am in setStars')
	if(movesCount === 20){
		stars[2].classList.add('hide-star');
		starCount--;
	}
	else if(movesCount === 14) {
		stars[1].classList.add('hide-star');
		starCount--;
	}
	else if(movesCount === 9) {
		stars[0].classList.add('hide-star');
		starCount--;
	}
}
document.addEventListener('DOMContentLoaded', function () {
	loadDeck();
});

deck.addEventListener('click', function(event){
	event.preventDefault();
	// start timer if it already is not running
	if(timeInSeconds === 0){
		// modal.classList.add('show');
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
			console.log(openCards);
			console.log(openCards.length);
			event.target.classList.add('open');
			event.target.firstElementChild.classList.add('mirror');
			//matched
			if(openCards.length === 2 && (openCards[0].textContent === openCards[1].textContent)){
				movesCount++;
				if(movesCount >= 9){
					setStars();
				}
				moves.textContent = movesCount;
				matchedCards.push(openCards[0].textContent);
				for(const card of openCards){
					card.classList.add('matched');
				}
				if(matchedCards.length == 8){
					console.log('game over');
					modal.classList.add('show');
					modalTime.textContent = `Game Completion Time: ${timeInSeconds}`;

					//stop timer
				}
				openCards = [];
			}
		}
	}
});

reset.addEventListener('click', function(){
	resetGame();
});

// modal functionality

// When the user clicks on No <button>, close the modal
modalNo.onclick = function() {
	modal.classList.remove('show');
}

modalYes.onclick = function() {
	modal.classList.remove('show');
	resetGame();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == modal) {
		modal.classList.remove('show');
	}
}
