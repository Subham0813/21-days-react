import { useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";

const suggestionsList = [
  "js",
  "javascript",
  "ts",
  "typescript",
  "react",
  "tailwiind",
  "css",
];

const debounce = (fn, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(args);
    }, delay);
  };
};

const mySugesstions = ([str, setFn]) => {
  let res = [];
  if (str.length > 0)
    res = suggestionsList.filter((item) =>
      item.startsWith(str.toLowerCase()) ? item : ""
    );
  setFn(res);
};

const getSuggestions = debounce(mySugesstions, 500);

function App() {
  const [inputval, setInputval] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start p-6 bg-gray-100 font-mono">
      <div className="flex items-center gap-2 w-full max-w-md bg-white p-3 shadow rounded-xl">
        <input
          type="text"
          name="searchbar-main"
          id="searchbar-main"
          placeholder="Type to search..."
          value={inputval}
          onChange={(e) => {
            setInputval(e.target.value);
            getSuggestions(e.target.value, setSuggestions);
          }}
          className="flex-1 outline-none text-gray-700 text-lg px-2"
        />
        {inputval ? <button className="text-gray-600 hover:text-gray-800 text-2xl pl-2" onClick={() => setInputval('')}>
            <MdClose/>
        </button>: ''}

        <button className="text-gray-600 hover:text-blue-500 text-2xl pl-2">
          <MdSearch />
        </button>
      </div>

      <div className="w-full max-w-md mt-2 bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer">
        {suggestions.map((item) => (
          <div
            onClick={() => setInputval(item)}
            key={item}
            className="flex justify-between items-center px-4 py-2  last:border-none hover:bg-blue-50 transition"
          >
            <p
              className="text-gray-700 font-medium hover:text-blue-600"
              onClick={() => setInputval(item)}
            >
              {item}
            </p>
            <button
              onClick={() => {
                const r = suggestions.filter((sugg) => item !== sugg);
                setSuggestions(r);
              }}
              className="text-gray-500 hover:text-red-500 text-xl"
            >
              <MdClose />
            </button>
          </div>
        ))}

        {inputval && suggestions.length === 0 && (
          <p className="p-3 text-gray-500 text-center">No suggestions</p>
        )}
      </div>
    </div>
  );
}

export default App;
