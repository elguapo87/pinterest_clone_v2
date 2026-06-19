"use client"

import { useEffect, useRef, useState } from "react";
import GalleryItem from "./GalleryItem";
import api from "@/lib/axios";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "./Loader";

type Pin = {
  id: number;
  media: string;
  width: number;
  height: number;
};

const Gallery = () => {

  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const fetchPins = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      await delay(800);

      const lastPin = pins[pins.length - 1];

      const { data } = await api.get("/pins/fetchPins", {
        params: {
          cursor: lastPin?.id
        }
      });
      if (data.success) {
        setPins((prev) => {
          const newPins = data.pins.filter(
            (pin: Pin) => !prev.some((p) => p.id === pin.id)
          )
          return [...prev, ...newPins];
        });

        if (data.pins.length < 21) {
          setHasMore(false);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchPins();
  }, []);

  // infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPins();
        }
      },
      {
        threshold: 1
      }
    );

    const current = loaderRef.current;

    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    }
  }, [loading, hasMore]);

  // 🔥 full page loader ONLY for first load
  if (initialLoading) {
     return (
      <div className="w-full flex justify-center py-20">
        <Loader />
      </div>
    );
  }

  return (
    <div
      className="grid max-[475px]:grid-cols-1 max-[798px]:grid-cols-2 max-[1035px]:grid-cols-3
        max-[1272px]:grid-cols-4 max-[1509px]:grid-cols-5 max-[1746px]:grid-cols-6
        min-[1746px]:grid-cols-7 gap-4 auto-rows-[10px]"
    >
      {pins.length > 0 ? (
        pins.map((pin) => (
          <GalleryItem key={pin.id} pin={pin} />
        ))
      ) : (
        <p className="col-span-full text-center text-xl text-gray-600">No pins yet</p>
      )}

      {/* SENTINEL */}
      <div ref={loaderRef} />

      {/* BOTTOM LOADER */}
      {loading && !initialLoading && (
        <div className="col-span-full flex justify-center py-4">
          <Loader />
        </div>
      )}
    </div>
  )
}

export default Gallery
