import React, { Component , useContext, useState} from "react";
import { AccountContext } from '../context/AccountProvider';
import "./style.css";
import { GoogleLogin } from "react-google-login";
import { clientId } from "../constants";
import axios from 'axios';

const LoginForm = () =>{

      const {setAccount,setOpenLogin,setOpenSignup} = useContext(AccountContext);

      const [email,setemail] = useState("");
      const [password,setpassword] = useState("");
      const [errors,seterrors] = useState({email: "",password: "",});

        const onLoginFailure = () => {
            console.log("failed");
        };
        const onLoginSuccess = async (res) => {
            console.log("success")
            try{
              await axios.post('http://localhost:3002/login',res.profileObj)
              .then((result) => {
                      // console.log(res);
                      if(result.data === '') alert("invalid login");
                      else{
                          console.log(result.data);
                          alert("Successfully logged in!");
                          let user = {
                            f_name : res.profileObj.givenName,
                            l_name : res.profileObj.familyName,
                            e_mail : res.profileObj.email,
                            image : res.profileObj.imageUrl,
                            // password:null
                          }
                          setAccount(user);
                          setOpenLogin(false);
                          setOpenSignup(false);
                      }
              })
              .catch((err) => console.log(err))
          }catch(e){
              console.log("error : ",e);
          }
        };

        const handleChange = (event) => {
            event.preventDefault();
            const { name, value } = event.target;
            switch(name){
                case "email": setemail(value);
                case "password": setpassword(value);
                default: break;
            }
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try{
                const user = {
                    "email" : email,
                    "password" : password,
                }
                await axios.post('http://localhost:3002/login',user)
                .then((res) => {
                        console.log(res);
                        if(res.data === '') alert("invalid login");
                        else{
                            console.log(res);
                            //setAccount(res);
                            alert("Successfully logged in!");
                            const user = {
                              f_name : res.data.f_name,
                              l_name : res.data.l_name,
                              e_mail : res.data.e_mail,
                              image : "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-7.jpg"
                            }
                            console.log(user);
                            setAccount(user);
                            setOpenLogin(false);
                            setOpenSignup(false);
                        }
                })
                .catch((err) => console.log(err))
            }catch(e){
                console.log("error : ",e);
            }

        };
    return (
      <div className="WrapperClass" style={{
        height:'auto',overflow:'hidden',
        }}>
        <div className="form-WrapperClass">
          <h2>Login To Account</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="email">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                // noValidate
              />
              {errors.email.length > 0 && (
                <span className="error">{errors.email}</span>
              )}
            </div>
            <div className="password">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                style={{width:'103%',marginBottom:'0'}}
                // noValidate
              />
              {errors.password.length > 0 && (
                <span className="error">{errors.password}</span>
              )}
            </div>
            <div className="submitButton" style={{width:'300px'}}>
              <button>Submit</button>
            </div>
            <div className="divider">OR</div>
            <GoogleLogin
              clientId={clientId}
              isSignedIn={false}
              buttonText="Login with Google"
              onSuccess={onLoginSuccess}
              onFailure={onLoginFailure}
              cookiePolicy={"single_host_origin"}
            />
          </form>
        </div>
      </div>
    );
}
export default LoginForm
