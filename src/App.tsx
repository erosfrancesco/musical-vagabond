import SupabaseAuth from './components/SupabaseAuth';
import SupabaseTest from './components/SupabaseTest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App(): JSX.Element {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-marble flex flex-col items-center justify-center text-gray-900 text-[clamp(14px,2vmin,20px)] p-4">
                <header className="mb-6">
                    <SupabaseAuth />
                </header>
                <SupabaseTest />
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default App;
