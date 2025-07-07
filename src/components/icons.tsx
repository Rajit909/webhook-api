import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6L6 18" />
      <path d="M13 6L13 18" />
      <path d="M10 6L6 10" />
      <path d="M18 14L14 18" />
      <path d="M6 6L18 6" />
      <path d="M6 18L18 18" />
    </svg>
  );
}
