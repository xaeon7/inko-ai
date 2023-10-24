export default function GradientBlobs() {
  return (
    <>
      <div className="z-0 absolute bottom-72 left-1/4 w-[800px] h-[800px] bg-main/30 rounded-full filter blur-[120px] opacity-70 animate-blob" />
      <div className="z-0 absolute bottom-72 left-20 w-[800px] h-[800px] bg-main/30 rounded-full filter blur-[120px] opacity-70 animate-blob animation-delay-2000" />
      <div className="z-0 absolute bottom-72 right-20 w-[800px] h-[800px] bg-main/30 rounded-full filter blur-[120px] opacity-70 animate-blob animation-delay-4000" />
    </>
  );
}
