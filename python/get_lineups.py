# Imports
import requests, datetime, json, os
from bs4 import BeautifulSoup

from functions.func_lib import *

os.chdir("C:\\Users\\Garrett Horn\\Documents\\NBA-Quiz\\")

lineup_url = "https://www.nba.com/players/todays-lineups/" # URL where player information is stored on NBA.com
request = requests.get(lineup_url) # Sends request to that website

curr_date = datetime.datetime.now() # Gets the current date to be used for file naming

if request.status_code == 200: # Checks the response from the website
    os.makedirs(f"./downloads/{curr_date.strftime('%Y')}/{curr_date.strftime('%B')}/", exist_ok=True)

    lineup_data = open(f"./downloads/{curr_date.strftime('%Y')}/{curr_date.strftime('%B')}/{curr_date.strftime('%m-%d')}lineup.html", "wb") # Creates a new file with the most recent HTML file from the requested website
    for data_chunk in request.iter_content(100000): # Loops through the data on the website
        lineup_data.write(data_chunk) # Writes the data chunk to the HTML file

lineup_page = open(f"./downloads/{curr_date.strftime('%Y')}/{curr_date.strftime('%B')}/{curr_date.strftime('%m-%d')}lineup.html") # Opens the HTML file
lineup_soup = BeautifulSoup(lineup_page, 'lxml') # Uses BS4 to parse through the tags on the site
my_teams = lineup_soup.findAll("div", {"class": "flex-col w-1/2 px-2"}) # Locates all the teams on the site, ones that played today

with open("./json/nba_teams.json") as json_file: # # Opens the JSON file to read
    nba_teams = json.load(json_file) # Loads the JSON file to a dict for updating

for curr_team in my_teams: # Loops through the teams playing today
    curr_team_city = curr_team.find("p", {"class": "t3 ml-2"}).text # Gets Team Cities
    
    players = curr_team.findAll("p", {"class": ["t3 truncate", "t6 truncate"]}) # Gets players on team
    positions = curr_team.findAll("p", {"class": "t3 w-1/5 truncate"}) # Gets positions on teams
    raw_player_ids = curr_team.findAll("a", {"class": "Anchor_complexLink__2NtkO"})
    
    player_ids = []
    for pid in raw_player_ids:
        pid = pid["href"].strip("/")
        pid = pid.split("/")
        player_ids.append(pid)

    clean_player_id = []
    for pid in player_ids:
        if pid[0] == 'player':
            clean_player_id.append(pid[1])    
    
    curr_team_roster = [] # Empty list to add player dictionaries to
    
    counter = 0 # Creates a counter for the loop
    while counter < len(players): # Loops through the players on the team
        curr_team_roster.append(getPlayerData(clean_player_id[counter])) # Adds the temporary player dict to the team roster list

        counter += 1 # Increments the counter.

    for team in nba_teams: # Loops through the NBA Teams JSON File
        if team["city"] == curr_team_city: # Looks for the current team from the JSON to update
            team["roster"] = curr_team_roster # Updates the roster on the JSON file with todays roster

    print(f"FINISHED {curr_team_city}")


with open("./json/nba_teams.json", "w") as output_file: # Opens the JSON file for writing
    json.dump(nba_teams, output_file) # Overwrites the new information on the JSON File