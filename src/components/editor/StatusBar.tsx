import { useEffect, useState } from "react";

type Props = {
  markdown: string;
  htmlWordCount?: number;
  htmlCharCount?: number;
  htmlParagraphCount?: number;
  activeMode?: "Markdown" | "HTML";
  cursorPosition?: { line: number; col: number };
};

export default function StatusBar({
  markdown,
  htmlWordCount,
  htmlCharCount,
  htmlParagraphCount,
  activeMode = "Markdown",
  cursorPosition,
}: Props) {
  const [lines, setLines] = useState(0);
  const [words, setWords] = useState(0);
  const [characters, setCharacters] = useState(0);
  const [paragraphs, setParagraphs] = useState(0);

  useEffect(() => {
    const lineCount = markdown.split("\n").length;
    const wordCount = markdown
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const charCount = markdown.length;
    const paragraphCount = markdown
      .split(/\n\s*\n/)
      .filter((paragraph) => paragraph.trim().length > 0).length;

    setLines(lineCount);
    setWords(wordCount);
    setCharacters(charCount);
    setParagraphs(paragraphCount);
  }, [markdown]);

  return (
    <div className="fixed bottom-0 w-full bg-blue-600 text-white text-sm px-4 py-1 flex items-center justify-between font-medium">
      <div className="flex items-center gap-4">
        <span className="">{activeMode}</span>
        <span>
          <b>{words}</b> Words
        </span>
        <span>
          <b>{lines}</b> Lines
        </span>
        <span>
          Line {cursorPosition?.line || 1} Col {cursorPosition?.col || 0}
        </span>
      </div>

      {htmlWordCount !== undefined && (
        <div className="flex items-center gap-4">
          <span className="uppercase tracking-wide">HTML</span>
          <span>
            <b>{htmlWordCount}</b> Words
          </span>
        </div>
      )}
    </div>
  );
}
