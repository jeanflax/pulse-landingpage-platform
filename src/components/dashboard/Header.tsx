'use client';

import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/clients': 'Clients',
  '/dashboard/clients/new': 'New Client',
  '/dashboard/projects': 'Projects',
  '/dashboard/templates': 'Templates',
  '/dashboard/ai': 'AI Generate',
};

export default function Header() {
  const pathname = usePathname();

  // Get page title, with fallback for dynamic routes
  let title = pageTitles[pathname];
  if (!title) {
    if (pathname.startsWith('/dashboard/clients/')) {
      title = 'Client Details';
    } else if (pathname.startsWith('/dashboard/projects/')) {
      title = 'Project Editor';
    } else if (pathname.startsWith('/dashboard/templates/')) {
      title = 'Template Preview';
    } else {
      title = 'Dashboard';
    }
  }

  return (
    <header className="h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-8">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
          />
        </div>

        {/* Quick actions */}
        <button className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </div>
    </header>
  );
}
