import { Button, createStyles, Input, makeStyles, Modal } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import './App.css';
import { db, auth } from './firebase';
import ImageUpload from './ImageUpload';
import Post from './Post';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //... user has logged in
        setUser(authUser)
      } else {
        //...user has logged out
        setUser(null);
      }
    })
    return () => {
      // perfrom some cleanup actions
      unsubscribe();
    }
  },[user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    });
  },[]);

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }
  return (
    <div className="app">
      <Modal
          open={open}
          onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form class="app__signup">
            <center>
              <img 
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
                alt="" 
                className="app_headerImage"
              />
            </center>
            <Input 
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value) }
            />
            <Input 
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value) }
            />
            <Input 
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signUp}>Sign up</Button>
          </form>
        </div>
      </Modal>

      <Modal
          open={openSignIn}
          onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form class="app__signup">
            <center>
              <img 
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
                alt="" 
                className="app_headerImage"
              />
            </center>
            <Input 
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value) }
            />
            <Input 
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img 
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
            alt="" 
            className="app_headerImage"
        />
      {
        user? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ):(
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign up</Button>
          </div>
        )
      }
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post}) => (
              <Post user={user} key={id} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        <div className="app__postsRight">
      
        </div>
      </div>

      <div className="app__upload">
        {
          user?.displayName ?(
            <ImageUpload username={user.displayName} />
          ):(
            <h3 className="app__uploadLogout">Login to upload</h3>
          )
        }
      </div>
        
    </div>
  );
}

export default App;
