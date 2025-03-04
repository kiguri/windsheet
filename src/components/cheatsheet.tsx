import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Search,
  ChevronDown,
  Github,
  Sun,
  Moon,
  ExternalLink,
} from "lucide-react";
import debounce from "lodash.debounce";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import tailwindData from "../../tailwind-v4.json";

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

// Function to map tailwind data to our category structure
const mapTailwindData = () => {
  // Color gradients for different categories
  const gradients = {
    Layout: "from-blue-500 to-cyan-500",
    "Flexbox & Grid": "from-emerald-500 to-teal-500",
    Spacing: "from-amber-500 to-orange-500",
    Sizing: "from-pink-500 to-rose-500",
    Typography: "from-purple-500 to-indigo-600",
    Backgrounds: "from-red-500 to-orange-500",
    Borders: "from-indigo-500 to-blue-500",
    Effects: "from-yellow-500 to-amber-500",
    Filters: "from-green-500 to-emerald-500",
    Tables: "from-violet-500 to-purple-500",
    "Transitions & Animation": "from-fuchsia-500 to-pink-500",
    Transforms: "from-sky-500 to-blue-500",
    Interactivity: "from-lime-500 to-green-500",
    SVG: "from-amber-500 to-yellow-500",
    Accessibility: "from-gray-500 to-slate-500",
  };

  // Start from index 3 (Layout category) in the tailwindData array
  return tailwindData
    .slice(3)
    .map((category) => {
      // For each utility in the category, extract the needed information
      const utilities = category.children
        .filter(
          (utility) =>
            utility.table &&
            Array.isArray(utility.table) &&
            utility.table.length > 0
        )
        .map((utility) => {
          return {
            name: utility.title,
            description: utility.description,
            utilities: utility.table
              .filter((item) => item && (item.class || item.properties))
              .map((item) => {
                // Get the CSS properties or value
                const css = item.properties || "";
                // Create a class name from the item.class if available
                const name = item.class || `.${utility.title}`;
                // Get the additional comment/value if available
                const value = item.value || "";

                return {
                  name,
                  css,
                  value,
                };
              })
              .filter((item) => item.css !== ""), // Filter out empty CSS values
          };
        })
        .filter((utility) => utility.utilities && utility.utilities.length > 0); // Filter out utilities without any classes

      return {
        name: category.title,
        gradient:
          gradients[category.title as keyof typeof gradients] ||
          "from-gray-500 to-gray-700",
        utilities: utilities,
      };
    })
    .filter((category) => category.utilities.length > 0); // Filter out empty categories
};

// Generate categories from the tailwind data - this only runs once
const categories: Category[] = mapTailwindData();

// Create a search index for faster lookups
const createSearchIndex = () => {
  const index = new Map();

  categories.forEach((category) => {
    category.utilities.forEach((utility) => {
      // Index utility name
      const utilityKey = (utility.name + utility.description).toLowerCase();
      index.set(utilityKey, {
        categoryName: category.name,
        utilityId: utility.name + utility.description,
      });

      // Index each class
      utility.utilities.forEach((utilClass) => {
        const className = utilClass.name.toLowerCase();
        const cssProp = utilClass.css.toLowerCase();

        if (!index.has(className)) {
          index.set(className, {
            categoryName: category.name,
            utilityId: utility.name + utility.description,
          });
        }

        if (!index.has(cssProp)) {
          index.set(cssProp, {
            categoryName: category.name,
            utilityId: utility.name + utility.description,
          });
        }
      });
    });
  });

  return index;
};

