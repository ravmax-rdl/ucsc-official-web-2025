import { FiSearch, FiX } from "react-icons/fi";

export default function SearchField({ value, onChange }) {
  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className="relative w-full md:w-80"
    >
      <label htmlFor="blog-search" className="sr-only">
        Search posts
      </label>
      <FiSearch
        aria-hidden
        className="absolute left-0 top-1/2 -translate-y-1/2 text-secondary-blue/60"
      />
      <input
        id="blog-search"
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={!onChange}
        placeholder="Search posts"
        autoComplete="off"
        className="peer w-full bg-transparent border-b border-secondary-blue/40 py-2 pl-7 pr-8 text-secondary-blue outline-none placeholder:text-secondary-blue/50 [&::-webkit-search-cancel-button]:appearance-none"
      />
      <span
        aria-hidden
        className="absolute left-0 bottom-0 h-[2px] w-full origin-left scale-x-0 bg-primary-blue motion-safe:transition-transform motion-safe:duration-300 peer-focus:scale-x-100"
      />
      <button
        type="button"
        aria-label="Clear search"
        onClick={() => onChange?.("")}
        tabIndex={value ? 0 : -1}
        className={`absolute right-0 top-1/2 -translate-y-1/2 p-1 text-secondary-blue motion-safe:transition-opacity hover:text-primary-blue ${
          value ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <FiX aria-hidden />
      </button>
    </form>
  );
}
