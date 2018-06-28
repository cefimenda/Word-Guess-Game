// World Cup Hangman

$(function(){
    $("#displayButton").click(function(){
        setup() 
     });
    $("#seeCardButton").click(function(){
        $("#scrapbook").modal();
        createSquadItem(game.squad.keepers(),"keeperRow")
        createSquadItem(game.squad.defenders(),"defenderRow")
        createSquadItem(game.squad.midfielders(),"midfielderRow")
        createSquadItem(game.squad.forwards(),"forwardRow")
    });
    $("#saveToBook").click(function(){ //copies card from GOAL popup and modifies it and adds to scrapbook
       saveToBook() 
    });
    $("#settingsButton").click(function(){
        $("#settings").modal();
    });

    game.chances = document.getElementById("chancesOption").value; //added here because it needs to wait until the html for chancesOption actually loads before setting the value

    $("#displayInfoBox").click(function(){
        $("#playerInfo").toggleClass("d-none")
    });

    goalSound = new sound("assets/sounds/goalSound.mov");
    worldCupSong = new sound("assets/sounds/worldCupSong.mp3")
    wrongAnswerSound = new sound("assets/sounds/wrongAnswer.mov")
    championeSound = new sound("assets/sounds/champione.mov")

    $("#volume").click(function(){
        if ($("#volumeIcon").hasClass("fa-pause-circle")){
            $("#volumeIcon").removeClass("fa-pause-circle");
            $("#volumeIcon").addClass("fa-play-circle")
            worldCupSong.stop()
        }else if ($("#volumeIcon").hasClass("fa-play-circle")){
            $("#volumeIcon").removeClass("fa-play-circle");
            $("#volumeIcon").addClass("fa-pause-circle")
            worldCupSong.play()
        }
    });

    $("#initHidden").click(function(){
        $("#textInput").focus()
    });
    $("#playWorldCup").click(function(){
        if($("#playWorldCup").hasClass("disabled")){
            $("#noWorldCupModal").modal();
        }else{
            $("#worldCupModal").modal();
        }
    });
    $("#continueButton").click(function(){
        game.playWorldCup()
    })

});
var alphabet = 'abcdefghijklmnopqrstuvwxyz-' //letters and symbols that exist in player names
function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
            this.sound.play();
        }
        this.stop = function(){
            this.sound.pause();
        }
}

function createSquadItem(playersList,targetId){
    $("#"+targetId).children().html("")
    for (var i in playersList){
        var player = playersList[i];
        var newCard = $("<div>");
        newCard.addClass("card d.block text-center honoluluBlue shadow-lg float-left mx-1 my-1");
        newCard.css({
            "width": "150px",
            "height": "250px"
        })
        $("#"+targetId).children().append(newCard)
        console.log(newCard)

        var image = $("<img>");
        image.addClass("card-img-top");
        image.attr("src",player.image);
        image.attr("alt","Player Image");
        newCard.append(image)

        var cardBody = $("<div>");
        cardBody.addClass("card-body pt-1")
        newCard.append(cardBody)

        var title = $("<h5>");
        title.addClass("card-title mb-1 mt-0");
        title.css({
            "font-size":"15px",
            "font-weight": "bold"
        });
        title.text(player.name);
        cardBody.append(title)

        var par = $("<p>");
        par.addClass("card-text")
        par.css({
            "font-size": "12px"
        });
        par.text(player.pos +" from "+ player.nat)
        cardBody.append(par)
    }
}



