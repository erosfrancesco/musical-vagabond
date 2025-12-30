import SupabaseTest from './components/SupabaseTest';

function App(): JSX.Element {
    return (
        <div className="min-h-screen bg-[#282c34] flex flex-col items-center justify-center text-white text-[clamp(14px,2vmin,20px)]">
            <header className="mb-6">
                <p className="text-center">
                    GitHub Codespaces <span className="text-red-500">♥️</span> React + TypeScript
                </p>
            </header>
            <SupabaseTest />
        </div>
    );
}

export default App;
