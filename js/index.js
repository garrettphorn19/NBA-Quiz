function getTop(teamData, listLength, stat) {
    var all = []
    var top = [];

    for (var i=0; i<teamData.length; i++) {
        var tempRoster = teamData[i]["roster"]
        for (var j=0; j<tempRoster.length; j++) {
            if (tempRoster[j]["points"] > 0) {
                all.push(tempRoster[j]);
                all.sort(function (a, b) {
                    return b[stat] - a[stat];
                });
            }
        }
    }
    for (var k=0; k < listLength; k++) {
        top.push(all[k])
    }

    return top
}

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

    var topScorers = getTop(teamData, 50, "points")
    var topRebounders = getTop(teamData, 50, "rebounds")
    var topAssistors = getTop(teamData, 50, "assists")
});