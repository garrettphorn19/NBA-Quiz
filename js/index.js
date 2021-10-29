function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

readTextFile("./json/nba_teams.json", function(text){
    var teamData = JSON.parse(text);

    var topScorers = getTopScorers(teamData, 50)
    console.log(topScorers)
});

function getTopScorers(teamData, listLength) {
    var allScorers = []
    var topScorers = [];

    for (var i=0; i<teamData.length; i++) {
        var tempRoster = teamData[i]["roster"]
        for (var j=0; j<tempRoster.length; j++) {
            if (tempRoster[j]["points"] > 0) {
                allScorers.push(tempRoster[j]);
                allScorers.sort(function (a, b) {
                    return b.points - a.points;
                });
            }
        }
    }
    for (var k=0; k < listLength; k++) {
        topScorers.push(allScorers[k])
    }

    return topScorers
}