import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(){
    super();
    this.state = {
      catsRawData: [],
      comments: [],
      userInput: '',
      userEdits: '',
      clicked: false,
      updatedComment: ''
    }
  }
  //inital page setup
  componentDidMount(){
    axios.get("http://thecatapi.com/api/images/get?format=html&results_per_page=20").then(res => {
       let response = res.data.split('"').filter(elem => elem.includes('http')).filter(elem => !elem.includes('http://thecatapi'))
      this.setState({catsRawData: response})
    })
  }
  
  //comment section
   changeInput = (input) => {
     this.setState({
       userInput: input
     })
   }

   handleInput = (input) => {
     this.setState({
       updatedComment: input
     })
   }
   addComment = () => {
    axios.post('/api/comments', {text: this.state.userInput, clicked: false}).then(comment => {
       this.setState({
         comments: comment.data
       })
     })
   }
  removeComment = (id) => {
    axios.delete(`/api/comments/${id}`).then(comment => {
      this.setState({
        comments: comment.data
      })
    })
  }
  editComment = (id) => {
    let copy = this.state.comments.slice();
    let index = copy.findIndex(e => e.id === id)
    copy[index].clicked =true;
    this.setState({
      comments: copy
    })
  }
  changeUserEdits = (input) => {
    this.setState({
      userEdits: input
    })
  }
  saveCommentEdits = (id) => {
   axios.put(`/api/comments/${id}`, {text: this.state.updatedComment}).then(comment => {
      console.log(comment.data)
      this.setState({
        comments: comment.data
      })
    })
  }

  render() {
    let catPictures = this.state.catsRawData.map((pic, i) => {
      return <img key={i} src={pic} alt='cat-gifs'/>
    })
    let commentBoxes = this.state.comments.map((message,i) => {
      return (<div key={i}>{message.text} {message.clicked ? 
                                                    <div>
                                                        <button onClick={() => this.saveCommentEdits(message.id)}>Save</button>
                                                        <button className='removecomment' onClick={() => this.removeComment(message.id)}>Remove Comment</button>
                                                    </div> 
                                                    : <div>
                                                          <button className='editcomment' onClick={() => this.editComment(message.id)}>Edit</button>
                                                          <button className='removecomment' onClick={() => this.removeComment(message.id)}>Remove Comment</button>
                                                    </div>}
            {message.clicked && <input label="Saved Comments" className='commentbox' onChange={(e) => this.handleInput(e.target.value)}/>}
      </div>)
    })
    return (
      <div className="App">
        <div>
          <input className='inputcomment' onChange={(e) => this.changeInput(e.target.value)}/>
          <button className='addcomment' onClick={() => this.addComment()}>Add New Comment</button>
        </div>
        {commentBoxes}
        {catPictures}
      </div>
    );
  }
}

export default App;
