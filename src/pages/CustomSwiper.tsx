import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import './customSwiper.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navigation, Pagination } from 'swiper/modules';


const apiKey = "6079e93c1e108a319ce62e3f8c0a8ac0";

const CustomSwiper = ({ language }: { language: string }) => {
  const { id } = useParams();
  const [teasers, setTeasers] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetchTeasers(id);
    }
  }, [id, language]);

  const fetchTeasers = async (movie_id: string) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=${apiKey}&language=${language}`
      );
      const filteredTeasers = response.data.results.filter(
        (video: any) =>
          video.type === "Teaser" &&
          (video.site === "YouTube" || video.site === "Vimeo")
      )
      .map((video: any) => video.key);
    
      setTeasers(filteredTeasers);
    } catch (error) {
      console.error("Ошибка загрузки тизера:", error);
    }
  };

  return (
    <div className="movieTeaser">
      <Swiper
        className="teaserSwiper"
        modules={[Navigation, Pagination]}
        navigation={{enabled: true}}
        pagination={{ enabled: true, clickable: true }}
        spaceBetween={10}
        slidesPerView={3}
        loop={true}
        grabCursor={true} // Включаем перетаскивание
      >
        {teasers.length > 0 ? (
          teasers.map((teaserKey, index) => (
            <SwiperSlide key={index}>
              <iframe
                className="teaserCard"
                src={`https://www.youtube.com/embed/${teaserKey}`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </SwiperSlide>
          ))
        ) : (
          <p>No teasers found</p>
        )}
      </Swiper>
    </div>
  );
};

export default CustomSwiper;
