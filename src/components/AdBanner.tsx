"use client";
import { useEffect, useRef } from "react";

interface AdBannerProps {
  id: string;
  width: number;
  height: number;
  format?: string;
}

export default function AdBanner({ id, width, height, format = "iframe" }: AdBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.hasChildNodes()) {
      const conf = document.createElement("script");
      const script = document.createElement("script");
      
      script.type = "text/javascript";
      script.src = `https://bancadeltempoidea.org/22/${id}`;
      
      conf.type = "text/javascript";
      conf.innerHTML = `atOptions = {
        'key' : '${id}',
        'format' : '${format}',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };`;

      bannerRef.current.append(conf);
      bannerRef.current.append(script);
    }
  }, [id, width, height, format]);

  return (
    <div 
      ref={bannerRef} 
      className="flex justify-center items-center w-full mx-auto my-4 overflow-hidden"
      style={{ minHeight: height }}
    ></div>
  );
}
