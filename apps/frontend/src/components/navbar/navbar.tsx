import { component$, useContext, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { LuAlertTriangle } from '@qwikest/icons/lucide';
import { GlobalStore } from '../../context';
import { useGetCurrentUser } from '../../routes/layout';
import { BurgerButton } from '../dashboard/navbar/burger-button/burger-button';
import { DARK_THEME, LIGHT_THEME, ThemeSwitcher, setPreference } from '../theme-switcher/theme-switcher';
import { Resources } from '../dashboard/navbar/resources/resources';

export const Navbar = component$(() => {
  const globalStore = useContext(GlobalStore);
  const user = useGetCurrentUser();
  const showDropdown = useSignal(false);

  return (
    <div class="navbar bg-base-100 drop-shadow-md fixed z-[40]">
      <div class="flex-1">
        <Link href="/" class="btn btn-ghost normal-case text-xl">
          Reduced.to
        </Link>
      </div>
      <div
        class="block sm:hidden dropdown dropdown-end"
        onFocusout$={({ target }, currentTarget) => {
          if (target instanceof HTMLElement && currentTarget.contains(target as Node)) {
            return;
          }

          showDropdown.value = false;
        }}
        onClick$={() => (showDropdown.value = !showDropdown.value)}
      >
        <BurgerButton buttonTitle="Open" />
        {showDropdown.value && (
          <ul tabIndex={0} class="menu dropdown-content shadow bg-base-100 rounded-box w-52 mt-4 p-2">
            <li>
              <a href="https://github.com/origranot/reduced.to" target="_blank" title="GitHub" class="btn-ghost">
                Github
              </a>
            </li>
            <li>
              <a href="https://docs.reduced.to" target="_blank" title="Documentation" class="btn-ghost">
                Docs
              </a>
            </li>
            <li>
              <Link href="/report" class="btn-ghost py-2 text-sm justify-between">
                Report a Link
                <span class="badge badge-warning gap-2">
                  <LuAlertTriangle />
                </span>
              </Link>
            </li>
            <li>
              <a
                class="btn-ghost"
                onClick$={() => {
                  globalStore.theme = globalStore.theme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
                  setPreference(globalStore.theme);
                }}
              >
                {globalStore.theme === LIGHT_THEME ? 'Dark' : 'Light'} theme
              </a>
            </li>
            <li>
              {user.value ? (
                <Link href="/dashboard" class="btn-ghost py-2 text-sm justify-between">
                  Dashboard
                  <span class="badge badge-primary">New</span>
                </Link>
              ) : (
                <Link href="/login" class="btn-ghost">
                  Login
                </Link>
              )}
            </li>
          </ul>
        )}
      </div>
      <div class="sm:flex hidden">
        {user.value ? (
          <Link href="/dashboard" class="btn btn-primary btn-sm">
            Dashboard
          </Link>
        ) : (
          <Link href="/login" class="btn btn-primary btn-sm">
            Login
          </Link>
        )}
        <div class="divider divider-horizontal"></div>
        <Resources />
        <div class="divider divider-horizontal"></div>
        <div class="grid flex-grow place-items-center mr-4">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
});
