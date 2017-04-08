# ElderBot

<p align="center">
<img src='src/elderbot2.png' width=50% >
</p>

# What is it

ElderBot is your friendly neighbordhood discord bot. He comes knocking on your chat door to help spread the good word. ElderBot has been rigorously studying the Book of Mormon memorzing every letter of every verse. So please open your hearts and doors and get to know ElderBot.

# Demo
soon

# Subjects

- debian linux
- nodejs
- javascript
- postgresql/databases
- inheritance
- events/event handling
- state machines
- string parsing/regex

# How do I install?

*Prerequisite: you already created a bot and added it to your server. If you don't know what that means checkout: https://github.com/duffcon/SimpleDiscordBot*

## Clone Repo

```bash
git clone https://github.com/duffcon/ElderBot.git

#Gets ALL branches
for branch in $(git branch --all | grep '^\s*remotes' | egrep --invert-match '(:?HEAD|master)$'); do
    git branch --track "${branch##*/}" "$branch"
done
git fetch --all
git pull --all

cd ElderBot

```


## Book To Base

```bash
git checkout 0.ParseBOM

```

Parses the BOM.txt file and puts it into a database.

### Install postgresql

```bash
sudo apt-get --purge remove postgresql* -y
sudo apt-get install postgresql postgresql-contrib -y

```
### Create User and Database

```bash
sudo su postgres
psql
create user elder with password 'bot';
create database elder with owner=elder connection limit=25;
alter user elder with superuser;
```


### Run python script

```bash
python ParseText.py

```

If it worked a random verse should appear in your terminal.


## Setup

```bash
git checkout master
npm install

```


### Insert Super Secret Information


**1. Channel_id:** In Discordright right click on text channel -> Copy ID

**2. User_id:** In Discord, in right hand side panel, right click on your profile -> Copy ID

**3. Bot_token:** On discord developer website where you created your app/bot.

Channel_id is so the bot knows where to send messages. User_id adds permissions to commands.This is an array so you can have multiple users.

```javascript
//index.js
var bot = new elder('!', 'Channel_id', ['User_id']);
bot.login('Bot_token');
```

Start it up.
```bash
node .
```
