import { useEffect, useState } from 'react';
import BottomNav from '../../components/BottomNav';
import ReelFeed from '../../components/ReelFeed';
import '../../styles/reel.css';
import api from '../../lib/api';

export default function Home() {
  const [videos, setvideos] = useState([]);
  const [savedMap, setSavedMap] = useState({});


  useEffect(() => {
    let isMounted = true;

    const foodsReq = api.get('/api/food');
    const savesReq = api.get('/api/food/save');

    Promise.allSettled([foodsReq, savesReq]).then((results) => {
      if (!isMounted) return;

      const [foodsRes, savesRes] = results;

      if (foodsRes.status === 'fulfilled') {
        setvideos(foodsRes.value.data.foodItems || []);
      } else {
        console.error('failed to load food items', foodsRes.reason);
      }

      const map = {};
      if (savesRes.status === 'fulfilled') {
        (savesRes.value.data.saveFoods || []).forEach((s) => {
          const id = s?.food?._id || s?.food?.id;
          if (id) map[String(id)] = true;
        });
      } else {
        const status = savesRes.reason?.response?.status;
        // 401 means user is not authenticated; initialize empty map silently
        if (status && status !== 401 && status !== 404) {
          console.error('failed to load saved map', savesRes.reason);
        }
      }

      setSavedMap(map);
    });

    return () => {
      isMounted = false;
    };
  }, []);
  async function likeVideos(item){
    try {
      const res = await api.post('/api/food/like', { foodId: item._id });
      if(res.data.like){
        console.log("video liked");
        setvideos((prev)=> prev.map((v)=> v._id === item._id ?{...v , likeCount:(v.likeCount ?? 0) + 1}:v));
      }else{
        console.log("video unliked");
        setvideos((prev)=> prev.map((v)=> v._id === item._id ?{...v , likeCount:Math.max(0, (v.likeCount ?? 0) - 1)}:v))
      }
    } catch (error) {
      
      console.error('failed to like video', error.response?.data || error.message);
    }

  }
  async function bookmarkVideo(item){
    try {
      const res = await api.post('/api/food/save', { foodId: item._id });
      if(res.data.save){
        console.log("video saved");
        setvideos((prev)=> prev.map((v)=> v._id === item._id ?{...v , saveCount:(v.saveCount ?? 0) + 1}:v));
        setSavedMap((prev) => ({ ...prev, [item._id]: true }));
      }else{
        console.log("video unsaved");
        setvideos((prev)=> prev.map((v)=> v._id === item._id ?{...v , saveCount:Math.max(0, (v.saveCount ?? 0) - 1)}:v))
        setSavedMap((prev) => ({ ...prev, [item._id]: false }));
      }
    } catch (error) {
      console.error('failed to save video', error.response?.data || error.message);
    }
  }

  return (
    <>
      <ReelFeed
        items={videos}
        savedMap={savedMap}
        onLike={likeVideos}
        onSave={bookmarkVideo}
      />
      <BottomNav />
    </>
  );
}
