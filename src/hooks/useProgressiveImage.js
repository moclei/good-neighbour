import React, {useState, useEffect} from "react";

export const useProgressiveImage = (src, onLoadImage) => {
    const [sourceLoaded, setSourceLoaded] = useState(null)

    useEffect(() => {
        const img = new Image()
        img.src = src
        img.onload = () => {
            setSourceLoaded(src);
            onLoadImage();
        }
    }, [src])

    return sourceLoaded
}
