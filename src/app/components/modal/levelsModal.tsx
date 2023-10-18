import React, { useCallback, useState } from "react";
import Modal from "./modal";
import { observer } from "mobx-react";
import { useWebSocketContext } from "@contexts/context";
import { passwords } from "@app/constants";

const LevelsModal = observer(() => {
  const { store } = useWebSocketContext();
  const [selectedOption, setSelectedOption] = useState(1);
  const [inputValue, setInputValue] = useState("");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(parseInt(event.target.value));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleStart = useCallback(() => {
    store.setLevelSettings(inputValue, selectedOption, true);
  }, [store, selectedOption, inputValue]);

  return (
    <Modal isOpen={true} closeModal={() => console.log}>
      <h2>Select Level</h2>
      <div className="bet-options-container">
        <select
          id="selectInput"
          value={selectedOption}
          onChange={handleSelectChange}
          style={{ borderRadius: 5 }}
        >
          <option value={1}>Level 1</option>
          <option value={2}>Level 2</option>
          <option value={3}>Level 3</option>
          <option value={4}>Level 4</option>
        </select>
      </div>
      {selectedOption !== 1 && (
        <div className="text-input-container">
          <label htmlFor="textInput">Password:</label>
          <input type="text" id="textInput" value={inputValue} onChange={handleInputChange} />
        </div>
      )}
      <button
        className="custom-button green-button"
        style={{ marginTop: 20 }}
        disabled={selectedOption === 1 ? false : passwords[selectedOption - 2] !== inputValue}
        onClick={handleStart}
      >
        <span> Start </span>
      </button>
    </Modal>
  );
});

export default LevelsModal;
