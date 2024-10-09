import React, { useState, useEffect } from "react";
import axios from "axios";
import deletee from "../Assets/delete.png";
import "../Styles/pagination.css";
import "../Styles/form.css";
import "../Styles/todos.css";
import "../Styles/search.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import TodoSearch from "../Components/TodoSearch"; 
import TodoModal from "../Modals/TodoModal"; 

function TodoPage() {
  const [newTodo, setNewTodo] = useState("");
  const [Todos, setTodo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 9; 
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState(null); 

  const nPages = Math.ceil(totalRecords / recordsPerPage);

  const goToNextPage = () => {
    if (currentPage < nPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const createTodo = async () => {
    try {
      const todosResponse = await axios.get('https://dummyjson.com/todos'); 
      const lastTodo = todosResponse.data.todos[0];
      const nextId = lastTodo.id + 1;

      const response = await axios.post(`https://dummyjson.com/todos/add`, {
        id: nextId,
        todo: newTodo,
        completed: false,
        userId: 4
      });

      const addedTodo = response.data;
      setTodo([...Todos, addedTodo]);
      setNewTodo(""); 
        
      Swal.fire({
        icon: "success",
        title: "Todo Created Successfully!",
        showConfirmButton: false,
        timer: 1500, 
      });
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [currentPage]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        `https://dummyjson.com/todos?page=${currentPage}&limit=${recordsPerPage}&skip=${(currentPage - 1) * recordsPerPage}`
      );
      console.log("Response:", response.data);
      setTodo(Array.isArray(response.data.todos) ? response.data.todos : []);
      setTotalRecords(response.data.total); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const showConfirmationDialog = (todoId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTodo(todoId);
      }
    });
  };

  const deleteTodo = async (TodoId) => {
    try {
      await axios.delete(`https://dummyjson.com/todos/${TodoId}`);
      setTodo(Todos.filter((Todo) => Todo.id !== TodoId));
      console.log(`Todo ${TodoId} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting todo ${TodoId}:`, error);
      Swal.fire({
        title: "Error",
        text: "Failed to delete todo. Please try again later.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  };

  const toggleCompletion = (id) => {
    const updatedTodos = Todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodo(updatedTodos); 
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredTodos = Todos.filter(todo => 
    todo.todo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const maxPagesToShow = 5; 
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(nPages, startPage + maxPagesToShow - 1);
  const adjustedStartPage = Math.max(1, endPage - maxPagesToShow + 1);


  const openModal = (id) => {
    setSelectedTodoId(id);
    setIsModalOpen(true);
  };

  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTodoId(null);
  };

  return (
    <>
      <TodoSearch onSearch={handleSearch} />
      
      <div className="todos-grid">
        {filteredTodos &&
          filteredTodos.map((todo) => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : 'incomplete'}`}>
              <div>
                <h3 onClick={() => openModal(todo.id)} style={{ cursor: "pointer" }}>{todo.todo}</h3> {/* Open modal on click */}
                <div className="todo-actions">
                  <input
                    type="checkbox"
                    className="todo-checkbox" 
                    checked={todo.completed}
                    onChange={() => toggleCompletion(todo.id)}
                  />
                  <div className="todo-delete">
                    <button type="button" onClick={() => showConfirmationDialog(todo.id)}>
                      <img src={deletee} alt="Delete" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="pagination-container">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Prev
        </button>

        {Array.from({ length: endPage - adjustedStartPage + 1 }, (_, index) => (
          <button
            key={adjustedStartPage + index}
            onClick={() => setCurrentPage(adjustedStartPage + index)}
            className={`pagination-button ${currentPage === adjustedStartPage + index ? 'active' : ''}`}
          >
            {adjustedStartPage + index}
          </button>
        ))}

        <button
          onClick={goToNextPage}
          disabled={currentPage === nPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>

      <form className="todo-form" onSubmit={(e) => {
          e.preventDefault();
          createTodo();
        }}>
        <div className="input-group">
          <textarea
            rows="3"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="todo-textarea"
            placeholder="Write your todo..."
            required
          ></textarea>
        </div>
        <div className="button-container">
          <button type="submit" className="submit-button">Create</button>
        </div>
      </form>

     
      {isModalOpen && <TodoModal id={selectedTodoId} closeModal={closeModal} />}
    </>
  );
}

export default TodoPage;
