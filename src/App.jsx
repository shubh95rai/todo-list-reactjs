import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useEffect, useState, useRef } from "react";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "" });

  const editObj = useRef();

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");

    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      showAlert();
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [todos]);

  function handleInputChange(e) {
    setInputValue(e.target.value);
  }

  function handleDelete(index) {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
    setInputValue("");
    showAlert(true, "item deleted");
    editObj.current.focus();
  }

  function handleClearList() {
    setTodos([]);
    showAlert(true, "list cleared");
    editObj.current.focus();
  }

  function handleEditItem(index) {
    setEditIndex(index);
    setInputValue(todos[index]);
    editObj.current.focus();
  }

  function showAlert(show = false, msg = "") {
    setAlert({ show, msg });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (inputValue !== "" && editIndex === null) {
      setTodos([...todos, inputValue]);
      setInputValue("");
      showAlert(true, "item added");
      editObj.current.focus();
    } else if (editIndex !== null) {
      const newTodos = [...todos];
      newTodos[editIndex] = inputValue;
      setTodos(newTodos);
      setInputValue("");
      setEditIndex(null);
      showAlert(true, "item changed");
      editObj.current.focus();
    }
  }

  return (
    <div
      className="font-inter min-h-screen text-slate-600 flex justify-center items-start py-20 bg-slate-200 select-none px-4"
      spellCheck="false"
    >
      <main className="bg-white p-8 rounded flex flex-col gap-4 items-center shadow-lg  md:max-w-2xl max-w-xl  w-full">
        <div className="w-full h-7">
          {alert.show && (
            <p className="bg-slate-200 text-slate-600 py-1 rounded w-full text-center capitalize tracking-widest text-sm font-medium">
              {alert.msg}
            </p>
          )}
        </div>

        <h1 className="text-4xl font-semibold tracking-tighter">Todo List</h1>

        <form
          className="flex gap-2 bg-slate-200 p-2 rounded w-full"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="bg-slate-200 w-full outline-none px-4"
            value={inputValue}
            onChange={handleInputChange}
            autoFocus
            ref={editObj}
          />
          <button
            type="submit"
            className="py-2 px-4 rounded bg-slate-600 text-slate-200 hover:bg-slate-700 transition-all duration-300"
          >
            Submit
          </button>
        </form>
        <ul className="text-lg w-full px-2 flex flex-col gap-2">
          {todos.map((todo, index) => {
            return (
              <li
                key={index}
                className="text-lg flex items-center justify-between gap-4 border-b pb-2"
              >
                <h1 className="break-all">{todo}</h1>
                <div className="flex text-2xl gap-1">
                  <BiSolidEdit
                    className="hover:text-slate-700 transition-all cursor-pointer"
                    onClick={() => {
                      handleEditItem(index);
                    }}
                  />
                  <MdDelete
                    className="hover:text-slate-700 transition-all cursor-pointer"
                    onClick={() => {
                      handleDelete(index);
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
        <div className="h-7 mt-2">
          {todos.length !== 0 && (
            <button
              type="button"
              className="border border-slate-600 font-medium px-4 py-1 rounded text-sm"
              onClick={handleClearList}
            >
              Clear List
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
