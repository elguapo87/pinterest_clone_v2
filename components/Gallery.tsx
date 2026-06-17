"use client"

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchPins = async () => {
      try {
        setLoading(true);

        const { data } = await api.get("/pins/fetchPins");
        if (data.success) {
          setPins(data.pins);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPins();
  }, []);

  if (loading) return <Loader />

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
        <p className="text-xl text-gray-600">No pins added yet</p>
      )}
    </div>
  )
}

export default Gallery
