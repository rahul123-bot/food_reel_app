import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import IconButton from '../../components/IconButton';
import '../../styles/reel.css';

export default function Saved() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    axios
      .get('https://food-reel-app-2.onrender.com/api/food/save', { withCredentials: true })
      .then((response) => {
        if (!isMounted) return;

        const saveFoods = (response.data.saveFoods || []).map((item) => ({
          _id: item.food?._id,
          name: item.food?.name,
          video: item.food?.video,
          description: item.food?.description,
          likeCount: item.food?.likeCount,
          saveCount: item.food?.saveCount,
          commentCount: item.food?.commentCount ?? item.food?.commentsCount,
          foodPartner: item.food?.foodPartner,
        }));

        setVideos(saveFoods.filter((item) => item._id));
      })
      .catch((error) => {
        if (!isMounted) return;

        const status = error.response?.status;
        if (status === 401) {
          navigate('/user/login', { replace: true });
          return;
        }

        if (status === 404) {
          setVideos([]);
          setLoadError('You have not saved any food items yet.');
          return;
        }

        setLoadError(error.response?.data?.message || 'failed to load saved food items');
        console.error('failed to load saved food items', error);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const likeVideos = async (item) => {
    try {
      const res = await axios.post(
        'https://food-reel-app-2.onrender.com/api/food/like',
        { foodId: item._id },
        { withCredentials: true }
      );

      if (res.data.like) {
        setVideos((prev) =>
          prev.map((v) => (v._id === item._id ? { ...v, likeCount: (v.likeCount ?? 0) + 1 } : v))
        );
      } else {
        setVideos((prev) =>
          prev.map((v) => (v._id === item._id ? { ...v, likeCount: Math.max(0, (v.likeCount ?? 0) - 1) } : v))
        );
      }
    } catch (error) {
      console.error('failed to like saved video', error.response?.data || error.message);
    }
  };

  const removeSaved = async (item) => {
    try {
      const response = await axios.post(
        'https://food-reel-app-2.onrender.com/api/food/save',
        { foodId: item._id },
        { withCredentials: true }
      );

      if (response.data.save) {
        setVideos((prev) =>
          prev.map((v) => (v._id === item._id ? { ...v, saveCount: (v.saveCount ?? 0) + 1 } : v))
        );
        return;
      }

      setVideos((prev) => prev.filter((v) => v._id !== item._id));
    } catch (error) {
      console.error('failed to update saved video', error.response?.data || error.message);
    }
  };

  const emptyState = (
    <div className="saved-list">
      <div
        className="saved-card"
        style={{
          minHeight: '280px',
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          padding: '24px',
        }}
      >
        <div>
          <h2 style={{ margin: '0 0 8px' }}>{loadError || 'No saved food items yet.'}</h2>
          <p style={{ margin: '0 0 16px', color: 'rgba(255,255,255,0.72)' }}>
            Save items from Home to find them here later.
          </p>
          <Link className="visit-btn" to="/home">
            Browse Home
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="saved-shell">
        <main className="saved-feed">
          <header className="saved-header">
            <span className="saved-header__eyebrow">Saved</span>
            <h1>Your saved food</h1>
            <p>Quick access to every dish you bookmarked for later.</p>
          </header>

          {loading ? (
            <div className="saved-list">
              <div
                className="saved-card"
                style={{
                  minHeight: '280px',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'rgba(255,255,255,0.75)',
                }}
              >
                Loading saved food items...
              </div>
            </div>
          ) : videos.length ? (
            <div className="saved-list">
              {videos.map((item) => (
                <article className="saved-card" key={item._id}>
                  <video
                    className="saved-card__video"
                    src={item.video}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => {
                      e.target.pause();
                      e.target.currentTime = 0;
                    }}
                  />
                  <div className="saved-card__shade" />
                  <div className="saved-card__content">
                    <div className="saved-card__body">
                      <h2>{item.name || 'Saved item'}</h2>
                      <p>{item.description}</p>
                    </div>

                    <div className="saved-card__actions">
                      <IconButton
                        icon="heart"
                        label="Like"
                        count={item.likeCount ?? 0}
                        active
                        onClick={() => likeVideos(item)}
                      />
                      <IconButton
                        icon="bookmark"
                        label="Saved"
                        count={item.saveCount ?? 0}
                        active
                        onClick={() => removeSaved(item)}
                      />
                    </div>

                    <div className="saved-card__footer">
                      <Link className="visit-btn" to={`/food-partner/${item.foodPartner}`}>
                        [ Visit Store ]
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            emptyState
          )}
        </main>
      </div>
      <BottomNav />
    </>
  );
}
