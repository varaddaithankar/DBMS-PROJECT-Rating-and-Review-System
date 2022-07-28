import pandas as pd
import mysql.connector
   

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="password",
  database="rec_db"
)

mycursor = mydb.cursor()

#-------------------------------------------------------------------------------------------
#Populates book, author:

#df = pd.read_csv("books.csv") 
# sql = "INSERT INTO Book (book_id,book_name,thumbnail) VALUES (%s, %s, %s)"
# j = 0
# s =  set()
# for i in range(10000):
#     if(df.iloc[i]['book_id'] < 1000):
#         mycursor.execute(sql, (str(df.iloc[i]['book_id']),df.iloc[i]['title'],df.iloc[i]['image_url']))
#         mydb.commit()
#         j += 1
#         author_list = df.iloc[i]['authors'].split(',')
#         for author in author_list:
#             s.add(author)
#         print(j, 'records inserted into book')
# val = []
# i=1
# for author in s:
#     val.append((i,author))
#     i+=1
# sql = "INSERT INTO Author (author_id, author_name) VALUES (%s, %s)"
# for i in range(len(s)):
#     mycursor.execute(sql, val[i])
#     mydb.commit()
#     print(i, 'records inserted into author')

#--------------------------------------------------------------------------------------------
#Populates genre, book_belongsto_genre:

# df2 = pd.read_csv("book_tags.csv")
# df3 = pd.read_csv('tags.csv')

# sql = 'SELECT * FROM book'
# mycursor.execute(sql)
# x = mycursor.fetchall()
# val=[]
# for tup in x:
#     val.append(tup[0])

# dict={}
# i = 1
# for book_id in val:
#     print(i)
#     i += 1
#     for j in range(10000):
#         if(df2.iloc[j]['goodreads_book_id'] == int(book_id)):
#             if book_id in dict:
#                 dict[book_id].append(str(df2.iloc[j]['tag_id']))
#                 if(len(dict[book_id]) == 10):
#                     break
#             else:
#                 dict[book_id] = [str(df2.iloc[j]['tag_id'])]  
#         elif(df2.iloc[j]['goodreads_book_id'] > int(book_id)):
#             break
# print(dict)

# i = 1
# s = set()
# for tag_list in dict.values():
#     print(i)
#     i += 1
#     for tag in tag_list:
#         s.add(tag)
# print(s)


# sql = "INSERT INTO Genre (genre_id, genre_name) VALUES (%s, %s)"
# i = 1
# for tag_id in s:
#     mycursor.execute(sql, (int(tag_id), df3.iloc[int(tag_id)]['tag_name']))
#     mydb.commit()
#     print(i, "records inserted into Genre")
#     i += 1


# sql = "INSERT INTO book_belongsto_genre (Book_book_id, Genre_genre_id) VALUES (%s, %s)"
# i = 1
# s  = set()
# for book_id in dict.keys():
#     for tag in dict[book_id]:
#         print(i)
#         i += 1
#         s.add((book_id, int(tag)))
# i = 1
# for tup in s:
#     mycursor.execute(sql, tup)
#     mydb.commit()
#     print(i, "records inserted into book_belongsto_genre")
#     i += 1

#---------------------------------------------------------------------------------------
#Populates book_writtenby_author

df = pd.read_csv("books.csv")
dict = {}
for i in range(10000):
    if(df.iloc[i]['book_id'] < 1000):
        author_list = df.iloc[i]['authors'].split(',')
        dict[str(df.iloc[i]['book_id'])] = author_list

sql = "INSERT INTO book_writtenby_author (Book_book_id, Author_author_id) VALUES (%s, %s)"
i = 1
for book_id in dict.keys():
    for author in dict[book_id]:
        sql1 = "SELECT author_id FROM author WHERE author_name = '" + author + "'"
        mycursor.execute(sql1)
        x = mycursor.fetchall()
        mycursor.execute(sql, (book_id, x[0][0]))
        mydb.commit()
        print(i, "records inserted into book_writtenby_author")
        i += 1
