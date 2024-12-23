import { useState } from 'react';
import { DocumentData } from 'firebase/firestore';

export function EditTitleModal({ selectedTitle }: { selectedTitle: DocumentData }) {
  const [editedTitle, setEditedTitle] = useState(selectedTitle);

  async function handleTitleSubmission() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/title/${editedTitle.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedTitle),
    });
  }

  function handleTitleChange(e: any) {
    const newTitle = {
      ...editedTitle,
      title: e.target.value,
    };

    setEditedTitle(newTitle);
  }

  return (
    <div className="flex-column w-full">
      <div>
        <form className="mb-2" onSubmit={handleTitleSubmission}>
          <label htmlFor="title">Title:</label>
          <input
            className="w-full border"
            id="title"
            type="text"
            value={editedTitle.title}
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

export default EditTitleModal;
