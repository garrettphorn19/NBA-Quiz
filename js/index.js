function getTop(teamData, listLength, stat) {
    var all = []
    var top = [];

    for (var i = 0; i < teamData.length; i++) {
        var tempRoster = teamData[i]["roster"]
        for (var j = 0; j < tempRoster.length; j++) {
            if (tempRoster[j]["points"] > 0) {
                all.push(tempRoster[j]);
                all.sort(function (a, b) {
                    return b[stat] - a[stat];
                });
            }
        }
    }
    for (var k = 0; k < listLength; k++) {
        top.push(all[k])
    }

    return top
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

readTextFile("./json/nba_teams.json", function (text) {
    var allTeams = JSON.parse(text);

    var topScorers = getTop(allTeams, 30, "points")
    loadPointsMode(topScorers);
    var topRebounders = getTop(allTeams, 30, "rebounds")
    loadReboundsMode(topRebounders);
    var topAssistors = getTop(allTeams, 30, "assists")
    loadAssistsMode(topAssistors);

    for (var counter = 0; counter < document.querySelectorAll(".mode-button").length; counter++) {
        document.querySelectorAll(".mode-button")[counter].addEventListener("click", function () {

            switch (this.innerHTML) {
                case "All Teams":
                    break;
                case "Scoring Leaders":
                    $("#points-mode").show();
                    $("#choose-mode-section").hide();

                    $(".close-button").click(function () {
                        $("#points-mode").hide();
                        $("#choose-mode-section").show();
                    });
                    break;
                case "Rebound Leaders":
                    $("#rebounds-mode").show();
                    $("#choose-mode-section").hide();

                    $(".close-button").click(function () {
                        $("#rebounds-mode").hide();
                        $("#choose-mode-section").show();
                    });
                    break;
                case "Assist Leaders":
                    $("#assists-mode").show();
                    $("#choose-mode-section").hide();

                    $(".close-button").click(function () {
                        $("#assists-mode").hide();
                        $("#choose-mode-section").show();
                    });
                    break;
            }
        });
    }
});

function loadPointsMode(data) {
    var table = $('<table>').addClass('table table-hover leader-table');
    for (i = 0; i < data.length; i++) {
        var row = $('<tr>').addClass('points-table-row');

        var fullName = data[i]["fname"] + " " + data[i]["lname"]
        var fullNameClass = data[i]["fname"] + "-" + data[i]["lname"]

        var rank = $("<td>").addClass("rank-col").text((i + 1) + ".")
        row.append(rank);

        var fullNameTd = $("<td>").addClass("name-col " + fullNameClass).text(fullName)
        row.append(fullNameTd);

        var points = $("<td>").addClass("points-col").text(data[i]["points"])
        row.append(points);

        table.append(row);
    }

    $('.points-table-div').append(table);

}

function loadReboundsMode(data) {
    var table = $('<table>').addClass('rebounds-table leader-table');
    for (i = 0; i < data.length; i++) {
        var row = $('<tr>').addClass('rebounds-table-row');

        var fullName = data[i]["fname"] + " " + data[i]["lname"]
        var fullNameClass = data[i]["fname"] + "-" + data[i]["lname"]

        var rank = $("<td>").addClass("rank-col").text((i + 1) + ".")
        row.append(rank);

        var fullNameTd = $("<td>").addClass("name-col " + fullNameClass).text(fullName)
        row.append(fullNameTd);

        var rebounds = $("<td>").addClass("rebounds-col").text(data[i]["rebounds"])
        row.append(rebounds);

        table.append(row);
    }

    $('.rebounds-table-div').append(table);

}

function loadAssistsMode(data) {
    var table = $('<table>').addClass('assists-table leader-table');
    for (i = 0; i < data.length; i++) {
        var row = $('<tr>').addClass('assists-table-row');

        var fullName = data[i]["fname"] + " " + data[i]["lname"];
        var fullNameClass = data[i]["fname"] + "-" + data[i]["lname"];

        var rank = $("<td>").addClass("rank-col").text((i + 1) + ".")
        row.append(rank);

        var fullNameTd = $("<td>").addClass("name-col " + fullNameClass).text(fullName)
        row.append(fullNameTd);

        var assists = $("<td>").addClass("assists-col").text(data[i]["assists"])
        row.append(assists);

        table.append(row);
    }

    $('.assists-table-div').append(table);

}