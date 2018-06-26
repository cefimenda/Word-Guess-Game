function topCountries(players){
    var topList = ["Argentina","Brazil","Germany","Belgium","Portugal","France","Spain","England","Italy"]
    var filteredList=[]
    for (var i in players){
        if (topList.indexOf(players[i].nat)>-1){
            filteredList.push(players[i])
        }
    }
    return filteredList
}

function filterPosition(positionsArray){
    var filteredList=[]
    for (var i in players){
        if (positionsArray.indexOf(players[i].pos)>-1){
            filteredList.push(players[i])
        }
    }
    return filteredList
}