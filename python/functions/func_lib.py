import requests, os
from bs4 import BeautifulSoup

def getPlayerData2(player, position, pid):
    temp_dict = {} # Temporary ditionary for players information

    curr_player = player.text # Gets the players full name
    curr_player_fname = curr_player.split(" ")[0] # Gets the players first name
    curr_player_lname = curr_player.split(" ")[1] # Gets the players last name
    curr_position = position.text # Gets the players position
    curr_player_id = pid
    
    temp_dict["fname"] = curr_player_fname # Adds players first name to the dict
    temp_dict["lname"] = curr_player_lname # Adds players last name to the dict
    temp_dict["position"] = curr_position # Adds players position to the dict
    temp_dict["player_id"] = curr_player_id

    return temp_dict

def getPlayerData(pid):
    temp_dict = {}

    player_info_dict = getInfoViaID(pid)

    temp_dict["player_id"] = pid
    temp_dict["fname"] =    player_info_dict["player_first_name"]
    temp_dict["lname"] =    player_info_dict["player_last_name"]
    temp_dict["position"] = player_info_dict["player_position"]
    temp_dict["college"] = player_info_dict["player_college"]
    temp_dict["points"] = player_info_dict["player_ppg"]
    temp_dict["rebounds"] = player_info_dict["player_rpg"]
    temp_dict["assists"] = player_info_dict["player_apg"]
    temp_dict["height"] = player_info_dict["player_height"]
    temp_dict["weight"] = player_info_dict["player_weight"]
    temp_dict["age"] = player_info_dict["player_age"]
    

    return temp_dict

def getInfoViaID(pid):
    player_url = f"https://www.nba.com/player/{pid}/"
    request = requests.get(player_url)

    if request.status_code == 200:
        os.makedirs(f"downloads/players/", exist_ok=True)
        player_data = open(f"downloads/players/player{pid}.html", 'wb')
        for data_chunk in request.iter_content(100000):
            player_data.write(data_chunk)

    player_page = open(f"downloads/players/player{pid}.html", errors="ignore")
    player_soup = BeautifulSoup(player_page, 'lxml')

    player_first_name =     player_soup.findAll("p", {"class": "PlayerSummary_playerNameText__K7ZXO"})[0].text
    player_last_name =      player_soup.findAll("p", {"class": "PlayerSummary_playerNameText__K7ZXO"})[1].text
    player_data_string =    player_soup.find("p", {"class": "t11 md:t2"}).text.split(" | ")
    player_position =       player_data_string[len(player_data_string)-1]
    player_college =        player_soup.findAll("p", {"class": "PlayerSummary_playerInfoValue__mSfou"})[3].text
    player_ppg =            player_soup.findAll("p", {"class": "PlayerSummary_playerStatValue__3hvQY"})[0].text
    player_rpg =            player_soup.findAll("p", {"class": "PlayerSummary_playerStatValue__3hvQY"})[1].text
    player_apg =            player_soup.findAll("p", {"class": "PlayerSummary_playerStatValue__3hvQY"})[2].text
    player_height =         player_soup.findAll("p", {"class": "PlayerSummary_playerInfoValue__mSfou"})[0].text
    player_weight =         player_soup.findAll("p", {"class": "PlayerSummary_playerInfoValue__mSfou"})[1].text
    player_age =            player_soup.findAll("p", {"class": "PlayerSummary_playerInfoValue__mSfou"})[4].text

    return {
        "player_first_name":    player_first_name,
        "player_last_name":     player_last_name,
        "player_position":      player_position,
        "player_college":       player_college,
        "player_ppg":           player_ppg,
        "player_rpg":           player_rpg,
        "player_apg":           player_apg,
        "player_height":        player_height,
        "player_weight":        player_weight,
        "player_age":           player_age,
    }