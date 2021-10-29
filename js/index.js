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

    for (var i=0; i<teamData.length; i++) {
        console.log(teamData[i])
    }
});