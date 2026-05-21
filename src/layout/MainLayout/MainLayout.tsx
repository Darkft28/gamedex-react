import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Navbar />
      </header>
      <main className={styles.main} id="main-content">
        <Outlet />
      </main>
    </div>
  );
}
