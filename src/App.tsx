import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Routes, Route, Link } from 'react-router-dom';
import RendicontoAssociazione from './pages/RendicontoAssociazione';
import Associazioni from './pages/Associazioni';
import useSupabaseUser from './hooks/useSupabaseUser';
import SupabaseAuth from './components/SupabaseAuth';

const queryClient = new QueryClient();


function App(): JSX.Element {
    const { isLogged } = useSupabaseUser();

    if (!isLogged) {
        return (
            <div className="min-h-screen bg-marble flex flex-col items-center justify-center text-gray-900 p-4">
                <h1 className="text-2xl font-semibold">Please log in to access the app.</h1>
                <SupabaseAuth />
            </div>
        );
    }

    // TODO: - Replace Home with icon
    return (
        <QueryClientProvider client={queryClient}>
            <nav className="p-4">
                <Link to="/" className="text-blue-600">Home</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Associazioni />} />
                <Route path=":associazioneCodiceFiscale" element={<RendicontoAssociazione />} />
            </Routes>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default App;
