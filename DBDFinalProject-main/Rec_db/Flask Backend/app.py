from flask import Flask, request
import json
import pandas as pd
import mysql.connector
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity


app = Flask(__name__)
app.run(debug=True)
"""
    1. Update average rating and rating count
    2. Update to_read.csv file
    3. update ratings.csv
"""

   

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="password",
  database="rec_db"
)

mycursor = mydb.cursor()


@app.route("/",methods=['POST'])
def updateDetails():
    print('request from express received')
    data = request.get_json()
    #books = pd.read_csv('../books2.csv')
    #sql = "SELECT user_id FROM User WHERE e_mail = '" + data['email'] + "';"
    #print(sql)
    #mycursor.execute(sql)
    #u = mycursor.fetchall()
    #print(u)
    b = data['b']
    print(b)
    # for i in range(97):
    #     book_id = str(int(books.iloc[i]['book_id']))
    #     sql_for_average="SELECT book_id, AverageRating FROM Book WHERE book_id = '" + book_id + "'"
    #     sql_for_ratingCount = "SELECT COUNT(rating_id) FROM Rating WHERE Book_book_id = '" + book_id + "'"
    #     mycursor.execute(sql_for_average)
    #     x = mycursor.fetchall()
    #     if(x[0][1] != None):
    #         books.at[i,'average_rating'] = x[0][1]
    #     else:
    #         books.at[i,'average_rating'] = 0.0
    #     mycursor.execute(sql_for_ratingCount)
    #     y = mycursor.fetchall()
    #     books.at[i,'ratings_count'] = y[0][0]

    # sql_for_toRead = "SELECT User_user_id,Book_book_id FROM Book_readingStatus_User WHERE status = 'Wish To Read'"
    # mycursor.execute(sql_for_toRead)
    # z = mycursor.fetchall()
    # z2 = []
    # for tup in z:
    #     z2.append((tup[0], int(tup[1])))
    # df2 = pd.DataFrame(z2, columns=['user_id','book_id'])
    # print(type(df2.iloc[0]['book_id']))
    # df2.to_csv('../to_read2.csv', index = False)
    # books.to_csv('../books2.csv',index=False)

    # sql_for_rating = "SELECT Book_book_id, User_user_id, rating_value FROM Rating"
    # mycursor.execute(sql_for_rating)
    # w = mycursor.fetchall()
    # w2 = []
    # for tup in w:
    #     w2.append((int(tup[0]), tup[1], tup[2]))
    # df3 = pd.DataFrame(w2, columns=['book_id', 'user_id', 'rating'])
    # df3.to_csv('../ratings3.csv', index = False)
    l = f(b)
    df = pd.read_csv("../books.csv")
    dict = {}
    for b in l:
        for i in range(df[df.columns[0]].count()):
            if(df.iloc[i]['title'] == b):
                dict[b] = [df.iloc[i]['authors']]
                dict[b].append(df.iloc[i]['image_url'])
                break
    print(dict)
    data['books'] = dict
    return data




def f(b):
    #sql = "SELECT b.book_name FROM Rating r, Book b WHERE r.User_user_id = " + str(user_id) + " AND r.Book_book_id = b.book_id ORDER BY rating_value desc LIMIT 3"
    #mycursor.execute(sql)
    #q = mycursor.fetchall()
    #b = []
    #for tup in q:
    #    b.append(tup[0])
    
    books = pd.read_csv('../books.csv')
    ratings = pd.read_csv('../ratings.csv')
    tags = pd.read_csv('../book_tags.csv')
    btags = pd.read_csv('../tags.csv')
    ratings=ratings.sort_values("user_id")
    ratings.drop_duplicates(subset =["user_id","book_id"], keep = False, inplace = True) 
    books.drop_duplicates(subset='original_title',keep=False,inplace=True)
    btags.drop_duplicates(subset='tag_id',keep=False,inplace=True)
    tags.drop_duplicates(subset=['tag_id','goodreads_book_id'],keep=False,inplace=True)

    fillnabooks= books.fillna('')

    features=['title','authors','average_rating']
    fillednabooks=fillnabooks[features]
    def clean_data(x):
        return str.lower(x.replace(" ", ""))
    
    def create_soup(x):
        return x['title']+ ' ' + x['authors'] + ' ' + x['average_rating']
    
    fillednabooks = fillednabooks.astype(str)
    fillednabooks.dtypes

    for feature in features:
        fillednabooks[feature] = fillednabooks[feature].apply(clean_data)
        fillednabooks.head(2)


    fillednabooks['soup'] = fillednabooks.apply(create_soup, axis=1)
    
    count = CountVectorizer(stop_words='english')
    count_matrix = count.fit_transform(fillednabooks['soup'])

    cosine_sim2 = cosine_similarity(count_matrix, count_matrix)

    fillednabooks=fillednabooks.reset_index()
    x = pd.Series(fillednabooks.index, index=fillednabooks['title'])

    def get_recommendations_new(title, cosine_sim):
        title=title.replace(' ','').lower()
        idx = x[title]

        # Get the pairwsie similarity scores of all books with that book
        sim_scores = list(enumerate(cosine_sim[idx]))

        # Sort the books based on the similarity scores
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

        # Get the scores of the 10 most similar books
        sim_scores = sim_scores[1:11]

        # Get the book indices
        movie_indices = [i[0] for i in sim_scores]
        return list(books['title'].iloc[movie_indices])
    
    s = set()
    print("b = ", b)
    for book in b:
        print(book)
        #book = '"' + book[0:len(book)] + '"'
        #print(book)
        l=[]
        #try:
        l=get_recommendations_new(book, cosine_sim2)
        #except:
            #print("Except")
            #continue
        for rec in l:
            if(rec not in b):
                s.add(rec)
    
    print(list(s))
    return list(s)

