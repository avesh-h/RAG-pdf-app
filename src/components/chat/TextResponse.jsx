import ReactMarkdown from "react-markdown";

export function TextResponse({ children }) {
  return (
    <div className="text-sm text-foreground leading-7 space-y-3">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mt-6 mb-3 text-foreground">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mt-5 mb-2 text-foreground border-b border-border pb-1">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold mt-4 mb-2 text-foreground">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-foreground leading-7 my-2">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="my-3 space-y-1.5 ml-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 space-y-1.5 ml-2 list-decimal list-inside">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex gap-2 text-foreground leading-7">
              <span className="text-muted-foreground mt-1.5 flex-shrink-0 text-xs">
                ●
              </span>
              <span>{children}</span>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-muted-foreground">{children}</em>
          ),
          hr: () => <hr className="my-4 border-border" />,
          code: ({ children }) => (
            <code className="bg-muted text-foreground px-1.5 py-0.5 rounded text-xs font-mono">
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary pl-4 my-3 text-muted-foreground italic">
              {children}
            </blockquote>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
