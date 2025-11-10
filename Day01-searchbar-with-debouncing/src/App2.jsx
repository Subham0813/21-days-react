import { useEffect, useRef, useState } from "react";
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

const getSuggestions = debounce(mySugesstions, 200);

function App() {
  const [inputval, setInputval] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickedOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setSuggestions([]);
      // else getSuggestions(e.target.value, setSuggestions);
    };

    window.document.addEventListener("mousedown", handleClickedOutside);
    return () =>
      window.document.removeEventListener("mousedown", handleClickedOutside);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start p-6 bg-gray-200 font-mono ">
      <div
        className="flex flex-col items-center w-full max-w-md bg-white py-2 shadow rounded-2xl hover:shadow-lg text-xl overflow-hidden"
        ref={wrapperRef}
      >
        <div className="w-full max-w-md flex px-2">
          <button className="text-gray-600 hover:text-blue-500 pl-2">
            <MdSearch />
          </button>
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
            className="flex-1 outline-none text-gray-700 text-lg px-2 w-full"
          />
          {inputval ? (
            <button
              className="text-gray-600 hover:text-gray-800 text-2xl pr-2"
              onClick={() => {
                setInputval("");
              }}
            >
              <MdClose />
            </button>
          ) : (
            ""
          )}
        </div>
        {suggestions.length > 0 && (
          <div className="w-full max-w-md mt-2 cursor-pointer border-t-2 border-gray-200 overflow-hidden">
            {suggestions.map((item) => (
              <div
                key={item}
                className="w-full flex justify-between gap-2 items-center px-4 py-2 last:border-none hover:bg-blue-50 transition overflow-hidden"
              >
                <button className="text-gray-600">
                  <MdSearch />
                </button>
                <p
                  className="w-full text-gray-600 font-medium hover:text-gray-900"
                  onClick={() => setInputval(item)}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
