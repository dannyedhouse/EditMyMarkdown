import GitHubCorner from "./GitHubCorner";

export default function Header() {
  return (
    <header
      className="w-full flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 relative"
      style={{ backgroundColor: "var(--primary-blue)" }}
    >
      <a href="/">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <img
            src="./logo.png"
            alt="EditMyMarkdown logo"
            className="w-6 h-6 sm:w-8 sm:h-8"
          />
          <h1
            className="text-white text-lg sm:text-xl font-extrabold"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 800,
            }}
          >
            EditMyMarkdown
          </h1>
        </div>
      </a>
      
      <GitHubCorner />
    </header>
  );
}
