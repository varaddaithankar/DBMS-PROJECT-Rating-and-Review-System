import React, {useContext, useState}from 'react'
import {AppBar,Toolbar, Typography, Button,makeStyles,Box} from '@material-ui/core';
import Login from './account/Login';
import Signup from './account/Signup';
import { AccountContext } from '../components/context/AccountProvider';
import { FunctionsContext } from './context/FunctionsProvider';
import Profile from './profile/Profile';
const NavBar = () => {
    const [login,setLogin] = useState({color:'#fffff',status:false});
    const [signup,setSignup] = useState({color:'#fffff',status:false});
    const {account,setAccount,setOpenSignup,setOpenLogin,setProfile,profile} = useContext(AccountContext);
    const {books,setBooks,setBookId,setPage} = useContext(FunctionsContext);
    console.log(account);
    const classes = makeStyles({
        component:{
            display:'flex',
            marginLeft:'auto',
            paddingLeft:'100px',
            '& > *':{
                paddingRight: '50px'
            }
        },
        appbar:{
            color:'#fff',
        },
        signup:{
            color:`${signup.color}`,
            textAlign:'center',
            cursor:'pointer'
        },
        login:{
            color:`${login.color}`,
            textAlign:'center',
            cursor:'pointer'
        }
    })();
    const handleSignup = () =>{
        const newsignup = {...signup,
            color:'rgba(0,256,0,0.5)',
            status:true
        }
        const newlogin = {
            ...login,
            color:'#fff',
            status:false
        }
        setSignup(newsignup);
        setLogin(newlogin);
        setOpenSignup(true);
    }
    const handleLogin = () =>{
        const newsignup = {...signup,
            color:'#fff',
            status:false
        }
        const newlogin = {
            ...login,
            color:'rgba(0,256,0,0.5)',
            status:true
        }
        setLogin(newlogin);
        setSignup(newsignup);
        setOpenLogin(true);
    }
    const handleProfile = () =>{
        setOpenSignup(false);
        setOpenLogin(false);
        setProfile(true);
    }
    return (
        <>
        <AppBar className ={classes.appbar}>
            <Toolbar>
                <Typography>BEST-READS</Typography>
                <Box className = {classes.component}>
                    {
                    account === null? 
                    <>
                         <Button className={classes.signup} onClick={handleSignup}>Signup</Button> 
                         <Button className={classes.login} onClick={handleLogin}>Login</Button>
                    </> : 
                    <>
                         <Button className={classes.signup} onClick={()=>{setBooks(true);setBookId({});setPage(0)}}>Books</Button> 
                         <Button className={classes.profile} onClick = {() =>setBooks(false)}> My Lists</Button>
                         <Button className={classes.login} onClick={handleProfile}>
                             <img src = {account.image} alt="profile" style={{height: '50px',borderRadius: '50%',right:'auto',width:'50px'}}/>
                         </Button>
                    </>
                    }
                </Box>
            </Toolbar>
        </AppBar>
        {signup.status ? <Signup signup={signup} setSignup={setSignup}/> : null};
        {login.status ? <Login login={login} setLogin={setLogin} /> : null};
        {profile ? <Profile/> : null};
        </>
    )
}

export default NavBar