import logo from './logo.svg';
import './App.css';

function Header() {
  return (
    <header className='App-header'>
      <div className='header'>
        <img src={logo} className="App-logo" alt="logo" />
        Todo List
      </div>
    </header>
  );
}

function Footer() {
  return(
    <footer className='App-footer'>
      <button>task</button>
      <button>folder</button>
    </footer>
  )
}

function App() {
  return (
    <div className="App">
      <Header />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <div>banger</div>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
      <Footer />
    </div>
  );
}

export default App;
