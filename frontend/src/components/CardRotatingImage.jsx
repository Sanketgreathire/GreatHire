import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const ROTATE_MS = 4000;

// Card tile image. With multiple images it crossfades through them every 4s;
// a single image renders exactly like the old static <img> (same classes,
// same lazy loading), so existing cards are visually unchanged.
const CardRotatingImage = ({ images, image, alt, className = "", imgClassName = "" }) => {
  const list = Array.isArray(images) && images.length ? images : image ? [image] : [];
  const count = list.length;
  const [active, setActive] = useState(0);

  // Latest list for the timer without re-creating the interval on every render.
  const listRef = useRef(list);
  listRef.current = list;

  useEffect(() => {
    if (count < 2) return undefined;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % (listRef.current.length || 1));
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [count]);

  if (count === 0) return null;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {list.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          // Only the cover carries the alt text; rotation frames are decorative.
          alt={i === 0 ? alt : ""}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${imgClassName} ${
            count === 1 || i === active % count ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
};

CardRotatingImage.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  image: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  imgClassName: PropTypes.string,
};

export default CardRotatingImage;
