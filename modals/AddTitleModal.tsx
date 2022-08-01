import { useState } from 'react';

export function AddTitleModal() {
  const [title, setTitle] = useState("");

  async function handleTitleSubmission() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/title`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(title)
    })
  }

  function handleTitleChange(e: any) {
    setTitle(e.target.value);
  }

  return (
    <div className="flex-column w-full">
      <div>
        <form className="mb-2" onSubmit={handleTitleSubmission}>
          <label htmlFor="title">
            Title:
          </label>
          <input
            className="w-full border"
            id="title"
            type="text"
            value={title}
            onChange={handleTitleChange}
          />
          <div className="mt-2 text-center">
            <button type="submit" className="btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTitleModal;
