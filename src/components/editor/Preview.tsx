import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github.css";
import { useTheme } from "../../contexts/ThemeContext";

export default function Preview({ markdown }: { markdown: string }) {
  const { theme } = useTheme();
  
  return (
    <div className={`h-full overflow-auto p-6 prose max-w-none ${
      theme === 'dark' 
        ? 'bg-gray-800 text-gray-100 prose-invert prose-gray' 
        : 'bg-gray-50 text-gray-800 prose-slate'
    }`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
