import { useCallback, useRef } from "react"
import CodeMirror, { ViewUpdate, type ReactCodeMirrorRef } from "@uiw/react-codemirror"
import { markdown } from "@codemirror/lang-markdown"
import { oneDark } from "@codemirror/theme-one-dark"
import { EditorView, keymap } from "@codemirror/view"
import { history, redo, undo } from "@codemirror/commands"
import { EditorState } from "@codemirror/state"
import { useTheme } from "../../contexts/ThemeContext"

// import { customKeymap } from "@/lib/editorKeymap" // optional, from your tools config

type EditorProps = {
  value: string
  onChange: (value: string) => void
  onViewReady?: (view: EditorView) => void // for toolbar integration
  onCursorChange?: (line: number, col: number) => void
}

export default function Editor({ value, onChange, onViewReady, onCursorChange }: EditorProps) {
  const editorRef = useRef<ReactCodeMirrorRef>(null)
  const { theme } = useTheme()

  const handleChange = useCallback(
    (val: string, update: ViewUpdate) => {
      onChange(val)
    },
    [onChange]
  )

  const handleUpdate = useCallback(
    (update: ViewUpdate) => {
      // Track cursor position changes on any update (typing, clicking, arrow keys, etc.)
      if (onCursorChange && update.selectionSet) {
        const { main } = update.state.selection
        const line = update.state.doc.lineAt(main.head).number
        const col = main.head - update.state.doc.lineAt(main.head).from
        onCursorChange(line, col)
      }
    },
    [onCursorChange]
  )

  const handleCreateEditor = useCallback((view: EditorView) => {
    onViewReady?.(view)
  }, [onViewReady])

  return (
    <div className={`h-full w-full ${
      theme === 'dark' 
        ? 'bg-gray-900' 
        : 'bg-white'
    }`}>
      <CodeMirror
        ref={editorRef}
        value={value}
        height="100%"
        theme={theme === 'dark' ? oneDark : undefined}
        extensions={[
          markdown(),
          history(),
          keymap.of([
            { key: "Mod-z", run: undo },
            { key: "Mod-Shift-z", run: redo },
            // Include your custom keymap extension if defined
            // ...(customKeymap ? customKeymap : []),
          ]),
        ]}
        onChange={handleChange}
        onUpdate={handleUpdate}
        onCreateEditor={handleCreateEditor}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          foldGutter: true,
        }}
        className={`h-full w-full border-0 rounded-none [&_.cm-scroller]:overflow-auto [&_.cm-editor]:h-full ${
          theme === 'dark' 
            ? '[&_.cm-editor]:bg-gray-900 [&_.cm-focused]:outline-none' 
            : ''
        }`}
      />
    </div>
  )
}
