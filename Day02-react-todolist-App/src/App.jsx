import { useEffect, useState } from "react";
import {
  FaTrashAlt,
  FaMoon,
  FaSun,
  FaPlus,
  FaEdit,
  FaCheck,
} from "react-icons/fa";

const App = function () {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [inputVal, setInputVal] = useState(
    JSON.parse(localStorage.getItem("input")) || ""
  );
  const [todos, setTodos] = useState(
    JSON.parse(localStorage.getItem("todos")) || []
  );
  const [theme, setTheme] = useState("Dark");
  const [warning, setWarning] = useState("");
  const [editKey, setEditKey] = useState(
    JSON.parse(localStorage.getItem("edit"))?.editKey || ""
  );
  const [editVal, setEditVal] = useState(
    JSON.parse(localStorage.getItem("edit"))?.editVal || ""
  );
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const interval = setTimeout(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  const handleSubmit = (val) => {
    if (val.length > 0) {
      const newTodos = [
        ...todos,
        { key: crypto.randomUUID(), task: val, completed: false },
      ];
      setTodos(newTodos);
      setInputVal("");
      localStorage.setItem("todos", JSON.stringify(newTodos));
      localStorage.removeItem("input");
    } else {
      setWarning("Please type your task before adding..");
    }
  };

  const toggleComplete = (id, isCompleted) => {
    const updated = todos.map((todo) =>
      todo.key === id ? { ...todo, completed: isCompleted } : todo
    );
    setTodos(updated);
    localStorage.setItem("todos", JSON.stringify(updated));
  };
  const toggleSorting = (sortBy) => {
    // const completedTodos = [];
    // const inCompletedTodos = [];

    // todos.forEach((todo) => {
    //   todo.completed ? completedTodos.push(todo) : inCompletedTodos.push(todo);
    // });
    // const sortedTodos =
    // sortBy === 'completed'
    //   ? [...completedTodos, ...inCompletedTodos]
    //   : [...inCompletedTodos, ...completedTodos];

    //memory optimized
    const sorted = [...todos];
    sorted.sort((a, b) =>
      sortBy === "completed"
        ? Number(b.completed) - Number(a.completed)
        : Number(a.completed) - Number(b.completed)
    );

    setTodos(sorted);
    setSortBy(sortBy);
    localStorage.setItem("todos", JSON.stringify(sorted));
  };

  const handleEdit = (key, newTask) => {
    if (newTask.length < 0) {
      setWarning("Please type your task before adding..");
      return;
    }
    const index = todos.findIndex((todo) => todo.key === key);
    todos[index].task = newTask;
    setTodos(todos);
    setEditKey("");
    setEditVal("");

    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.removeItem("edit");
  };

  const handleDelete = (key) => {
    const remainingTodos = todos.filter((todo) => todo.key !== key);
    setTodos(remainingTodos);
    localStorage.setItem("todos", JSON.stringify(remainingTodos));
  };

  const handleReset = () => {
    setTodos([]);
    setWarning("");
    setEditKey("");
    setEditVal("");
    setInputVal("");
    localStorage.clear();
  };

  const isDark = theme === "Dark";

  return (
    <main
      className={`flex min-h-screen flex-col p-6 max-sm:p-2 font-mono transition-all ${isDark ? "bg-dark-bg text-dark-text" : "bg-light-bg text-light-text sm:text-sm"} `}
    >
      <header className="mb-4 flex items-center justify-between">
        <p className="text-xl font-bold sm:font-medium">{time}</p>

        <h1 className="text-3xl font-bold">TodoList</h1>

        <div className="flex gap-2">
          <button
            type="reset"
            title="Delete all tasks"
            onClick={handleReset}
            className={`rounded-xl border px-3 py-2 ${isDark ? "border-dark-text" : "border-light-text"} `}
          >
            <FaTrashAlt />
          </button>

          <button
            title="toggle theme"
            onClick={() => setTheme(isDark ? "Light" : "Dark")}
            className={`rounded-xl border px-3 py-2 ${isDark ? "border-dark-text" : "border-light-text"} `}
          >
            {isDark ? <FaMoon /> : <FaSun />}
          </button>
        </div>
      </header>

      <section className="input">
        <p className="text-orange-500"> {warning} </p>
        <div className="mb-4 flex gap-3">
          <input
            type="text"
            maxLength={50}
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setWarning("");
              setEditKey("");
              setEditVal("");
              localStorage.setItem("input", JSON.stringify(e.target.value));
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") handleSubmit(inputVal);
            }}
            placeholder="Add task..."
            className={`flex-1 rounded border p-2 outline-none ${
              isDark
                ? "bg-dark-primary text-dark-text border-dark-secondary"
                : "border-light-secondary bg-white text-black"
            } `}
          />
          <button
            type="submit"
            onClick={() => handleSubmit(inputVal)}
            className={`rounded-xl border px-4 py-2 font-semibold ${isDark ? "bg-dark-secondary" : "bg-light-secondary text-white"} `}
          >
            <FaPlus />
          </button>
        </div>
      </section>

      <section className="content">
        {todos.length ? (
          <div className="flex gap-2 py-2">
            Sort By:{" "}
            <button
              onClick={() =>
                toggleSorting(
                  sortBy === "default" || sortBy === "incompleted"
                    ? "completed"
                    : "incompleted"
                )
              }
              className={`rounded-2xl border px-3 transition hover:opacity-75 ${
                isDark
                  ? "border-dark-text text-dark-text"
                  : "border-light-text text-light-text"
              }`}
            >
              {sortBy}
            </button>
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          {todos.map(({ key, task, completed }) => (
            <div
              key={key}
              className={`flex items-center justify-between gap-3 rounded border p-2 ${
                isDark ? "bg-dark-primary" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked={completed === true}
                  onClick={() => {
                    toggleComplete(key, !completed);
                    setEditKey("");
                  }}
                  className="h-5 w-5"
                />
                {editKey === key ? (
                  <input
                    type="text"
                    maxLength={50}
                    value={editVal}
                    onChange={(e) => {
                      setEditVal(e.target.value);
                      setWarning("");
                      localStorage.setItem(
                        "edit",
                        JSON.stringify({ editKey, editVal: e.target.value })
                      );
                    }}
                    placeholder="Add task..."
                    className={`flex-1 rounded border p-2 outline-none ${
                      isDark
                        ? "bg-dark-primary text-dark-text border-dark-secondary"
                        : "border-light-secondary bg-white text-black"
                    } `}
                  />
                ) : (
                  <p
                    className={`text-lg ${completed ? "line-through opacity-60" : ""}`}
                  >
                    {task}
                  </p>
                )}
              </div>

              <span className="flex gap-2 max-sm:flex-col">
                <button
                  title="Edit task"
                  onClick={
                    editKey === key
                      ? () => handleEdit(editKey, editVal)
                      : () => {
                          setEditKey(key);
                          setEditVal(task);
                        }
                  }
                  className={`rounded-lg border px-3 py-2 transition hover:opacity-75 ${
                    isDark
                      ? "border-dark-text text-dark-text"
                      : "border-light-text text-light-text"
                  }`}
                >
                  {editKey === key ? <FaCheck /> : <FaEdit />}
                </button>
                <button
                  title="Delete task"
                  onClick={() => handleDelete(key)}
                  className={`rounded-lg border px-3 py-2 transition hover:opacity-75 ${
                    isDark
                      ? "border-dark-text text-dark-text"
                      : "border-light-text text-light-text"
                  }`}
                >
                  <FaTrashAlt />
                </button>
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer
        className={`mt-auto pt-4 pb-3 text-center text-sm tracking-wide shadow-inner ${isDark ? "bg-dark-bg/60 border-dark-secondary border-t" : "bg-light-bg/60 border-light-secondary border-t"}`}
      >
        <p className="">Design & Developed /w 💖 by Subham</p>
      </footer>
    </main>
  );
};

export default App;
