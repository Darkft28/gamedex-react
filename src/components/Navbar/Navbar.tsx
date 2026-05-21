import { NavLink, Link } from 'react-router-dom';
import { Heart, Sun, Moon, Gamepad2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useFavorites } from '../hooks/useFavorites';
import { cn } from '@/lib/utils';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <Gamepad2 size={22} aria-hidden="true" />
        GameDex
      </Link>

      <div className={styles.links}>
        <NavLink
          to="/"
          end
          className={({ isActive }) => cn(styles.link, isActive && styles.active)}
        >
          Accueil
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) => cn(styles.link, isActive && styles.active)}
        >
          <Heart size={15} aria-hidden="true" />
          Favoris
          {favorites.length > 0 && (
            <span className={styles.badge} aria-label={`${favorites.length} favoris`}>
              {favorites.length}
            </span>
          )}
        </NavLink>
      </div>

      <button
        type="button"
        className={styles.themeToggle}
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </nav>
  );
}
