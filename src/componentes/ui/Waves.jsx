/* ===== Ondas (mismo estilo que Academy) ===== */
export function WaveToLight({ className = "" }) {
  return (
    <div aria-hidden className={`relative ${className}`}>
      <svg
        className="block w-full h-20 -scale-y-100 translate-y-[1px]"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0V46.29c47.79,22,103.59,29,158,17.39C256,41,312,2,376,1.5S512,39,576,55.5s128,17,192-5,128-71,192-44,128,101,240,114V0Z"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
}

export function WaveToDark({ className = "" }) {
  return (
    <div aria-hidden className={`relative ${className}`}>
      <svg
        className="block w-full h-16 -scale-y-100 translate-y-[1px]"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
      >
        <path
          d="M1200,0V16c-61,13-122,40-183,47S792,47,713,47,550,84,471,99,315,109,236,88,77,25,0,16V0Z"
          fill="#0A1628"
        />
      </svg>
    </div>
  );
}
