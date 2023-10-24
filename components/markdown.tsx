"use client";
import React from "react";
import Markdown from "react-markdown";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

type MarkdownProps = { markdown?: string; className?: string };

export default function CustomMarkdown({ markdown, className }: MarkdownProps) {
  const syntaxTheme = oneDark;

  return (
    <Markdown
      className={className}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className ?? "");

          return match ? (
            <SyntaxHighlighter
              PreTag="div"
              language={match[1]}
              {...props}
              style={syntaxTheme}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className ? className : ""} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {markdown}
    </Markdown>
  );
}
