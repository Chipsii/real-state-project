"use client";

import ModalVideo from "@/components/common/ModalVideo";
import React, { useMemo, useState } from "react";

function extractYouTubeId(url) {
  if (!url) return null;
  const m =
    url.match(/[?&]v=([^&]+)/) ||
    url.match(/youtu\.be\/([^?&]+)/) ||
    url.match(/youtube\.com\/embed\/([^?&/]+)/);
  return m?.[1] || null;
}

function extractVimeoId(url) {
  if (!url) return null;
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m?.[1] || null;
}

const PropertyVideo = ({ property }) => {
  const [isOpen, setOpen] = useState(false);

  const video = property?.media?.video || null;

  const parsed = useMemo(() => {
    if (!video) return { type: "none" };

    const provider = String(video.provider || "").toLowerCase();
    const url = video.url || "";
    const embedId = video.embedId || "";

    if (provider === "youtube") {
      const id = embedId || extractYouTubeId(url);
      if (!id) return { type: "none" };
      return { type: "youtube", id };
    }

    if (provider === "vimeo") {
      const id = embedId || extractVimeoId(url);
      if (!id) return { type: "none" };
      return { type: "vimeo", id };
    }

    if (
      provider === "facebook" ||
      provider === "tiktok" ||
      provider === "custom"
    ) {
      if (!url) return { type: "none" };
      return { type: "link", url };
    }

    if (url) return { type: "link", url };

    return { type: "none" };
  }, [video]);

  const { thumb, modalSrc } = useMemo(() => {
    if (parsed.type === "youtube") {
      return {
        thumb: `https://img.youtube.com/vi/${parsed.id}/hqdefault.jpg`,
        modalSrc: `https://www.youtube.com/embed/${parsed.id}?autoplay=1`,
      };
    }

    if (parsed.type === "vimeo") {
      return {
        thumb: null,
        modalSrc: `https://player.vimeo.com/video/${parsed.id}?autoplay=1`,
      };
    }

    return { thumb: null, modalSrc: null };
  }, [parsed]);

  if (parsed.type === "none") return null;

  const handleClick = () => {
    if (parsed.type === "youtube" || parsed.type === "vimeo") {
      setOpen(true);
      return;
    }
    window.open(parsed.url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {(parsed.type === "youtube" || parsed.type === "vimeo") && (
        <ModalVideo
          setIsOpen={setOpen}
          isOpen={isOpen}
          videoId={parsed.type === "youtube" ? parsed.id : undefined}
          src={modalSrc}
        />
      )}

      <div className="col-md-12">
        <div
          className="property_video bdrs12 w-100"
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleClick();
          }}
          style={{
            backgroundImage: thumb ? `url(${thumb})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: 260,
            backgroundColor: thumb ? undefined : "#111",
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
          }}
          aria-label="Play video"
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.55))",
              pointerEvents: "none",
            }}
          />

          <button
            className="video_popup_btn mx-auto popup-img"
            onClick={(e) => {
              e.stopPropagation(); 
              handleClick();
            }}
            style={{
              border: "none",
              background: "transparent",
              position: "relative",
              zIndex: 1,
            }}
            type="button"
            aria-label="Play video"
          >
            <span className="flaticon-play" />
          </button>

          <div
            style={{
              position: "absolute",
              left: 14,
              bottom: 12,
              zIndex: 1,
              color: "#fff",
              fontSize: 12,
              opacity: 0.9,
              pointerEvents: "none",
            }}
          >
            {parsed.type === "youtube"
              ? "YouTube"
              : parsed.type === "vimeo"
              ? "Vimeo"
              : "Video"}
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyVideo;
