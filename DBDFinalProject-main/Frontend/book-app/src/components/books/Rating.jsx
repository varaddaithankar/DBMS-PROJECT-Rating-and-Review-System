import React from 'react'

const Rating = (props) => {

    const {image,user,rating,review} = props;

    console.log(props);

    return (
        <div className="container" style={{display:'flex',flexDirection:'row'}}>
            {/* <div style={{width:'30%'}}> 
                <img src={image} alt="display"/>
                <p>{user}</p>
            </div>
            <div>
                <b>{rating}</b>
                <p>{review}</p>
            </div> */}
            Hello
        </div>
    )
}

export default Rating
