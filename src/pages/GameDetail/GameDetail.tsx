import { useParams, Link } from 'react-router-dom';
import { Heart, ArrowLeft, Star } from 'lucide-react';
import { useGameDetail, useGameTrailers, useGameAchievements, useGameScreenshots, useGameSeries } from '../../components/hooks/useGameDetail';
import { useFavorites, useToggleFavorite } from '../../components/hooks/useFavorites';
import { formatRating } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import ScreenshotGallery from '../../components/ScreenshotGallery/ScreenshotGallery';
import GameSeries from '../../components/GameSeries/GameSeries';
import styles from './GameDetail.module.css';

function GameDetailSkeleton() {
  return (
    <div className={styles.page}>
      <Skeleton className={styles.heroSkeleton} />
      <div className={styles.badges}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className={styles.badgeSkeleton} />
        ))}
      </div>
      <Skeleton className={styles.metaSkeleton} />
      <Skeleton className={styles.descSkeleton} />
    </div>
  );
}

export default function GameDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: game, isLoading, isError } = useGameDetail(id);
  const { data: trailersData } = useGameTrailers(id);
  const { data: achievementsData } = useGameAchievements(id);
  const { data: screenshotsData, isLoading: screenshotsLoading } = useGameScreenshots(id);
  const { data: seriesData, isLoading: seriesLoading } = useGameSeries(id);
  const { isFavorite } = useFavorites();
  // Appelé avant les early returns pour respecter les règles des hooks
  const toggleFavorite = useToggleFavorite(game ?? null);

  if (isLoading) return <GameDetailSkeleton />;

  if (isError || !game) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>
          {!id ? 'Identifiant de jeu manquant.' : 'Impossible de charger ce jeu.'}
        </p>
      </div>
    );
  }

  const fav = isFavorite(game.id);
  const trailer = trailersData?.results[0];
  const achievements = achievementsData?.results ?? [];
  const screenshots = screenshotsData?.results ?? [];
  const seriesGames = seriesData?.results ?? [];

  return (
    <div className={styles.page}>
      <Button asChild variant="ghost" size="sm" className={styles.backBtn}>
        <Link to="/">
          <ArrowLeft size={16} />
          Retour
        </Link>
      </Button>

      <div className={styles.hero}>
        {game.background_image && (
          <img
            src={game.background_image}
            alt={game.name}
            className={styles.heroImage}
          />
        )}
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>{game.name}</h1>
          <div className={styles.heroActions}>
            <span className={styles.rating}>
              <Star size={16} fill="currentColor" aria-hidden="true" />
              {formatRating(game.rating)}
            </span>
            {game.metacritic != null && (
              <Badge variant="outline" className={styles.metacritic}>
                Metacritic : {game.metacritic}
              </Badge>
            )}
            <Button
              variant={fav ? 'default' : 'outline'}
              size="sm"
              onClick={toggleFavorite}
              aria-pressed={fav}
            >
              <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
              {fav ? 'Favori' : 'Ajouter aux favoris'}
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.badges}>
        {game.platforms?.map(({ platform }) => (
          <Badge key={platform.id} variant="secondary">
            {platform.name}
          </Badge>
        ))}
        {game.genres?.map((genre) => (
          <Badge key={genre.id} variant="outline">
            {genre.name}
          </Badge>
        ))}
      </div>

      <div className={styles.metaRow}>
        {game.released && (
          <span>
            Sortie : {new Date(game.released).toLocaleDateString('fr-FR')}
          </span>
        )}
        {game.publishers && game.publishers.length > 0 && (
          <span>
            Éditeur :{' '}
            {game.publishers.map((pub, i) => (
              <span key={pub.id}>
                {i > 0 && ', '}
                <Link to={`/publisher/${pub.id}`} className={styles.pubLink}>
                  {pub.name}
                </Link>
              </span>
            ))}
          </span>
        )}
        {game.developers && game.developers.length > 0 && (
          <span>
            Développeur : {game.developers.map((d) => d.name).join(', ')}
          </span>
        )}
      </div>

      {(screenshotsLoading || screenshots.length > 0) && (
        <>
          <Separator className={styles.sep} />
          <h2 className={styles.sectionTitle}>Screenshots</h2>
          <ScreenshotGallery screenshots={screenshots} isLoading={screenshotsLoading} />
        </>
      )}

      <Separator className={styles.sep} />

      <Tabs defaultValue="description" className={styles.tabs}>
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="achievements">
            Achievements{achievements.length > 0 ? ` (${achievements.length})` : ''}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description">
          <p className={styles.description}>
            {game.description_raw || 'Aucune description disponible.'}
          </p>
        </TabsContent>

        <TabsContent value="achievements">
          {achievements.length === 0 ? (
            <p className={styles.empty}>Aucun achievement disponible.</p>
          ) : (
            <ScrollArea className={styles.scrollArea}>
              {achievements.map((a) => (
                <div key={a.id} className={styles.achievement}>
                  {a.image && (
                    <img
                      src={a.image}
                      alt={a.name}
                      className={styles.achievementImg}
                    />
                  )}
                  <div className={styles.achievementBody}>
                    <p className={styles.achievementName}>{a.name}</p>
                    <p className={styles.achievementDesc}>{a.description}</p>
                    <p className={styles.achievementPercent}>
                      {a.percent}% des joueurs
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>

      {trailer && (
        <>
          <Separator className={styles.sep} />
          <h2 className={styles.sectionTitle}>Trailer</h2>
          <video
            src={trailer.data.max}
            poster={trailer.preview}
            controls
            className={styles.trailer}
            aria-label={`Trailer : ${trailer.name ?? 'du jeu'}`}
          />
        </>
      )}

      {(seriesLoading || seriesGames.length > 0) && (
        <>
          <Separator className={styles.sep} />
          <h2 className={styles.sectionTitle}>Série</h2>
          <GameSeries games={seriesGames} isLoading={seriesLoading} currentId={id} />
        </>
      )}
    </div>
  );
}
