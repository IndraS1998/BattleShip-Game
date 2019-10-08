let view = {
    displayMessage :function(msg){
        let messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit : function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class" ,"hit");
    },
    displayMiss : function (location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class","miss");
    }
};
view.displayMessage("tap tap is this thing on?");

let model={
    boardSize :7,
    numShips:3,
    shipLength:3,
    shipsSunk:0,

    ships :[
        {locations:[0,0,0],hits:["","",""]},
        {locations:[0,0,0],hits:["","",""]},
        {locations:[0,0,0],hits:["","",""]}
        ],
    //implementation of the isSunk method
    //take a ship, return true if its sunk and false if not
    isSunk : function(ship){
    //scan through  the ship checking every location i there is a hit
    for (let i = 0;i<this.shipLength;i++){
        if(ship.hits[i]!=="hit"){
            return false;
            }
        }
    return true;
    },
    generateShipLocation : function(){
        let locations;
        for (let i=0;i< this.numShips;i++){
            do {
                locations = this.generateShip();
            }while(this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    //generate the position of ships in the board without worry abt collision
    generateShip : function(){
        //first is to check the direction of the ship either vertical or horizontally
        let direction= Math.floor(Math.random()*2);
        let row,col;
        if (direction === 1){
            //generate a starting position of a horizontal ship
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize-this.shipLength));
        }else{
            //generate a starting position for a vertical ship
            row =  Math.floor(Math.random() * (this.boardSize-this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }
        let newShipLocation = [];
        for (let i=0;i<this.shipLength;i++){
            if (direction ===1){
                newShipLocation.push(row + "" + (col + i));
            }else{
                newShipLocation.push((row + i) + "" + col);
            }
        }
        return newShipLocation;
    },
    collision : function(location){
        for (let i=0; i<this.numShips;i++){
            let ship = this.ships[i];
            for (let j = 0; j <location.length;j++){
                if(ship.locations.indexOf(location[j])>=0){
                    return true;
                }
            }
        }
        return false;
    },
    //implementing the fire method
    fire: function(loc){
        for (let i = 0;i<this.numShips;i++){
            let ship = this.ships[i];
            //remember that indexOf is a method of arrays in which the method will loop through the array to
            //find the index of the element that matches the attribute passed and returns the index and returns -1 if it doesnt get any
            let index = ship.locations.indexOf(loc);
            if (index>=0){
                ship.hits[index] = "hit";
                view.displayHit(loc);
                view.displayMessage("HIT");
                if (this.isSunk(ship)){
                    this.shipsSunk++;
                    view.displayMessage("dude you sunk my ship");
                }
                return true;
            }
        }
        view.displayMessage("dude you missed my ship");
        view.displayMiss(loc);
        return false;
    }
};
//model.fire("53");
//model.fire("06");

//implementation of the controller object
let controller = {
    guess : 0,
    //get and process the players guesses (changing the string entered by the user ito the numeric form for the model to process)
    processGuesses : function(guess){
        //  ask the model to update itself based on the guesses
        //determine when the game is over
        let location = parseGuesses(guess);
        if(location){
            this.guess++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk===model.numShips){
                view.displayMessage("you sank all my battle ships in " + this.guess + "guesses");
            }
        }
    },
    //keep track of the number of guesses
};

let alphabet = ["A","B","C","D","E","F","G"];
function parseGuesses(guess){
    //get a player's guess and test for validity
        //by making sure its not null and length is less then two
    //check the input
    if(guess == null || guess.length>2){
        alert("oops, please enter a letter and a number that is on the board");
    }else {
        //take the letter and convert it to a number
        let firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar);
        let col = guess.charAt(1);
        //verify if the number is valid
        //check the second number for validity
        if (isNaN(row) || row >= model.boardSize || isNaN(col) || col >= model.boardSize) {
            alert("please enter a correct number nah");
        } else {
            return row + col;
        }
    }
    return null;
}
//console.log(parseGuesses("A0"));
//console.log(parseGuesses("A7"));
//controller.processGuesses("A0");
/*controller.processGuesses("B6");
controller.processGuesses("C4");
controller.processGuesses("D4");
controller.processGuesses("E4");*/
function handleFireButton(){
    //get the players guess from the form
    let guessInput = document.getElementById("guessInput");
    let guess = guessInput.value;
    //send the guess to the controller
    controller.processGuesses(guess);
    guessInput.value = "";
}


