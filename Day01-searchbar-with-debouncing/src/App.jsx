import { useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import "./App.css";

const suggestions = [
  "js",
  "javascript",
  "ts",
  "typescript",
  "react",
  "tailwiind",
  "css",
];

const debounce  = (fn, delay) => {
  let timer;
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(args)
    }, delay);
  }
}

const mySugesstions = ([str, setFn]) => {
  let res = []
  if(str.length > 0) res = suggestions.filter((item) => (item.startsWith(str) ? item : ""));
  setFn(res)
};
  
const getSuggestions = debounce(mySugesstions, 500);
  

function App() {
  const [inputval, setInputval] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  
  return (
    <>
      <input
        type="text"
        name="searchbar-main"
        id="searchbar-main"
        placeholder="type to search..."
        value={inputval}
        onChange={(e) => {
          setInputval(e.target.value);
          getSuggestions(e.target.value,setSuggestions);
        }}
      />
      <button>
        <MdSearch />
      </button>
      <div className="suggestions">
      {suggestions.map((item) => 
        <div key={item} className="suggestion">
          <p 
          onClick={() => setInputval(item)}
          >{item}</p>
          <button onClick={() =>{
            const r = suggestions.filter((sugg)=> item !== sugg)
            setSuggestions(r)
          }}><MdClose/></button>
        </div>
      )}
      </div>
    </>
  );
}

export default App;
