import React, {useContext,useState} from 'react'
import SignupForm from './SignupForm';
import { AccountContext } from '../context/AccountProvider';
import {Dialog,makeStyles} from '@material-ui/core';


const useStyles = makeStyles({
    dialog:{
        overflow:'hidden'
    }
})
const Signup = ({signup,setSignup}) => {
    const {openSignup,setOpenSignup} = useContext(AccountContext);
    const classes = useStyles();
    const handleClose = () =>{
        setOpenSignup(false);
        const newsignup = {...signup,status:false,color:'#fff'};
        setSignup(newsignup);
    }
    // console.log(account);
    return (
        <Dialog
        open={openSignup}
        onClose={handleClose}
        className={classes.dialog}
      ><SignupForm/>
      </Dialog>
    )
}

export default Signup
