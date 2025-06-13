import React, { useState, useEffect, useCallback, useRef } from "react";
import "./ImageGallery.css";
import LazyImage from "../lazyImage/LazyImage";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // Last image element callback
  const lastImageElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Fetch images function
  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      // Using Unsplash API as an example
      const response = await fetch(
        `https://api.unsplash.com/photos?page=${page}&per_page=10&client_id=6V5Hj6b0hhu1uSlwXc41_RZgltffGIO_HwKgoQEQK3M`
      );
      const data = await response.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setImages((prev) => [...prev, ...data]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className="image-gallery">
      <div className="image-grid">
        {images.map((image, index) => {
          if (images.length === index + 1) {
            return (
              <LazyImage
                key={image.id}
                ref={lastImageElementRef}
                src={image.urls.regular}
                alt={image.alt_description}
                placeholder={image.urls.thumb}
              />
            );
          } else {
            return (
              <LazyImage
                key={image.id}
                src={image.urls.regular}
                alt={image.alt_description}
                placeholder={image.urls.thumb}
              />
            );
          }
        })}
      </div>

      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading more images...</p>
        </div>
      )}

      {!hasMore && (
        <div className="end-message">
          <p>No more images to load</p>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
