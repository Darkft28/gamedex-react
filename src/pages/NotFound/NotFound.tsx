import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <main className={styles.page} aria-labelledby="error-title">
      <h1 className={styles.title} id="error-title">404</h1>
      <p className={styles.subtitle}>Cette page n'existe pas.</p>
      <Link to="/" className={styles.link}>
        Retour à l'accueil
      </Link>
    </main>
  );
}
