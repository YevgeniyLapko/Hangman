import React from 'react';
import ReactDOM from 'react-dom';
//import Test from './test.js';
import Hangman from './Hangman.js';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Hangman />, document.getElementById('root'));
registerServiceWorker();
