import { useEffect, useState } from 'react';
import axios from 'axios';
import BottomNav from '../../components/BottomNav';
import ReelFeed from '../../components/ReelFeed';
import '../../styles/reel.css';

export default function Home() {
  const [videos, setvideos] = useState([]);
  const [savedMap, setSavedMap] = useState({});


  useEffect(() => {
    axios
      .get('https://food-reel-app-2.onrender.com/api/food', { withCredentials: true })
      .then(res=>{
        console.log(res.data);
        setvideos(res.data.foodItems)
     })
    .catch((error) => {
      console.error('failed to load food items', error);
    })
    }, [])
  async function likeVideos(item){
    try {
      const res = await axios.post("https://food-reel-app-2.onrender.com/api/food/like",{foodId: item._id},{withCredentials:true});
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
      const res = await axios.post("https://food-reel-app-2.onrender.com/api/food/save",{foodId:item._id},{withCredentials:true});
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
