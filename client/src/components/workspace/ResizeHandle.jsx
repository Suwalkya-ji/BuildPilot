import { useState, useCallback, useRef } from "react";

/**
 * A simple drag-to-resize divider.
 * direction: "horizontal" (left-right) | "vertical" (top-bottom)
 * onResize: (deltaPercent) => void
 */
const ResizeHandle = ({ direction = "horizontal", onResize }) => {
  const dragging = useRef(false);
  const lastPos = useRef(0);

  const onMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      dragging.current = true;
      lastPos.current = direction === "horizontal" ? e.clientX : e.clientY;

      const onMove = (ev) => {
        if (!dragging.current) return;
        const curr = direction === "horizontal" ? ev.clientX : ev.clientY;
        const delta = curr - lastPos.current;
        lastPos.current = curr;
        onResize(delta);
      };

      const onUp = () => {
        dragging.current = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [direction, onResize]
  );

  const isH = direction === "horizontal";

  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        flexShrink: 0,
        width: isH ? "4px" : "100%",
        height: isH ? "100%" : "4px",
        background: "rgba(255,255,255,0.07)",
        cursor: isH ? "col-resize" : "row-resize",
        transition: "background 0.15s",
        position: "relative",
        zIndex: 10,
      }}
      className="group"
    >
      {/* Glowing grip line on hover */}
      <div
        style={{
          position: "absolute",
          background: "rgba(34,211,238,0)",
          transition: "background 0.15s",
          ...(isH
            ? { top: 0, bottom: 0, left: 0, right: 0 }
            : { top: 0, bottom: 0, left: 0, right: 0 }),
        }}
        className="group-hover:!bg-cyan-400/50"
      />
    </div>
  );
};

export default ResizeHandle;
