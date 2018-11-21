import React, { Component } from 'react';
import Toolbar from './components/Toolbar/Toolbar.js';
import Keyboard from './components/Keyboard/Keyboard.js';
import HiddenWord from './components/HiddenWord/hiddenWord.js';
import words from './data/words.json';
import './App.css';

class App extends Component {

  constructor(props) {
   super(props);
   this.checkLetter = this.checkLetter.bind(this);
   this.handleName = this.handleName.bind(this);
   this.handlePassword = this.handlePassword.bind(this);
   this.handleSubmit = this.handleSubmit.bind(this);
   this.userLogin = this.userLogin.bind(this);
   this.userLogout = this.userLogout.bind(this);
   this.restartGame = this.restartGame.bind(this);
   // Assign state itself, and a default value for items
   this.state = {
     accounts: [],
     games: 0,
     authenticated: false,
     name: '',
     password: '',
     word: "",
     guesses: [],
     lost: false,
     won: false,
     strikes: 0,
     category: ""
   };
 };


  newGame() {
    let authenticated = false;
    let games = 0;
    let name = '';
    let password = '';
    let category = this.setCategory();
    let word = this.setWord(category);
    let guesses= [];
    let lost = false;
    let won = false;
    let strikes = 0;
    this.setState({word, guesses, lost, won, strikes, category, games, name, password, authenticated});
  };

  restartGame() {
    let authenticated = true;
    let games = this.state.games;
    let name = this.state.name;
    let password = this.state.password;
    let category = this.setCategory();
    let word = this.setWord(category);
    let guesses= [];
    let lost = false;
    let won = false;
    let strikes = 0;
    this.setState({word, guesses, lost, won, strikes, category, games, name, password, authenticated});
  }

  setWord(category){
    let number = Math.floor((Math.random() * 9));
    let guessWord = '';
    if (category === "sports"){
      guessWord = words.Sports[number];
    }
    else if (category === "countries"){
      guessWord = words.Countries[number];
    }
    else if (category === "animals"){
      guessWord = words.Animals[number];
    }
    return guessWord;
  };

  setCategory(){
    let number = Math.floor((Math.random() * 3) + 1);
    let category = "";
    if (number === 1){
      category = "sports";
    }
    else if (number === 2){
      category = "countries";
    }
    else if (number === 3){
      category = "animals";
    }
    return category;
  };

  getStatus(){
    if(this.state.won === true)
    {
      return 'YOU WIN!';
    }
    else if(this.state.lost === true)
    {
      return 'YOU LOSE!';
    }
    else {
      return 'HANGMAN';
    }
  };

  hasWon() {
    let {word, guesses, strikes} = this.state;
    let wordArray = word.split('');
    let won = false;
    let counter = 0;
    let uniqueArray = wordArray.filter(function(item, index){
        return wordArray.indexOf(item) >= index;
      });

    if(strikes < 6)
    {
      for(let i = 0; i < uniqueArray.length; i++)
      {
        if(guesses.includes(uniqueArray[i]))
        {
          counter++;
        }
      }
      if(counter === (uniqueArray.length - 1))
      {
        won = true;
      }
    }
    return won;
  };

  checkLetter(letter) {
    let {accounts, password, name, word, strikes, guesses, lost, won, games} = this.state;

    if(word.includes(letter)){

    }
    else {
      strikes++;
    }

    won = this.hasWon();

    if(won === true){
      games++;
      for (let i = 0; i < accounts.length; i++)
      {
        let temp = accounts[i];
        if(temp.name === name){
          if(temp.password === password){
              temp.games++;
          }
        }
      }
    }

    guesses.push(letter);

    if (strikes >= 6 && !won) {
      games++;
      for (let i = 0; i < accounts.length; i++)
      {
        let temp = accounts[i];
        if(temp.name === name){
          if(temp.password === password){
              temp.games++;
          }
        }
      }
      strikes = 6;
      lost = true;
    }
    this.setState({strikes, guesses, lost, won, games});
  };

  displayImage(){
    if(this.state.won) {
      return (
        <div className='picture'>
          <div className="hangman-picture-won"/>
        </div>
      )
    }
    else {
      let strikes = this.state.strikes;
      let string = 'hangman-picture-';
      let concat = string.concat(strikes);

      return (
        <div className='picture'>
          <div className={concat}/>
        </div>
      )
    }
  };

  handleName(event) {
    this.setState({name: event.target.value});
  };

  handlePassword(event) {
    this.setState({password: event.target.value});
  };

  handleSubmit(event) {
    let accounts = this.state.accounts;
    accounts.push({
      name: this.state.name,
      password: this.state.password,
      games: 0
    });
    this.setState({accounts})
    event.preventDefault();
  };

  userLogin(){
    let {accounts, password, name, authenticated, games} = this.state;
    for (let i = 0; i < accounts.length; i++)
    {
      let temp = accounts[i];
      if(temp.name === name){
        if(temp.password === password){
          authenticated = true;
          games = temp.games
          this.setState({authenticated, games});
        }
        else {
          console.log('Wrong password!');
        }
      }
      else {
        console.log('Not existing name!');
      }
    }
};

userLogout(){
  this.newGame();
};


  render() {
    if(this.state.authenticated)
    {
      return (
        <div className="wrapper">
          <header>
        		<h1 className="game-heading">Hangman</h1>
        	</header>
          <section className="columns">
            <div className="column rules">
              <div className="row">
                <h2>Rules</h2>
              </div>
              <div className="row">
                <p>1) Player needs to guess the word before losing all lives.</p>
              </div>
              <div className="row">
                <p>2) 6 lives.</p>
              </div>
              <div className="row">
                <p>3) IMPORTANT! Do not hang the man!</p>
              </div>
            </div>
          	<div className="column">
              <div className="row">
                <Keyboard
                    onPress={this.checkLetter}
                    lost={this.state.lost}
                    checkStatus={!this.state.lost && !this.state.won}
                    usedLetters={this.state.guesses} />
              </div>
              {this.displayImage()}
              <HiddenWord
                  word={this.state.word}
                  lost={this.state.lost}
                  guesses={this.state.guesses}/>
          	</div>
            <div className="column player">
                <div className="row">
                  <p>Player name: {this.state.name}</p>
                </div>
                <div className="row">
                  <p>Games won: {this.state.games}</p>
                </div>
                <div className="row">
                  <p>Category: {this.state.category}</p>
                </div>
                <div className="row">
                  <button onClick={this.restartGame}>New Game</button>
                </div>
                <div className="row">
                  <button onClick={this.userLogout}>Logout</button>
                </div>
          	</div>
          </section>
		</div>

      );
    }
    else
      {
        return (
            <div className="container-fluid">
              <div className="screen-bg">
                <div className="heading-box">
                  <h1>Hangman</h1>
                </div>
                <div className="login-box">
                    <form onSubmit={this.handleSubmit}>
                      <div className="row">
                          <input type="text" placeholder="name" onChange={this.handleName} />
                      </div>
                      <div className="row">
                        <input type="password" placeholder="Password" onChange={this.handlePassword} />
                      </div>
                      <div className="row">
                        <input type="submit" value="Register" />
                      </div>
                    </form>
                    <div className="row">
                      <button onClick={this.userLogin}>Login</button>
                    </div>
                </div>
              </div>
           </div>
         );
      }

    }


}

export default App;
