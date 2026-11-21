export default function WaveDivider({
  fill = '#F7F7F4',
  accent = '#20C5D8',
}) {
  return (
    <div
      className="pointer-events-none absolute bottom-0 left-0 z-20 w-full overflow-hidden leading-none"
      aria-hidden="true"
    >
      <svg
        className="block h-[65px] w-full sm:h-[85px] lg:h-[110px]"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cyan Wave */}
        <path
          d="M0 75 C240 145 420 20 720 65 C1020 110 1200 145 1440 45 L1440 160 L0 160 Z"
          fill={accent}
          opacity="0.55"
        />

        {/* White Wave */}
        <path
          d="M0 105 C240 45 480 125 720 100 C960 75 1200 30 1440 85 L1440 160 L0 160 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}