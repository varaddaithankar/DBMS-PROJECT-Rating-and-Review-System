import React, { useContext} from 'react'
import { FunctionsContext } from '../context/FunctionsProvider';
import BookCard from './BookCard';
import Search from './Search';
import { Box, makeStyles } from '@material-ui/core';
const useStyles = makeStyles({
    CardRow:{
        display:'flex',
        flexDirection:'row',
        padding:'20px',
        '& > *':{
            paddingLeft: '30px',
            height:'400px'
        }
    }
})
const Books = () => {
    // const [page,setPage] = useState(0);
    const {page,setPage,setBookId} = useContext(FunctionsContext);
    const {bookList} = useContext(FunctionsContext);
    const classes = useStyles();
    const no = Object.keys(bookList).length/6;
    return (
        <div style={{overflow:'none',backgroundColor:'#d4e4f1'}}>
            <div style={{textAlign:'center',fontSize:'25px',padding:'10px 0px 20px 0px'}}>Search Your Books Here</div>
            {
                <div className="container">
                <div style={{width:'25vw',border:'2px solid #4A4E69',height:'100%',marginTop:"1.3em",}}>
                    <Search/>
                </div>
                <div className="displayBooks" style={{left:'auto'}}>
                <div>
                     {
                         <Box className ={classes.CardRow}>
                            {
                                Object.entries(bookList).slice(page*6,Math.min(page*6 + 3,Object.keys(bookList).length)).map((book) =>(
                                <div>
                                <BookCard id={book[0]} name={book[1]['bookName']} author={book[1]['authorName']} cover ={book[1]['cover']} avg_rating = {book[1]['avg_rating']}/>
                                </div>
                                ))
                            }
                        </Box>
                     }
                </div>
                <div>
                     {
                         <Box className ={classes.CardRow}>
                            {
                                Object.entries(bookList).slice(page*6+3,Math.min((page+1)*6,Object.keys(bookList).length)).map((book) =>(
                                <div>
                                <BookCard id={book[0]} name={book[1]['bookName']} author={book[1]['authorName']} cover ={book[1]['cover']} avg_rating={book[1]['avg_rating']}/>
                                </div>
                                ))
                            }
                        </Box>
                     }
                     </div>
                </div>
                </div>
            }
            <div style={{marginTop:'10px'}}>
                {
                    page + 1 < no ? <button onClick={() =>setPage(page+1)}>Next</button> : null
                }
                {page > 0 ? <button onClick={() =>setPage(page-1)} >Back</button> : null}
            </div>
        </div>
    )
}

export default Books

// id={book[0]} name={book[1]['name']} author={book[1]['author']} cover ={book[1]['cover']}