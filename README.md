# Book To Base

Parses the BOM.txt file and puts it into a database.

## Install postgresql

```bash
sudo apt-get --purge remove postgresql* -y
sudo apt-get install postgresql postgresql-contrib -y
```
## Create User and Database

```bash
sudo su postgres
psql
create user elder with password 'bot';
create database elder with owner=elder connection limit=25;
alter user elder with superuser;
```


## Run python script

*\* If you want to save the table to a different database change the login information at the top of the script.*

```bash
python ParseText.py
```

A random verse should appear in your terminal. If it did, everything is worked.

A breif explanation of this code is located in the wiki
