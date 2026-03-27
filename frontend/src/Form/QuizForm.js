import React from "react";

const QuizForm = (props) => {
  const { value, setValue, handleSubmit } = props;
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Category Name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-outline-success">
          Add Quiz
        </button>
      </form>
    </>
  );
};

export default QuizForm;
