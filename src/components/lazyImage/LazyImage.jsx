import React, { useState, useEffect, useRef, useCallback } from "react";

const LazyImage = React.forwardRef(({ src, alt, placeholder }, ref) => {
  const [imageSrc, setImageSrc] = useState(placeholder || "");
  const [imageRef, setImageRef] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const setRefs = useCallback(
    (node) => {
      if (ref) {
        ref(node);
      }
      setImageRef(node);
    },
    [ref]
  );

  useEffect(() => {
    let observer;

    if (imageRef && !isLoaded) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.unobserve(imageRef);
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(imageRef);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [imageRef, isLoaded]);

  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
    }
  }, [isInView, src]);

  return (
    <div
      className={`image-container ${isLoaded ? "loaded" : "loading"}`}
      ref={setRefs}
    >
      <img src={imageSrc} alt={alt} className="lazy-image" />
      {!isLoaded && (
        <div className="image-placeholder">
          <div className="skeleton-loader"></div>
        </div>
      )}
    </div>
  );
});

LazyImage.displayName = "LazyImage";

export default LazyImage;
