import './App.css';
import SupabaseTest from './components/SupabaseTest';

function App(): JSX.Element {
    return (
        <div className="App">
            <header className="App-header">
                <p>
                    GitHub Codespaces <span className="heart">♥️</span> React + TypeScript
                </p>
            </header>
            <SupabaseTest />
        </div>
    );
}

export default App;
