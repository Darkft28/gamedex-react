import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { RawgScreenshot } from '../../types/rawg';
import styles from './ScreenshotGallery.module.css';

type Props = {
  screenshots: RawgScreenshot[];
  isLoading: boolean;
};

export default function ScreenshotGallery({ screenshots, isLoading }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + screenshots.length) % screenshots.length));
  }, [screenshots.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % screenshots.length));
  }, [screenshots.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, closeLightbox, prev, next]);

  if (isLoading) {
    return (
      <div className={styles.track}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={styles.skeleton} aria-hidden="true" />
        ))}
      </div>
    );
  }

  if (screenshots.length === 0) return null;

  return (
    <>
      <div className={styles.track} role="list" aria-label="Screenshots du jeu">
        {screenshots.map((shot, idx) => (
          <button
            key={shot.id}
            className={styles.thumb}
            onClick={() => setLightboxIndex(idx)}
            aria-label={`Voir screenshot ${idx + 1}`}
            role="listitem"
            type="button"
          >
            <img
              src={shot.image}
              alt={`Screenshot ${idx + 1}`}
              className={styles.thumbImg}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className={styles.overlay}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Lightbox screenshot"
        >
          <button
            className={styles.closeBtn}
            onClick={closeLightbox}
            aria-label="Fermer"
            type="button"
          >
            <X size={22} />
          </button>

          <button
            className={`${styles.navBtn} ${styles.navLeft}`}
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Screenshot précédent"
            type="button"
          >
            <ChevronLeft size={28} />
          </button>

          <img
            src={screenshots[lightboxIndex].image}
            alt={`Screenshot ${lightboxIndex + 1}`}
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className={`${styles.navBtn} ${styles.navRight}`}
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Screenshot suivant"
            type="button"
          >
            <ChevronRight size={28} />
          </button>

          <span className={styles.counter}>
            {lightboxIndex + 1} / {screenshots.length}
          </span>
        </div>
      )}
    </>
  );
}
