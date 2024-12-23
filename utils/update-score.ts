import { DocumentData } from 'firebase/firestore';

export async function updateScore(newItem: DocumentData) {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/title/${newItem.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newItem),
  });
}
