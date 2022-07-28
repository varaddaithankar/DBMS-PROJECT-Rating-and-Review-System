import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {FunctionsContext} from '../context/FunctionsProvider';

const useStyles = makeStyles({
  root: {
    width:250,
    height:350,
    positon:'absolute'
  },
  media: {
    height: 200,
  },
  author:{
    top:'auto',
    fontSize:'1.1em',
    //textSizeAdjust:'60%',
  },
  bookCardStyle:{
    fontSize:'1.1em',
    //textSizeAdjust:'60%',
  },
  cardContent:{
    margin:'auto',
  }
});

const BookCard = (props) =>{

  const classes = useStyles();
  const {id,author,name,cover,avg_rating} = props;
  const {setBookId,setBooks,books} = useContext(FunctionsContext);
  const book = {
      id,author,name,cover
  }
  return (
    <Card className={classes.root} onClick = {() => {
      console.log("book clicked is ",name);
      setBookId(book)
      if(!books) setBooks(true);
    }}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={cover}
          title={cover}
        />
        <CardContent className={classes.cardContent} >
          <Typography gutterBottom variant="h5" component="h2" className={classes.bookCardStyle}>
            {name}
          </Typography >
          <div style={{display:'flex',flexDirection:'row'}}>
              <Typography variant="body2" color="textSecondary" component="p" className={classes.author}>
                Author : {author}
              </Typography>
          </div>
          <Typography className={classes.bookCardStyle}>Avg. Rating : {avg_rating !== null ? avg_rating.toFixed(2) : "N/A"} 
              </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
export default BookCard;