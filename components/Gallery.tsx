import GalleryItem from "./GalleryItem";

const Gallery = () => {

  // TEMPORARY
  const items = [
    {
      id: 1,
      media: "/pinterest_clone/pins/pin1.jpeg",
      width: 1260,
      height: 1000,
    },
    {
      id: 2,
      media: "/pinterest_clone/pins/pin2.jpeg",
      width: 1260,
      height: 1400,
    },
    {
      id: 3,
      media: "/pinterest_clone/pins/pin3.jpeg",
      width: 1260,
      height: 1400,
    },
    {
      id: 4,
      media: "/pinterest_clone/pins/pin4.jpeg",
      width: 1260,
      height: 1000,
    },
    {
      id: 5,
      media: "/pinterest_clone/pins/pin5.jpeg",
      width: 1260,
      height: 1243,
    },
    {
      id: 6,
      media: "/pinterest_clone/pins/pin6.jpeg",
      width: 1260,
      height: 1568,
    },
    {
      id: 7,
      media: "/pinterest_clone/pins/pin7.jpeg",
      width: 1260,
      height: 1234,
    },
    {
      id: 8,
      media: "/pinterest_clone/pins/pin8.jpeg",
      width: 1260,
      height: 1400,
    },
    {
      id: 9,
      media: "/pinterest_clone/pins/pin9.jpeg",
      width: 1260,
      height: 1000,
    },
    {
      id: 10,
      media: "/pinterest_clone/pins/pin10.jpeg",
      width: 1260,
      height: 1000,
    },
    {
      id: 11,
      media: "/pinterest_clone/pins/pin11.jpeg",
      width: 1260,
      height: 1000,
    },
    {
      id: 12,
      media: "/pinterest_clone/pins/pin12.jpeg",
      width: 1260,
      height: 1400,
    },
    {
      id: 13,
      media: "/pinterest_clone/pins/pin13.jpeg",
      width: 1260,
      height: 1400,
    },
    {
      id: 14,
      media: "/pinterest_clone/pins/pin14.jpeg",
      width: 1260,
      height: 1600,
    },
    {
      id: 15,
      media: "/pinterest_clone/pins/pin15.jpeg",
      width: 1260,
      height: 1000,
    },
    {
      id: 16,
      media: "/pinterest_clone/pins/pin16.jpeg",
      width: 1260,
      height: 1260,
    },
    {
      id: 17,
      media: "/pinterest_clone/pins/pin17.jpeg",
      width: 1260,
      height: 1000,
    },
    {
      id: 18,
      media: "/pinterest_clone/pins/pin18.jpeg",
      width: 1260,
      height: 1260,
    },
    {
      id: 19,
      media: "/pinterest_clone/pins/pin19.jpeg",
      width: 1260,
      height: 1400,
    },
    {
      id: 20,
      media: "/pinterest_clone/pins/pin20.jpeg",
      width: 1260,
      height: 1260,
    },
    {
      id: 21,
      media: "/pinterest_clone/pins/pin21.jpeg",
      width: 1260,
      height: 1400,
    },
    {
      id: 22,
      media: "/pinterest_clone/pins/pin22.jpeg",
      width: 1260,
      height: 1890,
    },
    {
      id: 23,
      media: "/pinterest_clone/pins/pin23.jpeg",
      width: 1260,
      height: 1260,
    },
    {
      id: 24,
      media: "/pinterest_clone/pins/pin24.jpeg",
      width: 1260,
      height: 1260,
    },
    {
      id: 25,
      media: "/pinterest_clone/pins/pin25.jpeg",
      width: 1260,
      height: 1260,
    },
  ];

  return (
    <div
      className="grid max-[475px]:grid-cols-1 max-[798px]:grid-cols-2 max-[1035px]:grid-cols-3
        max-[1272px]:grid-cols-4 max-[1509px]:grid-cols-5 max-[1746px]:grid-cols-6
        min-[1746px]:grid-cols-7 gap-4 auto-rows-[10px]"
    >
      {items.map((item) => (
        <GalleryItem key={item.id} item={item} />
      ))}
    </div>
  )
}

export default Gallery
