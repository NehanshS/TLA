import React from "react";

/**
 * Embeds a Speckle stream as an iframe viewer.
 * Props:
 *   - streamId: required
 *   - commitId: optional
 *   - branch: optional (default "main")
 */
export default function SpeckleViewer({
  streamId,
  commitId,
  branch = "main",
  style = {}
}) {
  if (!streamId) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black/40 rounded-[14px]">
        <span className="text-gray-400 font-mono">No Speckle Stream ID Provided</span>
      </div>
    );
  }
  let url = `https://latest.speckle.dev/embed?stream=${encodeURIComponent(streamId)}`;
  if (commitId) url += `&commit=${encodeURIComponent(commitId)}`;
  else if (branch) url += `&branch=${encodeURIComponent(branch)}`;

  return (
    <iframe
      src={url}
      title="Speckle 3D Viewer"
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
    />
  );
}
