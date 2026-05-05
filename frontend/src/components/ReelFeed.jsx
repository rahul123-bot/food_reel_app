import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function ReelFeed({
  items = [],
  savedMap = {},
  onLike = () => {},
  onSave = () => {},
  onComment = () => {},
  getVisitStoreTo = (item) => `/food-partner/${item.foodPartner}`,
  visitStoreLabel = '[ Visit Store ]',
  emptyState = null,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector('video');
          if (!video) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { root: container, threshold: [0.5] }
    );

    Array.from(container.querySelectorAll('.reel')).forEach((item) => {
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items.length) {
    return emptyState;
  }

  return (
    <div className="reels-container" ref={containerRef}>
      {items.map((item) => (
        <section className="reel" key={item._id}>
          <video
            className="reel-video"
            src={item.video}
            muted
            playsInline
            loop
            preload="metadata"
          />

          <div className="reel-content">
            <div className="overlay">
              <p className="description">{item.description}</p>
              <Link className="visit-btn" to={getVisitStoreTo(item)}>
                {visitStoreLabel}
              </Link>
            </div>

            <aside className="reel-actions" aria-label="Reel actions">
              <button
                type="button"
                className="reel-action reel-action--active"
                aria-label="Like"
                onClick={() => onLike(item)}
              >
                <span className="reel-action__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M20.8 4.6c-1.5-1.7-4.1-1.8-5.9-.3L12 6.8 9.1 4.3c-1.8-1.5-4.4-1.4-5.9.3-1.7 1.8-1.6 4.6.1 6.4l8.7 8 8.7-8c1.7-1.8 1.8-4.6.1-6.6z" />
                  </svg>
                </span>
                <span className="reel-action__count">{item.likeCount ?? item.like ?? 0}</span>
              </button>

              <button
                type="button"
                className={`reel-action${savedMap[item._id] ? ' reel-action--active' : ''}`}
                aria-label="Save"
                onClick={() => onSave(item)}
              >
                <span className="reel-action__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M7 3h10a1 1 0 0 1 1 1v17l-6-3.5L6 21V4a1 1 0 0 1 1-1z" />
                  </svg>
                </span>
                <span className="reel-action__count">
                  {item.saveCount ?? item.bookmark ?? item.save ?? 0}
                </span>
              </button>

              <button type="button" className="reel-action" aria-label="Comment" onClick={() => onComment(item)}>
                <div className="reel-action__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M21 11c0 4.4-4 8-9 8-1 0-2-.1-2.9-.3L4 20l1.4-3.7C4.5 15 3 13.1 3 11c0-4.4 4-8 9-8s9 3.6 9 8z" />
                  </svg>
                </div>
                <span className="reel-action__count">{item.commentCount ?? item.commentsCount ?? 0}</span>
              </button>
            </aside>
          </div>
        </section>
      ))}
    </div>
  );
}
