import { useState, useEffect } from "react";
import { EditorView } from "@codemirror/view";
import Editor from "./Editor";
import Preview from "./Preview";
import StatusBar from "./StatusBar";
import FloatingThemeToggle from "../layout/FloatingThemeToggle";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

export default function EditorPage() {
  const [markdown, setMarkdown] = useState("# Hello Markdown ✨");
  const [view, setView] = useState<EditorView | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 0 });
  const [htmlWordCount, setHtmlWordCount] = useState(0);
  const [htmlCharCount, setHtmlCharCount] = useState(0);
  const [htmlParagraphCount, setHtmlParagraphCount] = useState(0);

  // Function to calculate HTML metrics
  const calculateHtmlMetrics = async (markdownText: string) => {
    try {
      // Create a temporary div to render the markdown
      const tempDiv = document.createElement('div');
      
      // Use ReactMarkdown to render the markdown to HTML
      const { renderToString } = await import('react-dom/server');
      const htmlString = renderToString(
        ReactMarkdown({
          children: markdownText,
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [rehypeKatex, rehypeHighlight],
        })
      );
      
      // Set the HTML content
      tempDiv.innerHTML = htmlString;
      
      // Get text content and calculate metrics
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      const wordCount = textContent
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      const charCount = textContent.length;
      const paragraphCount = tempDiv.querySelectorAll('p').length;
      
      setHtmlWordCount(wordCount);
      setHtmlCharCount(charCount);
      setHtmlParagraphCount(paragraphCount);
    } catch (error) {
      console.error('Error calculating HTML metrics:', error);
      setHtmlWordCount(0);
      setHtmlCharCount(0);
      setHtmlParagraphCount(0);
    }
  };

  // Update HTML metrics when markdown changes
  useEffect(() => {
    calculateHtmlMetrics(markdown);
  }, [markdown]);

  return (
    <div className="flex flex-col h-screen min-h-0 border-r">
      {/* <Toolbar view={view} /> */}
      <div className="flex flex-1">
        <div className="flex-1 border-r">
          <Editor
            value={markdown}
            onChange={setMarkdown}
            onViewReady={setView}
            onCursorChange={(line, col) => setCursorPosition({ line, col })}
          />
        </div>
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          {/* Preview */}
          <Preview markdown={markdown} />
        </div>
      </div>
      <StatusBar
        markdown={markdown}
        activeMode="Markdown"
        cursorPosition={cursorPosition}
        htmlWordCount={htmlWordCount}
        htmlCharCount={htmlCharCount}
        htmlParagraphCount={htmlParagraphCount}
      />
      <FloatingThemeToggle />
    </div>
  );
}
