import './App.css';

function App(): JSX.Element {
    return (
        <div className="App">
            <header className="App-header">
                <img src="Octocat.png" className="App-logo" alt="logo" />
                <p>
                    GitHub Codespaces <span className="heart">♥️</span> React + TypeScript
                </p>
                <p className="small">
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </p>
            </header>
        </div>
    );
}

export default App;
