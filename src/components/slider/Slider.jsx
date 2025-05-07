import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import './Slider.css';
import { Pagination, Autoplay } from 'swiper/modules';
import img from '../../assets/images/download.png';

const Slider = () => {
  const images = [
    {
      src: img,  // 'scr' emas, 'src' bo'lishi kerak
      alt: 'rasm1'
    },
    {
      src: img,
      alt: 'rasm2'  // Har bir rasm uchun unique alt text bo'lishi maqsadga muvofiq
    }
  ];

  return (
    <div className="slider-container">
      <Swiper
        direction={'vertical'}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
        speed={800}
        loop={true}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        style={{
          height: '500px',
          width: '100%'
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="slide-content">
              <img 
                src={image.src}
                alt={image.alt}
                className="slide-image"
                style={{
                  width: '100%',
                  maxHeight: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;