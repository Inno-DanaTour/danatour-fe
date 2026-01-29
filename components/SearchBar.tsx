import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
        <Search size={20} />
      </div>
      <input
        type="text"
        placeholder="Search for your next adventure in Da Nang..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="input pl-12 py-4 bg-white shadow-sm border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary w-full text-lg"
      />
    </div>
  );
};

export default SearchBar;
