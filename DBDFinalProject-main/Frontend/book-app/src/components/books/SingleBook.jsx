import React, { useContext, useState, useEffect } from 'react'
import { FunctionsContext } from '../context/FunctionsProvider';
import { AccountContext } from '../context/AccountProvider';
import { imageUrl } from '../constants';
import logo0 from './0.PNG';
import logo1 from './0.5.PNG';
import logo2 from './1.PNG';
import logo3 from './1.5.PNG';
import logo4 from './2.PNG';
import logo5 from './2.5.PNG';
import logo6 from './3.PNG';
import logo7 from './3.5.PNG';
import logo8 from './4.PNG';
import logo9 from './4.5.PNG';
import logo10 from './5.PNG';
import axios from 'axios';
// import Rating from './Rating';

import { Box } from '@material-ui/core'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
// import $ from 'jquery';
// import Popper from 'popper.js';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'

import ReactStars from 'react-stars'
// this is should be got from database. In code this will be set when open button is pressed (BookCard.jsx)
// currently on pressing i am setting setBookId(book) 
// instead i need to do setBookId(information from database including ratings)

const SingleBook = () => {
    const { bookId, setBookId } = useContext(FunctionsContext);
    const [num, setNum] = useState(logo0);
    const { account } = useContext(AccountContext);
    const [ratingsBox, setRatingsBox] = useState([]);

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [status, setStatus] = useState("Set Status");
    const [description, setDescription] = useState("");

    const boxImageConvert = (n) => {
        switch (n) {
            case 0: return (logo0);
            case 0.5: return (logo1);
            case 1: return (logo2);
            case 1.5: return (logo3);
            case 2: return (logo4);
            case 2.5: return (logo5);
            case 3: return (logo6);
            case 3.5: return (logo7);
            case 4: return (logo8);
            case 4.5: return (logo9);
            case 5: return (logo10);
        }
    }
    useEffect(() => {
        const getRatings = async () => {
            await axios.post('http://localhost:3002/bookDetails', { 'bookId': bookId['id'] })
                .then((res) => {
                    const revs = []
                    for (let i = 0; i < res.data.length - 1; i++) {
                        revs.push({
                            ...res.data[i],
                            "revImg": (res.data[i]['rating_value'])
                        })
                        console.log(revs);
                    }
                    setDescription(res.data[res.data.length - 1]["description"]);
                    setRatingsBox(revs);
                })
                await axios.post('http://localhost:3002/getStatus', { 'bookId': bookId['id'], 'e_mail' : account.e_mail})
                .then((res) => {
                    console.log(res.data);
                    setStatus(res.data);
                })    
        }
        getRatings();
    }, [])

    const tranformToImage = (e) => {
        e.preventDefault();
        const n = e.target.value;
        // console.log(n);
        switch (n) {
            case '0': setNum(logo0); break;
            case '0.5': setNum(logo1); break;
            case '1': setNum(logo2); break;
            case '1.5': setNum(logo3); break;
            case '2': setNum(logo4); break;
            case '2.5': setNum(logo5); break;
            case '3': setNum(logo6); break;
            case '3.5': setNum(logo7); break;
            case '4': setNum(logo8); break;
            case '4.5': setNum(logo9); break;
            case '5': setNum(logo10); break;
        }
        console.log(num);
    }

    const handleSubmit = async () => {
        // e.preventDefault();
        const rev = {
            "e_mail": account.e_mail,
            "bookId": bookId['id'],
            "rating": rating,
            "review": review,
        };
        console.log(rev);
        await axios.post('http://localhost:3002/rating', rev)
            .then((res) => {
                if (res.data == "") alert("You have already rated this book!");
                console.log(res);
            })
            .catch(err => console.log(err));
    }

    const handleSelect = (e) => {
        console.log(e);
        if(e !== status)
            setStatus(e)
    }

    useEffect(async () => {
        if (status === "Set Status") return;
        const details = {
            "e_mail": account.e_mail,
            "bookId": bookId['id'],
            "status": status,
        }
        await axios.post('http://localhost:3002/updatestatus', details)
            .then((res) => {
                if (res === '') alert("status change not possible!");
                //else alert("status change successfull");
            })
            .catch(err => console.log(err));
    }, [status])

    const ratingChanged = (newRating) => {
        console.log("new rating : ",newRating);
        setRating(newRating);
    };

    console.log("book id : ",bookId['id']);


    return (
        <div style={{backgroundColor:'#d4e4f1'}}>
            <div style={{ display: 'flex', flexDirection: 'row', paddingBottom: '2em' }}>
                <img src={bookId['cover']} alt="cover" style={{marginLeft:'1em',marginTop:'1em',width:'180px',height:'280px'}}/>
                <div>
                    <p style={{ fontSize: '3em', fontWeight: '500', margin: 0, paddingLeft: '1em'}}>{bookId['name']}</p>
                    <p style={{ fontSize: '1.5em', fontWeight: '200', paddingLeft: '2em' }}>By {bookId['author']}</p>
                    <p style={{paddingLeft:'2em',fontSize:'20px'}}>{description}</p>
                </div>
            </div>
            <DropdownButton
                alignBottom
                title={status}
                id="dropdown-menu-align-right"
                onSelect={handleSelect}
                style={{ marginLeft:'3em',width: '10px', paddingBottom: '2em' }}
            >
                <Dropdown.Item eventKey="Wish To Read">Wish To Read</Dropdown.Item>
                <Dropdown.Item eventKey="Currently reading">Currently reading</Dropdown.Item>
                <Dropdown.Item eventKey="Finished reading">Finished reading</Dropdown.Item>
                <Dropdown.Item eventKey="Wish to re-read">Wish to re-read</Dropdown.Item>
            </DropdownButton>
            {/* <div style={{ marginLeft:'1em',display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'center' }}>
                <label htmlFor="rating" style={{ paddingRight: '10px' }}>Rating</label>
                <input
                    name="rating"
                    type="number"
                    min="0" max="5" step="0.5"
                    onInput={tranformToImage}
                    onKeyDown={(e) => { alert("use the arrows to set rating!"); e.preventDefault() }}
                    onChange={(e) => { e.preventDefault(); setRating(e.target.value) }}
                />
                <span>
                    <img src={num} alt="rating" style={{ height: '37px', width: '90px', paddingLeft: '1em' }} /> </span>
            </div> */}
            <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                <div style={{marginLeft:'1em',paddingRight:'1em',fontSize:'22px',fontWeight:'bold'}}>Rate this Book!</div>
                <ReactStars
                    count={5}
                    onChange={ratingChanged}
                    size={40}
                    color2={'#ffd700'}
                    half={true} 
                    value={rating}
                    style={{marginLeft:'1em'}}
                />
            </div>
            <div style={{ marginLeft:'1em',paddingTop: '30px' }}>
                <label htmlFor="rating" style={{fontSize:'28px',fontWeight:'bold'}}>Add Review</label>
            </div>
            <div>
                <div>
                    <textarea id="w3review" name="w3review" rows="8" cols="100" style={{marginLeft:'1em'}}onChange={(e) => { e.preventDefault(); setReview(e.target.value) }}>
                    </textarea>
                    <button onClick={handleSubmit} style={{ margin: '20px 0px' }}> submit</button>
                </div>
                <Box>
                    <b style={{fontSize:'28px'}}>REVIEWS</b>
                    {
                        ratingsBox.map((r, index) => {
                            return (
                                <>
                                    <div style={{ display: 'flex', flexDirection: 'row', padding: '10px' }}>
                                        <div style={{position:'relative'}}>
                                            <img src={r['user_image']} alt="profilePic" style={{ width: '30px' }} />
                                            <div><span>{r['f_name']}</span> <span>{r['l_name']}</span></div>
                                        </div>
                                        <div style={{ position:'absolute',left: '200px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '40px', textAlign: 'left' }}>
                                            <ReactStars
                                                count={5}
                                                size={40}
                                                color2={'#ffd700'}
                                                half={true} 
                                                value={r["revImg"]}
                                                edit={false}
                                             />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '40px', textAlign: 'left'}}>{r['ReviewComment']}</div>
                                        </div>
                                    </div>
                                    <hr />
                                </>
                            )
                        })
                    }
                </Box>
            </div>
            <button onClick={() => setBookId({})} style={{ marginTop: '30px' }}> Back</button>
        </div>
    )
}

export default SingleBook
