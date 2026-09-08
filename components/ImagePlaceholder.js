// A visible, honest placeholder for where real photography should go.
// Swap the parent element for a real <img> or next/image once Haven
// House supplies approved photos — this is deliberately plain so it's
// never mistaken for finished content.

export default function ImagePlaceholder({ label = "Image placeholder", ratio = "wide" }) {
  const ratioClass = `image-placeholder--${ratio}`;

  return (
    <div className={`image-placeholder ${ratioClass}`} role="img" aria-label={label}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M21 16l-5.5-5.5a2 2 0 0 0-2.8 0L3 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span>{label}</span>
    </div>
  );
}
