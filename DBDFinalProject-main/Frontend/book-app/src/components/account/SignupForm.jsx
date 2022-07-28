import React, { Component } from "react";
import "./style.css";
import { GoogleLogin } from "react-google-login";
import { clientId } from "../constants";
import axios from 'axios';

export const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const onLoginFailure = () => {
  console.log("failed");
};
const onLoginSuccess = async (res) => {
  console.log("Login successfull", res.profileObj);
    try{
        const user = {
            "firstName": res.profileObj.givenName,
            "lastName" : res.profileObj.familyName,
            "email" : res.profileObj.email,
            "password" : null,
            "image":res.profileObj.imageUrl,
        }
        console.log(user.password,typeof(user.password));
        await axios.post('http://localhost:3002/signup',user)
        .then((res) => alert(res.data))
        .catch((err) => console.log(err))
    }catch(e){
        console.log("error : ",e);
    }
};

export default class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: null,
      errors: {
        email: "",
        password: "",
        firstName:""
      },
    };
  }

  handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case "firstName":
          errors.firstName = value == "" ? "first name required" : "";
          break;
      case "password":
            errors.password = value == "" ? "password required" : "";
            break;
      case "email":
        errors.email = validEmailRegex.test(value) ? "" : "Email is not valid!";
        break;
      default:
        break;
    }
    this.setState({ errors, [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    let s = "";
    let i = 0;
    const errors = this.state.errors;
    if(this.state.firstName == "") errors.firstName = "first name required";
    if(this.state.password == "") errors.password = "password required";
    if(!validEmailRegex.test(this.state.email)) errors.email = "Email is not valid!";
    this.setState({ errors});
    Object.entries(errors).forEach(([key,val]) =>{
        if(val.length != 0) s = s + (++i) + ". " + key + "\n";
    })
    if (s === "") {
            try{
                const user = {
                    "firstName": this.state.firstName,
                    "lastName" : this.state.lastName,
                    "email" : this.state.email,
                    "password" : this.state.password === "" ? null : this.state.password,
                    "image": 'http://shift.tools/assets/icons/general-user-b0d8abffed32297721ea9c0e12b96cbc08da894ce401d233f9c955a25edbc3c4.png',
                }
                await axios.post('http://localhost:3002/signup',user)
                .then((res) => alert(res.data))
                .catch((err) => console.log(err))
            }catch(e){
                console.log("error : ",e);
            }
     } else {
      console.log(`Invalid Form\nfollowing are required:\n${s}`);
      return false;
    }
  };

  render() {
    const { errors } = this.state;
    return (
      <div className="wrapper" style={{height:'auto',overflow:'hidden'}}>
        <div className="form-wrapper">
          <h2>Create Account</h2>
          <form onSubmit={this.handleSubmit} noValidate>
            <div className="fullName">
              <div className="firstName">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  onChange={this.handleChange}
                  style={{width:'100%'}}
                  noValidate
                  placeholder={this.state.firstName}
                />
                {errors.firstName.length > 0 && (
                <span className="error">{errors.firstName}</span>
              )}
              </div>
              <div className="lastName">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  onChange={this.handleChange}
                  style={{width:'100%'}}
                  noValidate
                  placeholder={this.state.lastName}
                />
              </div>
            </div>
            <div className="email">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                onChange={this.handleChange}
                noValidate
                style={{width:'90%'}}
                placeholder={this.state.email}
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
                onChange={this.handleChange}
                noValidate
                style={{width:'100%'}}
                placeholder={this.state.password}
              />
              {errors.password.length > 0 && (
                <span className="error">{errors.password}</span>
              )}
            </div>
            <div style={{display:'flex',flexDirection:'column'}}>
              <div className="submitButton" style={{width:'310px'}}>
                <button>Create</button>
              </div>
              <div className="divider">OR</div>
            </div>
            <GoogleLogin
              clientId={clientId}
              isSignedIn={false}
              buttonText="Sign up with Google"
              onSuccess={onLoginSuccess}
              onFailure={onLoginFailure}
              cookiePolicy={"single_host_origin"}
            />
          </form>
        </div>
      </div>
    );
  }
}
