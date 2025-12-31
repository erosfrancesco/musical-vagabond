import SupabaseTest from '../components/SupabaseTest';
import SupabaseAuth from '../components/SupabaseAuth';

export default function Associazioni(): JSX.Element {
  return (
    <div className="min-h-screen bg-marble flex flex-col items-center justify-center text-gray-900 text-[clamp(14px,2vmin,20px)] p-4">
      <header className="mb-6 w-full max-w-3xl">
        <SupabaseAuth />
      </header>
      <SupabaseTest />
    </div>
  );
}
