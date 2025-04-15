import { useState } from 'react';
import CameraFeed from './cameraFeed';
import CountdownTimer from './coutdownTimer';

// For preview border color
const COLORS = [
  'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'black'
];

// For download canvas border fill
const COLOR_HEX_MAP = {
  red: '#ef4444',
  orange: '#f97316',
  yellow: '#eab308',
  green: '#22c55e',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
  black: '#1f2937'
};

function PhotoBooth() {
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [startCountdown, setStartCountdown] = useState(false);
  const [useFlash, setUseFlash] = useState(true);
  const [selectedColor, setSelectedColor] = useState('black');

  const STRIP_WIDTH = 240;
  const STRIP_HEIGHT = 180;
  const CAMERA_WIDTH = 640;
  const CAMERA_HEIGHT = 480;
  const PHOTO_SPACING = 20;
  const FINAL_PADDING_BOTTOM = 60;

  const handleCapture = (photo) => {
    if (capturedPhotos.length >= 4) return;
    setCapturedPhotos((prev) => [...prev, photo]);
  };

  const handleRetake = () => {
    if (capturedPhotos.length > 0) {
      const newPhotos = [...capturedPhotos];
      newPhotos.pop();
      setCapturedPhotos(newPhotos);
    }
  };

  const handleExport = async () => {
    const borderTop = 4;
    const borderLeft = 6;
    const borderRight = 6;
    const borderBottom = 8;

    const innerWidth = STRIP_WIDTH - borderLeft - borderRight;
    const boxHeight = STRIP_HEIGHT + borderTop + borderBottom;
    const canvasHeight = boxHeight * 4 + PHOTO_SPACING * 3 + FINAL_PADDING_BOTTOM;

    const canvas = document.createElement('canvas');
    canvas.width = STRIP_WIDTH;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < capturedPhotos.length; i++) {
      await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const y = i * (boxHeight + PHOTO_SPACING);

          // Draw border area
          ctx.fillStyle = COLOR_HEX_MAP[selectedColor] || '#000000';
          ctx.fillRect(0, y, STRIP_WIDTH, boxHeight);

          // Draw photo inside border
          ctx.drawImage(
            img,
            borderLeft,
            y + borderTop,
            innerWidth,
            STRIP_HEIGHT
          );
          resolve();
        };
        img.src = capturedPhotos[i];
      });
    }

    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'photostrip.png';
    link.click();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-50 flex items-center justify-center">
      <div className="flex gap-16 items-start bg-white p-10 rounded-lg shadow-lg z-10">
        {/* 📸 Camera */}
        <div className="flex flex-col items-center">
          <CameraFeed
            width={CAMERA_WIDTH}
            height={CAMERA_HEIGHT}
            onCapture={handleCapture}
            triggerCapture={startCountdown}
            setTriggerCapture={setStartCountdown}
          />
          <button
            onClick={() => setStartCountdown(true)}
            className="mt-4 bg-black text-white px-6 py-2 rounded"
          >
            Snap 📷
          </button>
          <button
            onClick={handleRetake}
            className="mt-2 bg-red-500 text-white px-6 py-2 rounded"
          >
            Retake Last
          </button>
          <button
            onClick={() => setUseFlash((prev) => !prev)}
            className={`mt-2 px-6 py-2 rounded ${
              useFlash ? 'bg-yellow-400 text-black' : 'bg-gray-300 text-gray-700'
            }`}
          >
            {useFlash ? 'Flash ON ⚡' : 'Flash OFF'}
          </button>

          {/* 🎨 Border Color Selector */}
          <div className="flex flex-wrap gap-2 mt-4">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-3 py-1 rounded border-2 border-${color}-500 text-sm ${
                  selectedColor === color ? `bg-${color}-500 text-white` : 'bg-white text-black'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* 📸 Strip preview */}
        <div className="p-4 rounded-md border-4 border-gray-300 bg-white">
          <div className="flex flex-col items-center gap-y-8 px-2 py-4 bg-white rounded-md">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`relative w-[240px] h-[180px] rounded-md overflow-hidden shadow-md
                  border-t-4 border-l-6 border-r-6 border-b-8
                  border-${selectedColor}-500`}
              >
                {capturedPhotos[i] ? (
                  <img
                    src={capturedPhotos[i]}
                    className="absolute w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    Waiting...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <CountdownTimer
        trigger={startCountdown}
        setTrigger={setStartCountdown}
      />

      {/* 📥 Download Button */}
      {capturedPhotos.length === 4 && (
        <button
          onClick={handleExport}
          className="absolute bottom-10 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 z-10"
        >
          Download Strip ⬇️
        </button>
      )}
    </div>
  );
}

export default PhotoBooth;