var game = {
    difficulty: function(){
        var dif;
        if(document.getElementById('allCountriesRadio').checked){
            dif = "hard"
        }else{
            dif = "easy"
        }
        return dif
    },
    positions: function(){
        var checkboxes = document.getElementsByName("checkbox");
        var checked =[];
        for (var i in checkboxes){
            if (checkboxes[i].checked){
                checked.push(checkboxes[i].value);
            }
        }
        return checked
    },
    setIndex : function(){
        var posList = game.positions()
        var allPlayers;
        if (posList.length <4){
            allPlayers = filterPosition(posList)
        }
        else{
            allPlayers = players
        }

        if (game.difficulty() == "hard"){
            var playerIndex = Math.floor(Math.random() * allPlayers.length);
            game.index = playerIndex;
            game.player = allPlayers[game.index];
        }
        else{
            var topPlayers = topCountries(allPlayers);
            var playerIndex = Math.floor(Math.random() * topPlayers.length);
            game.index = playerIndex;
            game.player = topPlayers[playerIndex]
        }
    },
    userGuesses : [],
    correctGuessCount:0,
    winCount : 0,
    loseCount: 0,
    displayArr:[],
    display: function(){
        var display = "";
        for (var i = 0; i<game.displayArr.length; i++){
            display += game.displayArr[i]+" ";
        }
        return display;
    },
    scrapbook:[],
    squad:{
        load: function(){
            game.squad.keepers();
            game.squad.defenders();
            game.squad.midfielders();
            game.squad.forwards();
            game.squad.qualityIndex();
        },
        keepers: function(){
            var list = []
            for (var i in game.scrapbook){
                var player = game.scrapbook[i]
                if (player.pos == "Goalkeeper"){
                    list.push(player)
                }
            }
            return list
        },
        defenders: function(){
            var list = []
            for (var i in game.scrapbook){
                var player = game.scrapbook[i]
                if (player.pos == "Defender"){
                    list.push(player)
                }
            }
            return list
        },
        midfielders: function(){
            var list = []
            for (var i in game.scrapbook){
                var player = game.scrapbook[i]
                if (player.pos == "Midfielder"){
                    list.push(player)
                }
            }
            return list
        },
        forwards: function(){
            var list = []
            for (var i in game.scrapbook){
                var player = game.scrapbook[i]
                if (player.pos == "Forward"){
                    list.push(player)
                }
            }
            return list
        },
        qualityIndex: function(){
            var qi = 0;
            var qualList = ["Italy","Argentina","Portugal","England","Spain","Germany","Belgium","France","Brazil"];
            for (var i in game.scrapbook){
                var player = game.scrapbook[i]
                var index = qualList.indexOf(player.nat)
                if(index>-1){
                    qi += 2+index;
                }else{
                    qi += 1;
                }
            } return qi/18 //max qi in 11 player squad:6.11  max qi in 18 player squad: 10 
        }
    },
    active: true,
    soundEffects: function(){
        var isOn = document.getElementById("soundEffectsOption").value;
        if (isOn == "On"){
            goalSound = new sound("assets/sounds/goalSound.mov");
            wrongAnswerSound = new sound("assets/sounds/wrongAnswer.mov");
            championeSound = new sound("assets/sounds/champione.mov");
        }
        else{
            goalSound = new sound("");
            wrongAnswerSound = new sound("");
            championeSound = new sound("");
        }
    },
    isWorldCup: function(){
        if (game.scrapbook.length>=11){
            $("#playWorldCup").removeClass("disabled")
            $("#playWorldCup").removeClass("btn-outline-light")
            $("#playWorldCup").addClass("btn-light")
        }
    },
    playWorldCup: function(){

        if (game.squad.keepers().length > 0 && game.squad.defenders().length >=4 && game.squad.midfielders().length >=3 && game.squad.forwards().length >=3){
            if (game.squad.qualityIndex() > 6){
                $("#wonWorldCupModal").modal();
                championeSound.sound.currentTime = 0;
                championeSound.play()
                game.winCount=0;
                game.loseCount=0;
                game.scrapbook=[];
                $("#scrapbook-body").html("");

            }else{
                $("#lostWorldCupModal").modal();
                game.winCount=0;
                game.loseCount=0;
                game.scrapbook=[];
                $("#scrapbook-body").html("");
            }
        }else{
            $("#lostWorldCupModal").modal();
            game.winCount=0;
            game.loseCount=0;
            game.scrapbook=[]; 
            $("#scrapbook-body").html("");
        }
    }
}

