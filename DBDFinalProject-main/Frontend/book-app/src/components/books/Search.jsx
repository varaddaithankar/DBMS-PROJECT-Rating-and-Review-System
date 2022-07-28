import React, { useContext , useState } from 'react'
import {FunctionsContext} from '../context/FunctionsProvider';
import { categories } from '../constants';
import { useEffect } from 'react';
import axios from 'axios';
import './style4.css';
const Search = () => {
    
    const {setSearchBooks,searchBooks,setBookList,setPage} = useContext(FunctionsContext);

    const [checkedState, setCheckedState] = useState(
        new Array(categories.length).fill(0)
    );

    const [bookName,setBookName] = useState(null);
    const [authorName,setAuthorName] = useState(null);
    const [category,setCategory] = useState([]);
    const [filter,setFilter] = useState(null);

    useEffect(() =>{
        setSearchBooks({
            'bookName':null,
            'authorName':null,
             'categories':[],
             'filterRating':null
        })
    },[])

    useEffect(() =>{
        for(let i=0;i<categories.length;i++)
        {
            if(searchBooks['categories'] != null && searchBooks['categories'].includes(categories[i]))
                checkedState[i] = 1;
            else
                checkedState[i] = 0;
        }
    },[searchBooks['categories']])

    useEffect(() =>{
        const getBooks = async (searchBooks) =>{
                console.log("filter parameters : \n" + searchBooks);
                await axios.post('http://localhost:3002/searchBook',searchBooks)
                .then((res) =>{
                    const lob = {};
                    if(res.data.length === 0) alert("No books match your search !!!");
                    for(let i=0;i<res.data.length;i++){
                        lob[res.data[i]['book_id']] = {
                            "authorName" : res.data[i]['author_name'],
                            "bookName" : res.data[i]['book_name'],
                            "cover" : res.data[i]['thumbnail'],
                            "avg_rating" : res.data[i]['AverageRating']
                        }
                    }   
                    console.log(res.data);
                    setBookList(lob);
                })
                .catch(err => console.log(err));
        }
        getBooks(searchBooks);
    },[searchBooks])


    const handleChange = (e) =>{

        // e.preventDefault();
        // const {name,value} = e.target;
        // switch(name){
        //     case "bookName":setBookName(value);break;
        //     case "authorName":setAuthorName(value);break;
        //     default:break;
        // }
        e.preventDefault();
        const {name,value} = e.target;
        setSearchBooks({
            ...searchBooks,
            [name] : value,
        });
    }

    const handleOnClick = (idx) =>{
        const newCheckedState = checkedState.map((key,index) =>(
            (index === idx) ? 1 - key : key
        ));
        setCheckedState(newCheckedState);
        const checkedCategories = []
        for(let i=0;i<newCheckedState.length;i++){
            if(newCheckedState[i]) checkedCategories.push(categories[i]);
        }
        setCategory(checkedCategories);
    }
    
    const handleRating = (e) =>{
        const {id} = e.target;
        setFilter({id});
    }
    const handleSearch = (e) =>{
        e.preventDefault();
        setPage(0);
        setSearchBooks({
            "bookName": bookName,
            "authorName":authorName,
            "categories": category,
            "filterRating":filter
        })
    }

    return (
        <div className="entireTableInSearch">
            <div className="bookSearch" style={{padding:'20px 0px 20px 10px'}}>
            <label htmlFor="bookName" className="boookSearchInSearch">Name of Book</label>
                <input type="text" className="textBoxofBookSearch" name="bookName" defaultValue = {searchBooks['bookName']} onChange={handleChange} style={{marginLeft:'19px'}}/>
            </div><hr/>
            <div className="authorSearch" style={{padding:'10px 0px 20px 10px'}}>
            <label className="authorSearchInSearch" htmlFor="authorName">Name of Author</label>
                <input type="text" name="authorName" defaultValue = {searchBooks['authorName']} onChange={handleChange} style={{marginLeft:'10px'}}/>
            </div><hr/>
            <p className="categoriesInSearch">Categories</p>
            <div  style={{marginLeft:'15px'}}>
                
                {
                    categories.map((key, index) => {
                        return (
                            <div className="categories-list-item" style={{paddingBottom:'10px'}}>
                                <input 
                                type="checkbox"
                                id={`checkbox-${index}`}
                                name={key}
                                //defaultValue = {searchBooks['categories']}
                                value={key}
                                checked={(checkedState[index])} /*|| (searchBooks['categories'] != null && searchBooks['categories'].includes(key))) ? true : false}*/
                                onClick={() =>handleOnClick(index)}
                                />
                                <label htmlFor={`custom-checkbox-${index}`}>{key}</label>
                            </div>
                        );
                    })
                }
            </div>
            <hr/>
            {/* <p className="filterInSearch">Filer By Rating</p> */}
            {/* <div className="filterRadioButtorInSearch">
                <span>
                    <input type="radio" name="rating" id='4.5' onClick={handleRating}/>
                    <label htmlFor=""> > 4.5 star</label>
                </span>
                <span style={{marginLeft:'10px'}}>
                    <input type="radio" name="rating" id='4' onClick={handleRating}/>
                    <label htmlFor=""> > 4 star</label>
                </span><br/>
                <span>
                    <input type="radio" name="rating" id='3.5'onClick={handleRating}/>
                    <label htmlFor=""> > 3.5 star</label>
                </span>
                <span style={{marginLeft:'10px'}}>
                    <input type="radio" name="rating" id='3' onClick={handleRating}/>
                    <label htmlFor=""> > 3 star</label>
                </span><br/>
                <span>
                    <input type="radio" name="rating" id='2.5' onClick={handleRating}/>
                    <label htmlFor=""> > 2.5 star</label>
                </span>
                <span style={{marginLeft:'10px'}}>
                    <input type="radio" name="rating" id='2' onClick={handleRating}/>
                    <label htmlFor=""> > 2 star</label>
                </span><br/>
            </div> */}
            <div style={{width:'70%'}}>
            <button className="searchButtonInSearch" onClick = {handleSearch}>Search</button>
            </div>
        </div>
    )
}

export default Search

