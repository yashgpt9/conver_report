import AuditFormClient from './AuditFormClient';
import SignOutButton from '@/components/SignOutButton';
import { getSession } from '@/lib/auth';

export default async function AuditPage() {
  const session = await getSession();
  const userName = session?.user?.name || 'Auditor';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-lg">
                S
              </div>
              <span className="font-bold text-xl tracking-tight">Audit Portal</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="text-slate-400">Welcome, {userName}</span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">5S Audit Form</h1>
          <p className="mt-2 text-slate-600">Complete the assessment and submit your findings.</p>
        </div>
        <AuditFormClient auditorName={userName} />
      </main>
    </div>
  );
}
