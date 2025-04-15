import { useEffect, useRef } from 'react';

function CameraFeed({ onCapture, triggerCapture, setTriggerCapture, width, height }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user'
      }
    }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  }, []);

  useEffect(() => {
    if (triggerCapture) {
      const timeout = setTimeout(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const video = videoRef.current;

        if (!video || !canvas || !ctx) return;

        const videoW = video.videoWidth;
        const videoH = video.videoHeight;
        const desiredRatio = width / height;

        // determine cropping dimensions
        let cropW = videoW;
        let cropH = cropW / desiredRatio;

        if (cropH > videoH) {
          cropH = videoH;
          cropW = cropH * desiredRatio;
        }

        const offsetX = (videoW - cropW) / 2;
        const offsetY = (videoH - cropH) / 2;

        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);

        ctx.drawImage(
          video,
          offsetX, offsetY, cropW, cropH, // crop box
          0, 0, width, height // draw size
        );

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        const photo = canvas.toDataURL('image/png');
        onCapture(photo);
        setTriggerCapture(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [triggerCapture, onCapture, setTriggerCapture, width, height]);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="rounded-md shadow-md scale-x-[-1]"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          objectFit: 'cover',
        }}
      />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="hidden"
      />
    </div>
  );
}

export default CameraFeed;
