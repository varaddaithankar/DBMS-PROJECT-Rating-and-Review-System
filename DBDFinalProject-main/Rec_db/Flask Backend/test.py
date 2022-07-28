import pandas as pd
import mysql.connector
import random
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="password",
  database="rec_db"
)

mycursor = mydb.cursor()

# books = pd.read_csv('../books2.csv')
# for i in range(97):
#         book_id = str(int(books.iloc[i]['book_id']))
#         sql_for_average="SELECT book_id, AverageRating FROM Book WHERE book_id = '" + book_id + "'"
#         sql_for_ratingCount = "SELECT COUNT(rating_id) FROM Rating WHERE Book_book_id = '" + book_id + "'"
#         mycursor.execute(sql_for_average)
#         x = mycursor.fetchall()
#         if(x[0][1] != None):
#             books.at[i,'average_rating'] = x[0][1]
#         else:
#             books.at[i,'average_rating'] = 0.0
#         mycursor.execute(sql_for_ratingCount)
#         y = mycursor.fetchall()
#         books.at[i,'ratings_count'] = y[0][0]

# sql_for_toRead = "SELECT User_user_id,Book_book_id FROM Book_readingStatus_User WHERE status = 'Wish To Read'"
# mycursor.execute(sql_for_toRead)
# z = mycursor.fetchall()
# z2 = []
# for tup in z:
#     z2.append((tup[0], int(tup[1])))
# df2 = pd.DataFrame(z2, columns=['user_id','book_id'])
# print(type(df2.iloc[0]['book_id']))
#df2.to_csv('../to_read2.csv', index = False)
#books.to_csv('../books2.csv',index=False)

# sql_for_rating = "SELECT Book_book_id, User_user_id, rating_value FROM Rating"
# mycursor.execute(sql_for_rating)
# w = mycursor.fetchall()
# w2 = []
# for tup in w:
#     w2.append((int(tup[0]), tup[1], tup[2]))
# df3 = pd.DataFrame(w2, columns=['book_id', 'user_id', 'rating'])
# df3.to_csv('../ratings2.csv', index = False)
#-------------------------------------------------------------------------------------------
#For filling database:

# s = 1
# for k in range(250,301):
#     fname = 'f' + str(k)
#     lname = 'l' + str(k)
#     image = 'http://shift.tools/assets/icons/general-user-b0d8abffed32297721ea9c0e12b96cbc08da894ce401d233f9c955a25edbc3c4.png'
#     email = fname + lname + "@gmail.com"
#     password = '12345' 
#     sql_user = "Insert into user (f_name,l_name,e_mail,user_image,password) values (%s, %s, %s, %s, %s)"
#     tup = (fname, lname, email, image, password)
#     mycursor.execute(sql_user, tup)
#     mydb.commit()
#     print(s, "records inserted into user") 
#     s += 1
    
# ratings = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
# review = ["Terrible book", "Very boring book", "Boring book", "Very bad book", "Bad book", "Average book", "Not a bad book", "Good book", "Very good book", "Great book", "Excellent book"]
# sql = "SELECT book_id FROM Book"
# mycursor.execute(sql)
# x = mycursor.fetchall()
# r = 1
# for i in range(250,301):
#     s = set()
#     for j in range(10):
#         rnd = random.randrange(0,97)
#         while rnd in s:
#             rnd = random.randrange(0,97)
#         book_id = x[rnd][0]
#         num = random.randrange(0,10)
#         sql2 = "INSERT INTO rating (Book_book_id,User_user_id,rating_value,ReviewComment) VALUES (%s, %s, %s, %s)"
#         tup = (book_id, i, ratings[num], review[num])
#         mycursor.execute(sql2, tup)
#         mydb.commit()
#         sql3 = "UPDATE Book SET AverageRating = (SELECT AVG(rating_value) FROM Rating WHERE Book_book_id = '" + book_id +  "') WHERE Book_id = '" + book_id + "'"
#         mycursor.execute(sql3)
#         mydb.commit()
#         print(r, "records inserted")
#         r += 1

#---------------------------------------------------------------------------------------
#For recommendation

# sql = "SELECT User_user_id, Book_book_id, rating_value FROM Rating WHERE User_user_id < 6"
# mycursor.execute(sql)
# x = mycursor.fetchall()
# x2 = []
# for tup in x:
#     x2.append((tup[0], int(tup[1]), tup[2]))
# df = pd.DataFrame(x2, columns=['user_id', 'book_id', 'rating'])
# df.to_csv('../ratings3.csv', index = False)

#--------------------------------------------------------------------------------------------------
#To update average rating:

#imports
books= pd.read_csv('../books.csv',error_bad_lines = False)
ratings = pd.read_csv('../ratings.csv')
tags = pd.read_csv('../book_tags.csv')
btags = pd.read_csv('../tags.csv')
ratings=ratings.sort_values("user_id")
ratings.drop_duplicates(subset =["user_id","book_id"], keep = False, inplace = True) 
books.drop_duplicates(subset='original_title',keep=False,inplace=True)
btags.drop_duplicates(subset='tag_id',keep=False,inplace=True)
tags.drop_duplicates(subset=['tag_id','goodreads_book_id'],keep=False,inplace=True)



# [43] onwards

fillnabooks= books.fillna('')

def clean_data(x):
  return str.lower(x.replace(" ", ""))

features=['original_title','authors','average_rating']
fillednabooks=fillnabooks[features]

fillednabooks = fillednabooks.astype(str)
fillednabooks.dtypes

for feature in features:
  fillednabooks[feature] = fillednabooks[feature].apply(clean_data)
fillednabooks.head(2)

def create_soup(x):
  return x['original_title']+ ' ' + x['authors'] + ' ' + x['average_rating']

fillednabooks['soup'] = fillednabooks.apply(create_soup, axis=1)




count = CountVectorizer(stop_words='english')
count_matrix = count.fit_transform(fillednabooks['soup'])

cosine_sim2 = cosine_similarity(count_matrix, count_matrix)

fillednabooks=fillednabooks.reset_index()
indices = pd.Series(fillednabooks.index, index=fillednabooks['original_title'])

def get_recommendations_new(title, cosine_sim=cosine_sim2):
  title=title.replace(' ','').lower()
  idx = indices[title]

  # Get the pairwsie similarity scores of all movies with that movie
  sim_scores = list(enumerate(cosine_sim[idx]))

  # Sort the movies based on the similarity scores
  sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

  # Get the scores of the 10 most similar movies
  sim_scores = sim_scores[1:11]

  # Get the movie indices
  movie_indices = [i[0] for i in sim_scores]
  return list(books['original_title'].iloc[movie_indices])
df = pd.read_csv("../books.csv")
l=get_recommendations_new('Harry Potter and the Half-Blood Prince', cosine_sim2)
print(l)
dict = {}
for b in l:
    for i in range(df[df.columns[0]].count()):
        if(df.iloc[i]['original_title'] == b):
            dict[b] = [df.iloc[i]['authors']]
            dict[b].append(df.iloc[i]['image_url'])
            break
print(dict)

# ----------------------------------------------------------------------------------------

# sql1 = "Select book_id from Book"
# mycursor.execute(sql1)
# ids = mycursor.fetchall()
# i = 1
# for book_id in ids:
#     sql2 = "UPDATE Book SET AverageRating = (SELECT AVG(rating_value) FROM Rating WHERE Book_book_id = '" + book_id[0] + "' AND User_user_id < 6) WHERE Book_id = '" + book_id[0] + "'"
#     mycursor.execute(sql2)
#     mydb.commit()
#     print(i, "records updated")
#     i += 1