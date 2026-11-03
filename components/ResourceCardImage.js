"use client";

import { useState } from "react";
import Image from "next/image";
import ImagePlaceholder from "@/components/ImagePlaceholder";

const IMAGES = {
  "getting-started-with-haven-house": "/images/resources/getting-started.jpg",
  "other-emergency-and-support-contacts": "/images/resources/emergency-contacts.jpg",
  "understanding-ndis-basics": "/images/resources/ndis-basics.jpg",
};

export default function ResourceCardImage({ slug, alt, ratio = "wide" }) {
  const [errored, setErrored] = useState(false);
  const src = IMAGES[slug];

  if (!src || errored) {
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