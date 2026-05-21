import { Heart } from 'lucide-react';
import { useFavorites } from '../../components/hooks/useFavorites';
import GameCard from '../../components/GameCard/GameCard';
import { Card, CardContent } from '@/components/ui/card';
import styles from './Favorites.module.css';

export default function Favorites() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className={styles.page}>
        <Card className={styles.emptyCard}>
          <CardContent className={styles.emptyContent}>
            <Heart size={48} className={styles.emptyIcon} aria-hidden="true" />
            <p className={styles.emptyTitle}>Aucun favori pour l'instant</p>
            <p className={styles.emptySubtitle}>
              Ajoute des jeux à tes favoris depuis la page d'accueil.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Mes favoris ({favorites.length})</h1>
      <div className={styles.grid}>
        {favorites.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
