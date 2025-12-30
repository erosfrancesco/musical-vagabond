import SupabaseTest from './components/SupabaseTest';

function App(): JSX.Element {
    return (
        <div className="min-h-screen bg-marble flex flex-col items-center justify-center text-gray-900 text-[clamp(14px,2vmin,20px)]">
            <header className="mb-6">
                <p className="text-center">
                    GitHub Codespaces <span className="text-warning">♥️</span> React + TypeScript
                </p>
            </header>
            <SupabaseTest />
        </div>
    );
}

export default App;
