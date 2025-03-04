import { useState } from "react";
import {
  Search,
  ChevronDown,
  Github,
  Sun,
  Moon,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface UtilityClass {
  name: string;
  css: string;
  description?: string;
  value?: string;
}

interface Utility {
  name: string;
  description?: string;
  utilities: UtilityClass[];
}

interface Category {
  name: string;
  gradient: string;
  utilities: Utility[];
}

const categories: Category[] = [
  {
    name: "Typography",
    gradient: "from-purple-500 to-indigo-600",
    utilities: [
      {
        name: "font-family",
        utilities: [
          {
            name: ".font-sans",
            css: "font-family: ui-sans-serif, system-ui, sans-serif;",
          },
          {
            name: ".font-serif",
            css: "font-family: ui-serif, Georgia, serif;",
          },
          { name: ".font-mono", css: "font-family: ui-monospace, monospace;" },
        ],
      },
      {
        name: "font-size",
        utilities: [
          { name: ".text-xs", css: "font-size: 0.75rem; line-height: 1rem;" },
          {
            name: ".text-sm",
            css: "font-size: 0.875rem; line-height: 1.25rem;",
          },
          { name: ".text-base", css: "font-size: 1rem; line-height: 1.5rem;" },
          {
            name: ".text-lg",
            css: "font-size: 1.125rem; line-height: 1.75rem;",
          },
          {
            name: ".text-xl",
            css: "font-size: 1.25rem; line-height: 1.75rem;",
          },
        ],
      },
      // Add more typography utilities...
    ],
  },
  {
    name: "Layout",
    gradient: "from-blue-500 to-cyan-500",
    utilities: [
      {
        name: "display",
        utilities: [
          { name: ".block", css: "display: block;" },
          { name: ".inline-block", css: "display: inline-block;" },
          { name: ".inline", css: "display: inline;" },
          { name: ".flex", css: "display: flex;" },
          { name: ".inline-flex", css: "display: inline-flex;" },
          { name: ".table", css: "display: table;" },
          { name: ".grid", css: "display: grid;" },
          { name: ".hidden", css: "display: none;" },
        ],
      },
      {
        name: "position",
        utilities: [
          { name: ".static", css: "position: static;" },
          { name: ".fixed", css: "position: fixed;" },
          { name: ".absolute", css: "position: absolute;" },
          { name: ".relative", css: "position: relative;" },
          { name: ".sticky", css: "position: sticky;" },
        ],
      },
      // Add more layout utilities...
    ],
  },
  {
    name: "Flexbox & Grid",
    gradient: "from-emerald-500 to-teal-500",
    utilities: [
      {
        name: "flex-direction",
        utilities: [
          { name: ".flex-row", css: "flex-direction: row;" },
          { name: ".flex-row-reverse", css: "flex-direction: row-reverse;" },
          { name: ".flex-col", css: "flex-direction: column;" },
          { name: ".flex-col-reverse", css: "flex-direction: column-reverse;" },
        ],
      },
      {
        name: "grid-template-columns",
        utilities: [
          {
            name: ".grid-cols-1",
            css: "grid-template-columns: repeat(1, minmax(0, 1fr));",
          },
          {
            name: ".grid-cols-2",
            css: "grid-template-columns: repeat(2, minmax(0, 1fr));",
          },
          {
            name: ".grid-cols-3",
            css: "grid-template-columns: repeat(3, minmax(0, 1fr));",
          },
          {
            name: ".grid-cols-4",
            css: "grid-template-columns: repeat(4, minmax(0, 1fr));",
          },
        ],
      },
      // Add more flexbox and grid utilities...
    ],
  },
  {
    name: "Spacing",
    gradient: "from-amber-500 to-orange-500",
    utilities: [
      {
        name: "padding",
        utilities: [
          { name: ".p-0", css: "padding: 0px;" },
          { name: ".p-1", css: "padding: 0.25rem;" },
          { name: ".p-2", css: "padding: 0.5rem;" },
          { name: ".p-3", css: "padding: 0.75rem;" },
          { name: ".p-4", css: "padding: 1rem;" },
        ],
      },
      {
        name: "margin",
        utilities: [
          { name: ".m-0", css: "margin: 0px;" },
          { name: ".m-1", css: "margin: 0.25rem;" },
          { name: ".m-2", css: "margin: 0.5rem;" },
          { name: ".m-3", css: "margin: 0.75rem;" },
          { name: ".m-4", css: "margin: 1rem;" },
        ],
      },
      // Add more spacing utilities...
    ],
  },
  {
    name: "Layout",
    gradient: "from-pink-500 to-rose-500",
    utilities: [
      {
        name: "aspect-ratio",
        utilities: [
          { name: ".aspect-[16/9]", css: "aspect-ratio: 16 / 9;" },
          { name: ".aspect-[4/3]", css: "aspect-ratio: 4 / 3;" },
          { name: ".aspect-[1/1]", css: "aspect-ratio: 1 / 1;" },
        ],
      },
    ],
  },
  // Add more categories...
];

export default function Cheatsheet() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      utilities: category.utilities.filter(
        (utility) =>
          utility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          utility.utilities.some((u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      ),
    }))
    .filter((category) => category.utilities.length > 0);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-2 rounded-lg shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-wind"
              >
                <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
                <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
                <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
              </svg>
            </div>
            <div>
              <h1
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Tailwind CSS
              </h1>
              <div className="flex items-center">
                <span
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  v4.0
                </span>
                <span className="mx-2 text-gray-400">•</span>
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Cheatsheet
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/tailwindlabs/tailwindcss"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full transition-colors ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Github size={20} />
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                toggleDarkMode();
                console.log("clicked");
              }}
              className={`rounded-full ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>
        </header>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search
              className={`h-4 w-4 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
          </div>
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
            }`}
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            <kbd
              className={`px-1.5 py-0.5 text-xs rounded ${
                darkMode
                  ? "bg-gray-700 text-gray-400"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.name}
              className={`rounded-xl overflow-hidden shadow-sm ${
                darkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div
                className={`bg-gradient-to-r ${category.gradient} px-4 py-3`}
              >
                <h2 className="text-lg font-semibold text-white">
                  {category.name}
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {category.utilities.map((utility) => (
                  <Collapsible key={utility.name}>
                    <CollapsibleTrigger
                      className={`w-full flex items-center justify-between p-4 text-left ${
                        darkMode
                          ? "hover:bg-gray-700 text-gray-300"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span>{utility.name}</span>
                      <div className="flex items-center gap-2">
                        <a
                          href="#"
                          className={`text-xs px-2 py-1 rounded ${
                            darkMode
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            Docs
                            <ExternalLink className="h-3 w-3" />
                          </span>
                        </a>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div
                        className={`px-4 py-3 text-sm ${
                          darkMode ? "bg-gray-900/50" : "bg-gray-50"
                        }`}
                      >
                        {utility.description && (
                          <p
                            className={`mb-3 ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {utility.description}
                          </p>
                        )}
                        <div className="space-y-2">
                          {utility.utilities.map((util) => (
                            <div
                              key={util.name}
                              className="grid grid-cols-2 gap-4"
                            >
                              <code
                                className={`font-mono text-xs ${
                                  darkMode ? "text-blue-400" : "text-blue-600"
                                }`}
                              >
                                {util.name}
                              </code>
                              <div>
                                <code
                                  className={`font-mono text-xs ${
                                    darkMode ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {util.css}
                                </code>
                                {util.value && (
                                  <span
                                    className={`ml-2 text-xs ${
                                      darkMode
                                        ? "text-gray-500"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {util.value}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
