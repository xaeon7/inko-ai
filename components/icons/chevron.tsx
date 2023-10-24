function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19.82 21.18L10.66 12L19.82 2.82L17 0L5 12L17 24L19.82 21.18Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.18 2.82L13.34 12L4.18 21.18L7 24L19 12L7 0L4.18 2.82Z"
        fill="currentColor"
      />
    </svg>
  );
}

export { ChevronLeft, ChevronRight };
