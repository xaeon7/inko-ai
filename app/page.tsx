import Image from "next/image";
import Link from "next/link";

import DemoImage from "@/public/demo.jpg";
import GradientBlobs from "@/components/ui/gradient-blobs";
import { UserButton, auth } from "@clerk/nextjs";

export default function Home() {
  const { userId } = auth();
  const isAuth = !!userId;
  return (
    <main className="w-full h-full p-12 container mx-auto flex gap-28 flex-col">
      <nav className="z-10 flex justify-between">
        <Link href="/" className="font-bold text-4xl">
          InkoAI
        </Link>
        {/* login */}
        <div className="">
          {isAuth ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Link
              href={"/sign-in"}
              className="bg-main text-neutral-900 text-lg font-medium py-2 px-6 rounded-lg duration-200 hover:bg-opacity-95 hover:shadow-2xl hover:shadow-main"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>

      <div className="z-10 flex flex-col gap-12 items-center">
        <span className="text-main/70 tracking-[.6rem] uppercase text-3xl">
          Welcome To InkoAI
        </span>

        <div className="flex flex-col items-center text-center gap-6">
          <h1 className="text-6xl font-bold">
            Your Instant Research Companion
          </h1>

          <p className="max-w-4xl">
            Join the ranks of millions of students, researchers, and
            professionals who&apos;ve discovered the power of InkoAI. Say
            goodbye to research roadblocks and hello to effortless insights with
            our cutting-edge AI technology.
          </p>
        </div>

        <Link
          href="/chat"
          className="text-neutral-900 font-medium text-lg py-3 px-6 rounded-xl bg-neutral-100 duration-200 hover:bg-opacity-95 hover:shadow-2xl hover:shadow-neutral-100"
        >
          Get Started
        </Link>
      </div>

      <div className="relative flex justify-center max-w-7xl mx-auto">
        <GradientBlobs />
        <div className="bg-gradient-to-t from-neutral-900 via-neutral-900/80  z-20 absolute inset-0" />
        <Image
          className="z-10 border-2 border-main rounded-3xl bg-neutral-900"
          src={DemoImage.src}
          alt="InkoAI Demo"
          width={1440}
          height={1024}
        />
      </div>

      <footer className="text-xs text-neutral-200 mx-auto pb-6">
        Developed by{" "}
        <Link
          href="https://github.com/aalaeDev"
          className="underline duration-200 hover:text-neutral-100"
        >
          aalaedev
        </Link>
        . The source code is on{" "}
        <Link
          href="https://github.com/aalaeDev/inko-ai"
          className="underline duration-200 hover:text-neutral-100"
        >
          GitHub
        </Link>
        .
      </footer>
    </main>
  );
}