//resets core game stats when the user continues on to the next player
function resetGame(){
    $("#textInput").val("");
    wrongAnswerSound.stop();
    wrongAnswerSound.sound.currentTime = 0;
    goalSound.stop();
    goalSound.sound.currentTime = 0;
    game.active=true;
    game.userGuesses=[];
    game.correctGuessCount=0;
    game.chances = document.getElementById("chancesOption").value;
    game.displayArr=[],

    $("#ballImageAI").css({
        "top":"50%"
    });
    $("#ballImageUser").css({
        "bottom":"50%"
    });
}

//update elements on screen including correct guesses, wrong guesses, score, player info 
function updateScreen(){
    $("#display").html(game.display())
    $("#guesses").html(game.userGuesses)
    $("#score").html('<p style= "float:left">Human</p>'+ game.winCount+ " - "+ game.loseCount+' <p style= "float:right">Computer</p>')
    $("#playerInfo").text(game.player.pos+ " from "+ game.player.nat)
    $("#chances").text("Chances Left: "+ game.chances)
}

//moves computer ball every time user picks a wrong guess
function aiBallMovement(){
    var ball = $("#ballImageAI")
    ball.css({
        "top": String(50 + (10 - Number(game.chances))*4.5)+"%"
    });
}

//moves user ball every time user picks a correct letter
function userBallMovement(){
    var ball = $("#ballImageUser")
    ball.css({
        "bottom": String(50 + (game.correctGuessCount/game.player.name.length)*45)+"%"
    });
}

//sets up game every time a user moves on to the next player
function setup(){
    resetGame();
    game.soundEffects();
    $(".initHidden").removeClass("d-none") //only valid for first start
    game.setIndex();
    var displayArr = [];
    for(var i=0 ; i<game.player.name.length ; i++){ //creates the __ __ __ __ based on player names
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


function saveToBook(){
    if(game.scrapbook.indexOf(game.player) == -1){ //if the player doesn't already exist in the scrapbook
        // var card = $("#win-modal-body").children().clone();
        // card.addClass("float-left mx-1 my-1")
        // card.css({
        //     "height":"250px",
        //     "width":"150px"
        // });
        // var body = card.children().first().next()
        // body.addClass("pt-1")
        // var title = body.children().first()
        // title.addClass("mb-1 mt-0")
        // title.css({
        //     "font-size":"15px",
        //     "font-weight":"bold"
        // });
        // var info = title.next()
        // info.text(game.player.pos+" from "+game.player.nat);
        // info.css({
        //     "font-size":"12px"
        // });
        // card.removeClass("mx-auto")
        // $("#scrapbook-body").append(card);
        $("#winModal").modal('toggle');

        game.scrapbook.push(game.player)
    }
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

//checks if user won. if true, adds to win count, makes scrapbook visible after first win, and returns true
function didWin(){
    if (game.displayArr.indexOf("__") == -1) {
        $("#winModal").modal();
        
        //adds card html to winModal
        $("#win-modal-body").html(            
        '<div class="card d.block mx-auto text-center honoluluBlue shadow-lg" style="width: 18rem;">'+
            '<img class="card-img-top" src="'+game.player.image+'" alt="Player Image">'+
            '<div class="card-body">'+
                '<h5 class="card-title">'+game.player.name+'</h5>'+
                '<p class="card-text">Nationality: '+game.player.nat+'<br> Position: '+game.player.pos+'</p>'+
            '</div>'+
        '</div>'
        );

        game.winCount += 1
        $("#seeCardButton").removeClass('d-none'); //allows user to be able to open up the scrapbook after the first win


        return true;
    }else return false;
}

//checks if user lost based on remaining chances. if true shows lose modal and returns true
function didLose(){
    if(game.chances<=0){
        game.loseCount +=1
        $("#loseModal").modal();
        return true;
    }else return false;
}

//when game.active is true collects userInput from keyboard onkeyup event. if letter exists in target word 
document.onkeyup = function(event){

    var userInput = event.key;
    if (game.active){
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
                goalSound.play();
                game.active = false; //deactivates game so that keyboard buttons don't run this function until user moves on to the next player and game.active==true again
                game.isWorldCup();
            }else{
                if (didLose()){
                wrongAnswerSound.play()
                game.active = false; //deactivates game so that keyboard buttons don't run this function until user moves on to the next player and game.active==true again
                }
            }
        }       
        updateScreen()
    }
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



