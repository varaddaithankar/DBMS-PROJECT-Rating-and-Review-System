import React, { useState ,useContext} from 'react'
import { AccountContext } from '../context/AccountProvider';
import {FunctionsContext} from '../context/FunctionsProvider';
import axios from 'axios'
import './style3.css';

const ProfileBox = () => {

    const {account,setAccount,setProfile,setOpenLogin,setOpenSignup} = useContext(AccountContext);
    const {setBooks,setPage,setBookId,setSearchBooks,setBookList2} = useContext(FunctionsContext);

    const [edit,setEdit] = useState(false);

    const [password,setpassword] = useState(account.password);
    const [firstName,setFirstName] = useState(account.f_name);
    const [lastName,setLastName] = useState(account.l_name);
    const [image,setImage] = useState(account.image);

    const handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        switch(name){
            case "password": setpassword(value);
            break;
            case "firstName": setFirstName(value);
            break;
            case "lastName": setLastName(value);
            break;
            default: break;
        }
    };

    const handleEdit = () =>{
      if(account.password == null){
        setEdit(true);
        return true;
      }
      let text = prompt("enter old password");
      if(text == null) return;
      if(text === account.password){
        setEdit(true);
        return true;
      }
      else{
        alert("wrong password!");
        return false;
      }
    }

      const handleSubmit = () =>{
      if(account.password == null && password != null && password.length > 0){
          alert("Cannot Add Password.\nYou have logged in using Google Authentication");
          return;
      }
      else if(account.password == null){
          const newInfo = {
          ...account,
            f_name : firstName,
            l_name : lastName,
            image
          }
          setAccount(newInfo);
          if(firstName === account.f_name && lastName === account.l_name && account.image === image){
            alert("No changes made");
            return;
          }
          // alert("Update successfull!");
          setEdit(false);
          return true;
      }




      if(password.length === 0 || firstName.length === 0){
          alert("First Name and Password must not be empty!");
          return;
      }
      if(firstName === account.f_name && lastName === account.l_name && password === account.password && account.image === image){
          alert("No changes made");
          return;
      }
      const newInfo = {
        ...account,
        f_name : firstName,
        l_name : lastName,
        password : password ,
        image
      }
      setAccount(newInfo);
      alert("Update successfull!");
      setEdit(false);
    }
    const  handleUpdate= async () =>{
        const user={
            f_name:firstName,
            l_name:lastName,
            e_mail:account.e_mail
        }
        console.log(user);
        await axios.post('http://localhost:3002/updateUserData',user)
        .then((res) =>{
            if(res.data === '') alert("Update not possible")
            else alert("Updated Successfully")
        })
        .catch((err) => console.log(err));
    }
    const handleLogout = () =>{
      setAccount(null);
      setProfile(false);
      setBookId({});
      setSearchBooks({});
      setPage(0);
      setBooks(true);
      setOpenSignup(false);
      setOpenLogin(false);
      setBookList2([]);
    }
    console.log(account);
    return (
      <div className="WrapperClass" style={{height:'auto',overflow:'hidden'}}>
        <div className = "form" style={{width:'90%'}} noValidate>
            <div className="firstName">
              <label htmlFor="firstName" style={{color:'#fff',paddingRight:'10px'}}>First Name</label>
                {<input
                type="text"
                name="firstName"
                onChange={handleChange}
                disabled = {edit ? "" : "disabled"}
                defaultValue={account.f_name}
                />}
              </div>
            <div className="lastName">
              <label htmlFor="lastName" style={{color:'#fff',paddingRight:'10px'}}>Last Name</label>
              <input
                type="text"
                name="lastName"
                onChange={handleChange}
                disabled = {edit ? "" : "disabled"}
                defaultValue={account.l_name}
              />
            </div>

            {
            edit ?
              <>

              <div className="submit" onClick={handleSubmit} style={{paddingUp:'10px'}}>
                <button style={{backgroundColor:'#22223B'}} onClick={handleUpdate}>Update</button>

              </div>
              </>
          :
              <div className="submit">
              <button onClick={handleEdit} style={{backgroundColor:'#22223B'}}>Edit Profile</button>
               </div>
          }
          <div className="submit">
        <button onClick = {handleLogout} style={{bottom:'auto',backgroundColor:'#22223B'}}>Logout</button>
          </div>
        </div>
      </div>
    // </div>
    )
}

export default ProfileBox
