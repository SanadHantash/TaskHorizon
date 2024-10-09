import React, { useState } from "react";

function TodoSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };
  return (

    <>
    <div class="container">
    <div class="content">
        <p class="tagline">
            Elevate Your Efficiency:
            <br /> Your Path to Seamless Task Management!
        </p>

        <form onSubmit={handleSubmit}>
            <label for="search-bar" class="search-label">
                <input
                    id="search-bar"
                    placeholder="todo name"
                    name="q"
                    onChange={handleInputChange}
                    class="search-input"
                    required
                />
                <button type="submit" class="search-button">
                    <span class="button-text">Search</span>
                </button>
            </label>
        </form>
    </div>
</div>

    </>
 
  );
}

export default TodoSearch;
