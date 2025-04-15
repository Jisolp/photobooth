function PhotoStrip({ images, border }) {
    return (
      <div className={`p-4 rounded w-fit mx-auto ${border === 'black' ? 'bg-black' : 'bg-white'}`}>
        <div className="flex flex-col items-center gap-2">
          {images.map((img, idx) => (
            <img key={idx} src={img} className="w-[360px] h-[480px] object-cover" />
          ))}
          <div className={`mt-2 font-bold text-center text-sm ${border === 'black' ? 'text-white' : 'text-black'}`}>
            LIFE FOUR CUTS
          </div>
        </div>
      </div>
    );
  }
  
  export default PhotoStrip;
  