export default function Cheatsheet() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [expandedUtilities, setExpandedUtilities] = useState<Set<string>>(
    new Set()
  );

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault(); // Prevent browser default behavior
        searchInputRef.current?.focus(); // Focus on search input
      }
    }

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Create search index once on component mount
  const searchIndex = useMemo(() => createSearchIndex(), []);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setDebouncedSearchTerm(term);
    }, 150),
    []
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Calculate filtered categories based on search term - use memoization
  const filteredCategories = useMemo(() => {
    if (!debouncedSearchTerm) {
      return categories;
    }

    const term = debouncedSearchTerm.toLowerCase();

    return categories
      .map((category) => ({
        ...category,
        utilities: category.utilities.filter((utility) => {
          // Check utility name
          if (utility.name.toLowerCase().includes(term)) {
            return true;
          }

          // Check utility classes
          return utility.utilities.some(
            (u) =>
              u.name.toLowerCase().includes(term) ||
              u.css.toLowerCase().includes(term)
          );
        }),
      }))
      .filter((category) => category.utilities.length > 0);
  }, [debouncedSearchTerm]);

  // Track which collapsible items should be expanded based on search term
  useEffect(() => {
    if (!debouncedSearchTerm) {
      // If search is cleared, collapse everything
      setExpandedUtilities(new Set());
      return;
    }

    // Use the search index for faster lookups
    const newExpandedSet = new Set<string>();
    const term = debouncedSearchTerm.toLowerCase();

    // Check each entry in the search index
    for (const [key, data] of searchIndex.entries()) {
      if (key.includes(term)) {
        newExpandedSet.add(data.utilityId);
      }
    }

    setExpandedUtilities(newExpandedSet);
  }, [debouncedSearchTerm, searchIndex]);

  // Handle toggling a single collapsible item
  const toggleUtility = useCallback((utilityId: string) => {
    setExpandedUtilities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(utilityId)) {
        newSet.delete(utilityId);
      } else {
        newSet.add(utilityId);
      }
      return newSet;
    });
  }, []);

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
              href="https://github.com/kiguri/windsheet"
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
              onClick={toggleDarkMode}
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

        {/* Search - updated with optimized handler */}
        <div className="relative max-w-md mx-auto mb-8">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search
              className={`h-4 w-4 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
          </div>
          <Input
            ref={searchInputRef} // Add ref to input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
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

        {/* Categories Grid - optimized rendering */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-auto gap-6">
          {filteredCategories.map((category) => {
            // Calculate approximate height based on number of utilities
            const height = Math.min(
              Math.max(2, Math.ceil(category.utilities.length / 3)),
              6
            );

            return (
              <div
                key={category.name}
                className={`rounded-xl overflow-hidden shadow-sm ${
                  darkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-200"
                }`}
                style={{
                  gridRow: `span ${height}`,
                }}
              >
                <div
                  className={`bg-gradient-to-r ${category.gradient} px-3 py-2`}
                >
                  <h2 className="text-base font-semibold text-white">
                    {category.name}
                  </h2>
                </div>
                <ScrollArea
                  className="h-[calc(100%-2.5rem)]"
                  scrollHideDelay={100}
                >
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {category.utilities.map((utility) => {
                      const utilityId = utility.name + utility.description;
                      const isExpanded = expandedUtilities.has(utilityId);

                      return (
                        <Collapsible
                          key={utilityId}
                          open={isExpanded}
                          onOpenChange={() => toggleUtility(utilityId)}
                        >
                          <CollapsibleTrigger
                            className={`w-full flex items-center justify-between px-3 py-1 text-left text-sm ${
                              darkMode
                                ? "hover:bg-gray-700 text-gray-300"
                                : "hover:bg-gray-50 text-gray-700"
                            } ${
                              isExpanded ? "bg-gray-50 dark:bg-gray-700" : ""
                            }`}
                          >
                            <span>{utility.name}</span>
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`https://tailwindcss.com/docs/${utility.name
                                  .toLowerCase()
                                  .replace(/ /g, "-")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-xs px-1.5 py-0.5 rounded ${
                                  darkMode
                                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span className="flex items-center gap-1">
                                  Docs
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </span>
                              </a>
                              <ChevronDown
                                className={`h-3.5 w-3.5 transition-transform ${
                                  isExpanded ? "transform rotate-180" : ""
                                }`}
                              />
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div
                              className={`px-3 py-2 text-xs ${
                                darkMode ? "bg-gray-900/50" : "bg-gray-50"
                              }`}
                            >
                              {utility.description && (
                                <p
                                  className={`mb-2 ${
                                    darkMode ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {utility.description}
                                </p>
                              )}
                              <div className="space-y-1.5">
                                {utility.utilities
                                  .slice(0, 10)
                                  .map((util, idx) => (
                                    <div
                                      key={idx}
                                      className={`grid grid-cols-2 gap-2 ${
                                        debouncedSearchTerm &&
                                        (util.name
                                          .toLowerCase()
                                          .includes(
                                            debouncedSearchTerm.toLowerCase()
                                          ) ||
                                          util.css
                                            .toLowerCase()
                                            .includes(
                                              debouncedSearchTerm.toLowerCase()
                                            ))
                                          ? "bg-yellow-100/20 rounded px-1 -mx-1 dark:bg-yellow-900/20"
                                          : ""
                                      }`}
                                    >
                                      <code
                                        className={`font-mono text-xs ${
                                          darkMode
                                            ? "text-blue-400"
                                            : "text-blue-600"
                                        }`}
                                      >
                                        {util.name}
                                      </code>
                                      <div>
                                        <code
                                          className={`font-mono text-xs ${
                                            darkMode
                                              ? "text-gray-400"
                                              : "text-gray-600"
                                          }`}
                                        >
                                          {util.css}
                                        </code>
                                        {util.value && (
                                          <span
                                            className={`ml-1.5 text-xs ${
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
                                {utility.utilities.length > 10 && (
                                  <p
                                    className={`text-center text-xs italic mt-1.5 ${
                                      darkMode
                                        ? "text-gray-500"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    + {utility.utilities.length - 10} more
                                    classes
                                  </p>
                                )}
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
