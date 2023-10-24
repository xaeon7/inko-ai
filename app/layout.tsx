import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/providers";
import Thumbnail from "@/public/thumbnail.jpg";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "InkoAI",
    template: "%s | InkoAI",
  },
  description:
    "Join the ranks of millions of students, researchers, and professionals who've discovered the power of InkoAI. Say goodbye to research roadblocks and hello to effortless insights with our cutting-edge AI technology.",
  openGraph: {
    title: {
      default: "InkoAI",
      template: "%s | InkoAI",
    },
    description:
      "Join the ranks of millions of students, researchers, and professionals who've discovered the power of InkoAI. Say goodbye to research roadblocks and hello to effortless insights with our cutting-edge AI technology.",
    url: "https://chat.x7.lol",
    siteName: "Next.js",
    images: [
      {
        url: Thumbnail.src,
        width: 1200,
        height: 630,
        alt: "InkoAI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "inkoAI",
    description:
      "Join the ranks of millions of students, researchers, and professionals who've discovered the power of InkoAI. Say goodbye to research roadblocks and hello to effortless insights with our cutting-edge AI technology.",
    creator: "@aalaeDev",
    images: [
      {
        url: Thumbnail.src,
        width: 1200,
        height: 630,
        alt: "InkoAI",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <Providers>
        <html lang="en">
          <body className={inter.className}>
            {children}
            <Toaster position="bottom-center" />
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
