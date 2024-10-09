import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/info.css";

function TodoModal({ id, closeModal }) {
  const [todoInfo, setTodoInfo] = useState(null);

  useEffect(() => {
    const fetchTodoInfo = async () => {
      try {
        const response = await axios.get(`https://dummyjson.com/todos/${id}`);
        setTodoInfo(response.data);
        console.log("Todo Details API response:", response.data);
      } catch (error) {
        console.error("Error fetching todo information:", error.response);
      }
    };

    fetchTodoInfo();
  }, [id]);

  if (!todoInfo) {
    return <p>Loading...</p>;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={closeModal}>
          &times;
        </span>
        <div className="flip-card">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <p className="title">{todoInfo.todo}</p>
            </div>
            <div
              className={`flip-card-back ${
                todoInfo.completed
                  ? "flip-card-completed"
                  : "flip-card-incompleted"
              }`}
            >
              <p>{todoInfo.completed ? "Completed" : "Not Completed"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoModal;
