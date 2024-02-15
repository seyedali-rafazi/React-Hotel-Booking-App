import React, { useEffect } from "react";

export default function useOutsideClick(ref, exeptionId, cb) {
  useEffect(() => {
    function handleOutsideClick(event) {
      if (ref.current && !ref.current.contains(event.target) && event.target.id !== exeptionId) {
        cb();
      }
    }
    console.log(ref);

    document.addEventListener("mousedown", handleOutsideClick);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [ref.current, exeptionId, cb]);
}
