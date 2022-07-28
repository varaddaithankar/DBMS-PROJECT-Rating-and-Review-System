import React, { createContext, useState } from 'react'

export const FunctionsContext = new createContext(null);

const FunctionsProvider = ({children}) => {
    const [books,setBooks] = useState(true);
    const [page,setPage] = useState(0);
    const [bookId,setBookId] = useState({});
    const [searchBooks,setSearchBooks] = useState({});
    const [bookList,setBookList] = useState([]);
    const [bookList2,setBookList2] = useState([]);
    return (
        <FunctionsContext.Provider value={{
            books,setBooks,
            page,setPage,
            bookId,setBookId,
            searchBooks,setSearchBooks,
            bookList,setBookList,
            bookList2,setBookList2
        }}>
            {children}
        </FunctionsContext.Provider>
    )
}

export default FunctionsProvider


/* books -> boolean
        books tab in navbar , books = true => search page
                              books = false => my lists page (refer Home.jsx)
    bookId -> object
        bookId is book details of a particular book selected by user
    page -> integer
        page number of display of search results
    searchBooks -> object
        search parameters : name of author,book, filter by rating,category etc.
*/