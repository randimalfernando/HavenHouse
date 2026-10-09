"use client";

import { useState } from "react";
import Image from "next/image";
import ImagePlaceholder from "@/components/ImagePlaceholder";

export default function ServiceCardImage({ slug, alt, ratio = "wide" }) {
  const [errored, setErrored] = useState(false);
  const src = `/images/services/${slug}.jpg`;

  if (errored) {
    return <ImagePlaceholder label={alt} ratio={ratio} />;
  }

  return (
    <div className={`service-photo service-photo--${ratio}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"
        style={{ objectFit: "cover" }}
        onError={() => setErrored(true)}
      />
    </div>
  );
}