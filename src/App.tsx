import "./App.css";
import EditorPage from "./components/editor/EditorPage";
import Header from "./components/layout/Header";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <EditorPage />
      </div>
    </ThemeProvider>
  );
}

export default App;
