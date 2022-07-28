import React, {useContext} from 'react'
import { AccountContext } from '../context/AccountProvider';
import {Dialog} from '@material-ui/core';
import LoginForm from './LoginForm';

const Login = ({login,setLogin}) => {
    const {openLogin,setOpenLogin} = useContext(AccountContext);
    const handleClose = () =>{
        setOpenLogin(false)
        const newlogin = {...login,status:false,color:'#fff'}
        setLogin(newlogin)
    }
    return (
        <>
      <Dialog
        open={openLogin}
        onClose={handleClose}
        style={{overflow:'hidden'}}
      > <LoginForm/>
      </Dialog>
        </>
    )
}

export default Login