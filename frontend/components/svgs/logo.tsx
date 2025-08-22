import { cn } from '@/lib/utils';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 161 99"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-6', className)}
    >
      <g clipPath="url(#clip0_23_49)">
        <g filter="url(#filter0_iii_23_49)">
          <path
            d="M1.08594 49.944C1.08594 23.4342 22.5763 1.94391 49.0859 1.94391H112.086C138.596 1.94391 160.086 23.4342 160.086 49.944V97.944H49.0859C22.5763 97.944 1.08594 76.4537 1.08594 49.944Z"
            fill="#FFDD00"
          />
        </g>
        <path
          d="M112.086 19.944H49.0858C32.5174 19.944 19.0859 33.3754 19.0859 49.944C19.0859 66.5124 32.5174 79.944 49.0858 79.944H112.086C128.654 79.944 142.086 66.5124 142.086 49.944C142.086 33.3754 128.654 19.944 112.086 19.944Z"
          fill="white"
        />
        <path
          d="M49.0859 64.944C57.3703 64.944 64.0859 58.228 64.0859 49.944C64.0859 41.6596 57.3703 34.944 49.0859 34.944C40.8019 34.944 34.0859 41.6596 34.0859 49.944C34.0859 58.228 40.8019 64.944 49.0859 64.944Z"
          fill="black"
        />
        <path
          d="M43.0859 46.944C44.7429 46.944 46.0859 45.6007 46.0859 43.944C46.0859 42.287 44.7429 40.944 43.0859 40.944C41.4292 40.944 40.0859 42.287 40.0859 43.944C40.0859 45.6007 41.4292 46.944 43.0859 46.944Z"
          fill="white"
        />
        <path
          d="M115.086 64.944C123.37 64.944 130.086 58.228 130.086 49.944C130.086 41.6596 123.37 34.944 115.086 34.944C106.802 34.944 100.086 41.6596 100.086 49.944C100.086 58.228 106.802 64.944 115.086 64.944Z"
          fill="black"
        />
        <path
          d="M109.086 46.944C110.743 46.944 112.086 45.6007 112.086 43.944C112.086 42.287 110.743 40.944 109.086 40.944C107.429 40.944 106.086 42.287 106.086 43.944C106.086 45.6007 107.429 46.944 109.086 46.944Z"
          fill="#FAFCFF"
        />
      </g>
      <defs>
        <filter
          id="filter0_iii_23_49"
          x="1.08594"
          y="1.94391"
          width="163.8"
          height="100.8"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="4.8" />
          <feGaussianBlur stdDeviation="9.6" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_23_49"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="14.4" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_innerShadow_23_49"
            result="effect2_innerShadow_23_49"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4.8" />
          <feGaussianBlur stdDeviation="9.6" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="effect2_innerShadow_23_49"
            result="effect3_innerShadow_23_49"
          />
        </filter>
        <clipPath id="clip0_23_49">
          <rect
            width="160.8"
            height="98.4"
            fill="white"
            transform="matrix(-1 0 0 1 160.8 0)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
