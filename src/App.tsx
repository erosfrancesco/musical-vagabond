import SupabaseAuth from './components/SupabaseAuth';
import SupabaseTest from './components/SupabaseTest';

function App(): JSX.Element {
    return (
        <div className="min-h-screen bg-marble flex flex-col items-center justify-center text-gray-900 text-[clamp(14px,2vmin,20px)] p-4">
            <header className="mb-6">
                <SupabaseAuth />
            </header>
            <SupabaseTest />
        </div>
    );
}

export default App;
