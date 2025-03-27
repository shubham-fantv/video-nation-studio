/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { API_BASE_URL } from "../../constant/constants";
import { Howl } from "howler";

export const AudioPlayer = ({ currentTrack, onNext, onPrev }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [howl, setHowl] = useState(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [initializationAttempted, setInitializationAttempted] = useState(false);

  const getMP3Url = (track) => {
    if (!track.audioUrl) return null;

    // Example of processing if URL needs to be transformed
    if (track.audioUrl.includes("walrus.space")) {
      return `https://cdn.walrus.space/${track.blobId}.mp3`;
    }

    return track.audioUrl;
  };

  // Function to unlock audio on iOS - improved version
  const unlockAudio = useCallback(() => {
    if (audioUnlocked) return true;

    // iOS requires a user gesture to unlock audio
    console.log("Attempting to unlock audio...");

    // Create a silent sound with very specific settings for iOS
    const silentSound = new Howl({
      src: [
        "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjEyLjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADmADMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjE4AAAAAAAAAAAAAAAAJAAAAAAAAAAAEJlrEH0AAAAAAAAAAAAAAAAAAAAA//tQxAADB5AjCQAkwAtJGLgQIkYlMhRUYW5nANKFgQA4QwgBAQDjMBwaHATgOBwOA4HAYDA4HAQBAMAwGAwGAwGAwGAwGAgIAgCAgCAgIAgICAgICBBQUFAQEBAQEGBgYGBgYAAAAICAgICAp/8=",
      ],
      format: "mp3",
      html5: true,
      volume: 0.01,
      autoplay: true,
      onend: () => {
        console.log("Unlock sound played successfully");
        setAudioUnlocked(true);
        return true;
      },
      onloaderror: (id, err) => {
        console.error("Failed to load unlock sound:", err);
        // Still set as unlocked to allow attempts to play
        setAudioUnlocked(true);
        return false;
      },
    });

    // Force play the silent sound and catch any errors
    try {
      silentSound.play();
      return true;
    } catch (e) {
      console.error("Error during audio unlock:", e);
      // Still set as unlocked to allow attempts to play
      setAudioUnlocked(true);
      return false;
    }
  }, [audioUnlocked]);

  // Add click handler to document to unlock audio - improved to use all user gestures
  useEffect(() => {
    const handleUserInteraction = () => {
      unlockAudio();
    };

    // Listen for various user interactions that can unlock audio on iOS
    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);
    document.addEventListener("touchend", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("touchend", handleUserInteraction);
    };
  }, [unlockAudio]);

  // Handle track changes with improved iOS handling
  useEffect(() => {
    if (!currentTrack) return;

    console.log("🚀 ~ useEffect ~ currentTrack:", currentTrack);

    // Stop and unload previous track if it exists
    if (howl) {
      howl.stop();
      howl.unload();
    }

    // Don't initialize new track until audio has been unlocked or attempted
    if (!audioUnlocked && !initializationAttempted) {
      setInitializationAttempted(true);
      unlockAudio();
    }

    // Initialize new Howl instance with more iOS-friendly settings
    const newHowl = new Howl({
      src: [getMP3Url(currentTrack)],
      html5: true, // Essential for iOS
      preload: true,
      format: ["mp3"], // Explicitly state format
      pool: 1, // Reduce number of simultaneous connections
      onload: function () {
        console.log("Track loaded successfully");
        setDuration(newHowl.duration());
      },
      onloaderror: function (id, error) {
        console.error("Howler load error:", error);

        // Try alternative loading method for iOS
        setTimeout(() => {
          newHowl.load();
        }, 1000);
      },
      onplayerror: function (id, error) {
        console.error("Howler play error:", error);

        // More aggressive recovery for iOS
        unlockAudio();

        setTimeout(() => {
          try {
            // Try to recover from playback error
            newHowl.once("unlock", function () {
              newHowl.play();
            });

            // Force play attempt
            newHowl.play();
          } catch (e) {
            console.error("Recovery attempt failed:", e);
          }
        }, 500);
      },
      onplay: function () {
        console.log("Playing started successfully");
        setIsPlaying(true);
        requestAnimationFrame(updateTime);
      },
      onpause: () => {
        console.log("Audio paused");
        setIsPlaying(false);
      },
      onend: () => {
        console.log("Track ended");
        setIsPlaying(false);
        if (typeof onNext === "function") onNext();
      },
    });

    setHowl(newHowl);

    // Cleanup function
    return () => {
      if (newHowl) {
        newHowl.stop();
        newHowl.unload();
      }
    };
  }, [currentTrack, audioUnlocked, initializationAttempted, unlockAudio]);

  const updateTime = () => {
    if (howl && howl.playing()) {
      setCurrentTime(howl.seek() || 0);
      requestAnimationFrame(updateTime);
    }
  };

  const togglePlay = () => {
    if (!howl) return;

    // Always unlock audio first
    unlockAudio();

    if (isPlaying) {
      howl.pause();
    } else {
      // Use a longer timeout for iOS
      setTimeout(() => {
        try {
          // Fixed: Howler doesn't return a promise in .play()
          console.log("Attempting to play audio...");
          howl.play();
          console.log("Play method called successfully");

          // Set a backup timer in case the onplay event doesn't fire
          setTimeout(() => {
            if (!isPlaying && howl) {
              console.log("Backup play attempt");
              try {
                howl.play();
              } catch (e) {
                console.error("Backup play attempt failed:", e);
              }
            }
          }, 1000);
        } catch (e) {
          console.error("Error during play:", e);
          // One more fallback attempt
          setTimeout(() => {
            try {
              console.log("Fallback play attempt after error");
              howl.play();
            } catch (innerErr) {
              console.error("Final play attempt failed:", innerErr);
            }
          }, 500);
        }
      }, 300); // Longer timeout for iOS
    }
  };

  const handleSeek = (e) => {
    unlockAudio(); // Try to unlock on any user interaction

    const time = parseFloat(e.target.value);
    if (howl) {
      try {
        howl.seek(time);
        setCurrentTime(time);
      } catch (e) {
        console.error("Error during seek:", e);
      }
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleNext = () => {
    unlockAudio();
    if (typeof onNext === "function") onNext();
  };

  const handlePrev = () => {
    unlockAudio();
    if (typeof onPrev === "function") onPrev();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E] text-white p-2 border-t border-gray-800">
      <div className="container mx-auto">
        {/* Desktop Layout */}
        <div className="flex-col items-center justify-between hidden gap-4 md:flex md:flex-row">
          <div className="flex items-center gap-4 min-w-[200px]">
            {currentTrack && (
              <>
                <img
                  src={currentTrack.imageUrl}
                  alt={currentTrack.title}
                  className="w-12 h-12 rounded"
                />
                <div>
                  <h4 className="font-medium">{currentTrack.title}</h4>
                  <p className="text-sm text-gray-400">{currentTrack.style}</p>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col items-center flex-1 gap-2">
            <div className="flex items-center gap-4">
              <button onClick={handlePrev} className="p-2 hover:text-[#FF7F50]">
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={togglePlay}
                className="p-2 bg-[#FF7F50] rounded-full hover:bg-[#FF7F50]/80"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button onClick={handleNext} className="p-2 hover:text-[#FF7F50]">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center w-full gap-2">
              <span className="text-xs">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime || 0}
                onChange={handleSeek}
                className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center w-32 gap-2">
            <Volume2 className="w-5 h-5" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              defaultValue={1}
              onChange={(e) => {
                unlockAudio();
                if (howl) howl.volume(parseFloat(e.target.value));
              }}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex flex-col items-center md:hidden">
          <div className="flex items-center justify-between w-full mb-2">
            {currentTrack && (
              <div className="flex items-center gap-3">
                <img
                  src={currentTrack.imageUrl}
                  alt={currentTrack.title}
                  className="w-10 h-10 rounded"
                />
                <div>
                  <h4 className="font-medium text-sm truncate max-w-[150px]">
                    {currentTrack.title}
                  </h4>
                  <p className="text-xs text-gray-400 truncate max-w-[150px]">
                    {currentTrack.style}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <button onClick={handlePrev} className="p-1 hover:text-[#FF7F50]">
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={togglePlay}
                className="p-1 bg-[#FF7F50] rounded-full hover:bg-[#FF7F50]/80"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button onClick={handleNext} className="p-1 hover:text-[#FF7F50]">
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center w-full gap-2">
            <span className="w-8 text-xs text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime || 0}
              onChange={handleSeek}
              className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <span className="w-8 text-xs">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
// MusicCard Component
const MusicCard = ({ data, onPlay, isPlaying }) => {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-[auto] overflow-hidden transition-transform rounded-lg hover:scale-105">
      <div className="bg-gradient-to-b from-[#1E1E1E] via-[#2A2A2A] to-[#FFB672]/20 h-full">
        <div className="relative h-40 md:h-50">
          <img src={data.imageUrl} alt={data.title} className="object-cover w-full h-full" />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-white">{data.title}</h3>
            <button onClick={() => onPlay(data)} className={`${"bg-[#FE964A]"} p-2 rounded-full`}>
              {isPlaying ? (
                <Pause className="w-4 h-4 text-black" />
              ) : (
                <Play className="w-4 h-4 text-black" />
              )}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {data.style &&
              data.style.split(",").map((style, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 rounded-lg capitalize text-[#FFD5A9] border border-[#744A2E] bg-[#FE964A]/20"
                >
                  {style.trim()}
                </span>
              ))}
          </div>
          <p className="capitalize rounded-[4px] text-[#D2D2D2] text-xs font-normal leading-[150%]">
            {formatTime(data.duration)} Min
          </p>
        </div>
      </div>
    </div>
  );
};

// Main Component
const MusicDiscovery = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [audioList, setAudioList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchAudioList();
  }, []);

  const fetchAudioList = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/audio-list`);
      const result = await response.json();

      if (result.success) {
        setAudioList(result.data);
      } else {
        throw new Error(result.error || "Failed to fetch audio list");
      }
    } catch (error) {
      console.error("Error fetching audio list:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (track) => {
    const index = audioList.findIndex((t) => t._id === track._id);
    setCurrentTrackIndex(index);
    setCurrentTrack(track);
  };

  const handleNext = () => {
    if (currentTrackIndex < audioList.length - 1) {
      const nextTrack = audioList[currentTrackIndex + 1];
      setCurrentTrackIndex(currentTrackIndex + 1);
      setCurrentTrack(nextTrack);
    }
  };

  const handlePrev = () => {
    if (currentTrackIndex > 0) {
      const prevTrack = audioList[currentTrackIndex - 1];
      setCurrentTrackIndex(currentTrackIndex - 1);
      setCurrentTrack(prevTrack);
    }
  };

  const handleCreateClick = () => {
    router.push("/ai-agent");
  };

  return (
    <div className="min-h-screen bg-[#0E0E11] pb-24">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-[#18181B] pt-24 md:block">
        <nav className="p-6 space-y-4">
          <div
            onClick={() => router.push("/")}
            className={`flex items-center space-x-2 text-white cursor-pointer hover:text-[#FF7F50] p-2 rounded-lg transition-all 
            ${pathname?.includes("/") ? "bg-[#FF7F50]/10" : "hover:text-[#FF7F50]"}`}
          >
            <span className="text-lg">🏠</span>
            <span className="font-medium">Home</span>
          </div>
          <div
            onClick={() => router.push("/ai-agent")}
            className={`flex items-center space-x-2 text-white cursor-pointer p-2 rounded-lg transition-all ${
              pathname?.includes("/ai-agent") ? "bg-[#FF7F50]/10" : "hover:text-[#FF7F50]"
            }`}
          >
            <span className="text-lg">🎵</span>
            <span className="font-medium">Create</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="p-6 pt-24 md:ml-64">
        <h1 className="mb-8 text-3xl font-bold bg-gradient-to-b from-[#FFD5A9] to-white text-transparent bg-clip-text">
          Discover
        </h1>

        {loading ? (
          <div className="text-center text-white">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">Error: {error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 mb-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {audioList.map((item) => (
              <MusicCard
                key={item._id}
                data={item}
                onPlay={handlePlay}
                isPlaying={currentTrack?._id === item._id}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Create Button - Mobile Only */}
      <button
        onClick={handleCreateClick}
        className="fixed bottom-[90px] right-6 z-50 md:hidden bg-[#FF7F50] p-4 rounded-full shadow-2xl shadow-[#FF7F50]/50"
      >
        <Plus className="w-6 h-6 text-black" />
      </button>

      {/* Audio Player */}
      {currentTrack && (
        <AudioPlayer currentTrack={currentTrack} onNext={handleNext} onPrev={handlePrev} />
      )}
    </div>
  );
};

export default MusicDiscovery;
