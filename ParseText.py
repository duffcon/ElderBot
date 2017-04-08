import re
import psycopg2

conn = psycopg2.connect('dbname=elder user=elder password=bot host=localhost')
cur = conn.cursor()
text = open('./BOM.txt', 'r');

cur.execute("drop table if exists bom;")

# Create database
cur.execute("""
create table bom(
id serial primary key,
book varchar(20),
chapter integer,
index integer,
verse text);
""")

#Store information for the current verse I am on
cur_book = ''
cur_chapter = ''
cur_index = ''
cur_verse = ''

# 1 means we found the start line and add every line
# 0 means we are currently looking for a start line
read = 0

books = [
'1 Nephi',
'2 Nephi',
'Jacob',
'Enos',
'Jarom',
'Omni',
'Words of Mormon',
'Mosiah',
'Alma',
'Helaman',
'3 Nephi',
'4 Nephi',
'Mormon',
'Ether',
'Moroni']

# include chapter:index into expression
for i in range(len(books)):
    books[i] += ' .+:+.+'


# Regex statement
start_line = "(" + ")|(".join(books) + ")"

for line in text:
    if read:
        #if blank line, stop reading
        if not line.strip():
            read = 0
            cur.execute("""
            insert into bom (book, chapter, index, verse)
            values(%s, %s::integer, %s::integer, %s);""",
            (cur_book, cur_chapter, cur_index, cur_verse[len(cur_index)+2:]))
            continue
        #not a blank line, continue reading

        strp = line.strip('\n')
        strp = strp.strip('\r')
        strp = ' ' + strp;
        cur_verse += strp
    else:
        #If line preceds verse, start reading
        if re.match(start_line, line):
            b = line.rsplit(' ', 1)
            n = b[1].split(':')
            cur_book = b[0].strip('\n')
            cur_chapter = n[0].strip('\n')
            cur_index = n[1].strip('\n')
            cur_verse = ''
            read = 1

# Get random verse to test that it is working
cur.execute("""
select verse from bom order by random() limit 1;
""")
print '\n', cur.fetchall(), '\n'


conn.commit()
cur.close()
conn.close()
