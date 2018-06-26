// World Cup Hangman

$(function(){
    $("#displayButton").click(function(){
        setup() 
        console.log(game.player.name)
        console.log(game.player.image)

     });
     $("#seeCardButton").click(function(){
        $("#winModal").modal();
     });
});
var alphabet = 'abcdefghijklmnopqrstuvwxyz-'

var game = {
    setIndex : function(){
        var playerIndex = Math.floor(Math.random() * 736) + 1;
        game.index = playerIndex;
        game.player = players[game.index];
    },
    userGuesses : [],
    correctGuessCount:0,
    winCount : 0,
    loseCount: 0,
    chances: 10,
    displayArr:[],
    display: function(){
        var display = "";
        for (var i = 0; i<game.displayArr.length; i++){
            display += game.displayArr[i]+" ";
        }
        return display;
    }
}
function resetGame(){
    game.userGuesses=[];
    game.correctGuessCount=0;
    game.chances=10;
    game.displayArr=[],

    $("#ballImageAI").css({
        "top":"50%"
    });
    $("#ballImageUser").css({
        "bottom":"50%"
    });
    $("#seeCardButton").addClass('d-none')
}

function updateScreen(){
    $("#display").html(game.display())
    $("#guesses").html(game.userGuesses)
    $("#score").html('<p style= "float:left">Human</p>'+ game.winCount+ " - "+ game.loseCount+' <p style= "float:right">Computer</p>')
    
}

function aiBallMovement(){
    var ball = $("#ballImageAI")
    ball.css({
        "top": String(50 + (10 - Number(game.chances))*4.5)+"%"
    });
}

function userBallMovement(){
    var ball = $("#ballImageUser")
    console.log("Name Length: "+ game.player.name.length)
    console.log("Correct Guess Count: "+ game.correctGuessCount)
    ball.css({
        "bottom": String(50 + (game.correctGuessCount/game.player.name.length)*45)+"%"
    });
}

function setup(){
    resetGame()
    $(".col-12").removeClass("d-none")
    game.setIndex();
    game.userGuesses=[];
    var displayArr = [];
    for(var i=0 ; i<game.player.name.length ; i++){
        if (game.player.name[i] == " "){
            displayArr.push("<br>")
        }else{
            displayArr.push("__")
        }
    }
    game.displayArr = displayArr;
    $("#displayButton").text("Next Player")
    updateScreen()
}

function getCharIndexAll(guess){ //returns a list of indexes for all occurences of a given character in player name
    charIndexList =[];
    for (var i in game.player.name){
        if (guess == game.player.name[i].toLowerCase()){
            charIndexList.push(i);
        };
    };
    return charIndexList
}

function didWin(){
    if (game.displayArr.indexOf("__") == -1) {
        console.log(game.displayArr);
        $("#winModal").modal();
        $(".modal-body").html(            '<div class="card d.block mx-auto text-center" style="width: 18rem;">'+
        '<img class="card-img-top" src="'+game.player.image+'" alt="Player Image">'+
        '<div class="card-body">'+
            '<h5 class="card-title">'+game.player.name+'</h5>'+
            '<p class="card-text">Nationality: '+game.player.nat+'<br> Position: '+game.player.pos+'</p>'+
        '</div>'+
    '</div>');
        game.winCount += 1
        $("#seeCardButton").removeClass('d-none');
        return true;
    }else return false;
}
function didLose(){
    if(game.chances<=0){
        game.loseCount +=1
        $("#loseModal").modal();
        return true;
    }else return false;
}



document.onkeyup = function(event){
    userInput = event.key;
    if (game.userGuesses.indexOf(userInput) ==-1 && alphabet.indexOf(userInput)>-1 && game.displayArr.indexOf(userInput)==-1 && game.displayArr.indexOf(userInput.toUpperCase())==-1){
        var charIndexList = getCharIndexAll(userInput)
        if(charIndexList.length >0){
            for (var n in charIndexList){
                var activeIndex = charIndexList[n]
                game.displayArr[activeIndex]=game.player.name[activeIndex]
                game.correctGuessCount+=1
            }
            userBallMovement()
        }else{
            game.userGuesses.push(userInput)
            game.userGuesses.push(" ")
            game.chances -= 1
            aiBallMovement()
        }
        if (didWin()){
            setup() 
        }else{
            if (didLose()){
                setup()
            }
        }

    }
    updateScreen()
}






// create game Object
//     game.setup(){
//         Randomly Select one player
//         Create "display" array
//             displayArr = ["_","_","_","_" ...]
//         game.display = displayArr
//     }
//     game.userGuess(guess){
//     }
//     game.chances
//     game.correctGuessCount


// isGoodGuess(){
//     player.name.indexOf(game.userGuess)>-1
// }
// didWin(){
//     game.correctGuessCount == player.name.length
// }

// jquery--> create visual representation of displayArr



