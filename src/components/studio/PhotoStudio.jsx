import { useEffect, useRef, useState } from "react";

export default function PhotoStudio() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [photos, setPhotos] = useState([]);
  const [streamActive, setStreamActive] = useState(false);
  const [ghostingEnabled, setGhostingEnabled] = useState(true);

  // Load photos from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("gym_photo_studio");
    if (saved) {
      try {
        setPhotos(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved photos", e);
      }
    }
  }, []);

  // Save to local storage whenever photos change
  useEffect(() => {
    if (photos.length === 0) return;
    
    try {
      localStorage.setItem("gym_photo_studio", JSON.stringify(photos));
    } catch (e) {
      console.error("Storage full! Cannot save photo.", e);
      alert("Local storage capacity reached. Please delete some older photos first!");
      // Automatically rollback the last photo that failed to save
      setPhotos(prev => prev.slice(1));
    }
  }, [photos]);

  // Start Webcam
  useEffect(() => {
    let activeStream = null;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        activeStream = stream;
        setStreamActive(true);
      } catch (err) {
        console.error("Camera access denied", err);
      }
    }
    
    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Match canvas to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Flip horizontally to match the mirrored display usually expected
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.6); // 60% quality JPEG saves massive space
    
    const newPhoto = {
      id: Date.now(),
      url: dataUrl,
      date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
    };

    setPhotos(prev => [newPhoto, ...prev]);
  };

  const deletePhoto = (id) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const latestPhoto = photos.length > 0 ? photos[0] : null;

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2.5rem", margin: 0 }}>📸 Gym Photo Studio</h1>
        
        <div style={{ display: "flex", gap: "10px" }}>
           <button 
             onClick={() => setGhostingEnabled(!ghostingEnabled)}
             style={{
               padding: "10px 16px",
               borderRadius: "8px",
               border: "1px solid #444",
               backgroundColor: ghostingEnabled ? "rgba(0, 184, 148, 0.2)" : "#2d3436",
               color: ghostingEnabled ? "#00b894" : "white",
               cursor: "pointer",
               fontWeight: "bold",
               transition: "all 0.2s"
             }}
           >
             {ghostingEnabled ? "👻 Ghosting ON" : "👻 Ghosting OFF"}
           </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px", marginBottom: "40px" }}>
        {/* Camera Stage */}
        <div style={{ 
          position: "relative", 
          backgroundColor: "#1e1e1e", 
          borderRadius: "16px", 
          overflow: "hidden",
          aspectRatio: "16/9",
          border: "2px solid #333",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
        }}>
          {!streamActive && (
            <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10 }}>
              <p>Loading Camera...</p>
            </div>
          )}

          {/* Live Video Feed */}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover",
              transform: "scaleX(-1)" // Mirror the camera naturally
            }} 
          />

          {/* Ghost Overlay */}
          {ghostingEnabled && latestPhoto && streamActive && (
            <img 
              src={latestPhoto.url} 
              alt="Ghost" 
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.35,
                pointerEvents: "none",
                mixBlendMode: "screen",
                transform: "scaleX(-1)" // Match the mirrored capture format
              }}
            />
          )}

          {/* Hidden Canvas for capture */}
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {/* Controls Overlay */}
          <div style={{
            position: "absolute",
            bottom: "30px",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none"
          }}>
            <button
              onClick={takePhoto}
              style={{
                pointerEvents: "auto",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                border: "4px solid white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.5)"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.9)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
               <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "white" }}></div>
            </button>
          </div>
        </div>

        {/* Saved Gallery */}
        <div>
          <h2 style={{ borderBottom: "1px solid #333", paddingBottom: "10px", marginBottom: "20px" }}>Your Progress Gallery</h2>
          
          {photos.length === 0 ? (
            <p style={{ opacity: 0.5 }}>No photos yet. Start capturing your progress!</p>
          ) : (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
              gap: "20px" 
            }}>
              {photos.map(photo => (
                <div key={photo.id} style={{ 
                  backgroundColor: "#2d3436", 
                  borderRadius: "12px", 
                  overflow: "hidden",
                  border: "1px solid #444",
                  position: "relative",
                  group: "photo-card"
                }}>
                  <img 
                    src={photo.url} 
                    alt="Progress" 
                    style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }} 
                  />
                  <div style={{ padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>{photo.date}</span>
                    <button 
                      onClick={() => deletePhoto(photo.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ff7675",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "0.9rem"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
