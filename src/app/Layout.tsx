import { NavLink, Outlet, ScrollRestoration } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApplyTheme } from '@/features/theme-switcher';
import { cn } from '@/shared/lib/cn';
import { NAV_ITEMS, SIDEBAR_ITEMS } from './navigation';

const Logo = () => (
  <div className="flex items-center gap-2 px-3">
    <img src="/favicon.svg" alt="" className="size-9" />
    <span className="text-xl font-extrabold">NovaBank</span>
  </div>
);

const Sidebar = () => {
  const { t } = useTranslation();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 border-r border-line bg-surface py-6 pr-3 pl-3 lg:flex">
      <Logo />
      <nav className="flex flex-1 flex-col gap-1">
        {SIDEBAR_ITEMS.map(({ to, labelKey, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-full px-4 py-3 font-semibold transition-colors',
                isActive
                  ? 'bg-brand-gradient text-white shadow-lg shadow-brand-500/25'
                  : 'text-muted hover:bg-surface-muted hover:text-fg',
              )
            }
          >
            <Icon className="size-5" />
            {t(labelKey)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

const BottomNav = () => {
  const { t } = useTranslation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {NAV_ITEMS.map(({ to, labelKey, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 py-2 text-[11px] font-semibold transition-colors',
                isActive ? 'text-brand-strong' : 'text-subtle hover:text-fg-soft',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'grid h-8 w-12 place-items-center rounded-full transition-colors',
                    isActive && 'bg-brand-gradient text-white shadow-md shadow-brand-500/30',
                  )}
                >
                  <Icon className="size-5" />
                </span>
                {t(labelKey)}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export const Layout = () => {
  useApplyTheme();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 pt-5 pb-28 lg:max-w-2xl lg:pb-10">
        <Outlet />
      </main>
      <BottomNav />
      <ScrollRestoration />
    </div>
  );
};
