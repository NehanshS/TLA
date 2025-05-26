import React from "react";

export default function SpeckleViewer({ embedUrl, style = {} }) {
  if (!embedUrl) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black/40 rounded-[14px]">
        <span className="text-gray-400 font-mono">No Speckle Embed URL Provided</span>
      </div>
    );
  }
  return (
    <iframe
      src={embedUrl}
      title="Speckle"
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        borderRadius: "14px",
        background: "transparent",
        ...style
      }}
      allowFullScreen
      scrolling="no"
      className="no-scrollbar"
      frameBorder="0"
    />
  );
}
