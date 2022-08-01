import type { NextApiRequest, NextApiResponse } from 'next';
import { DocumentData } from 'firebase/firestore';

import firebase from '../firebase';
const db = firebase.firestore();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    query: { id },
    body: title,
    method,
  } = req;

  switch (method) {
    case 'GET':
      const allTitles: Array<DocumentData> = [];

      const allTitlesRef = await db.collection('titles').get();
      allTitlesRef.forEach((x) =>
        allTitles.push({
          id: x.id,
          ...x.data(),
        }),
      );

      res.status(200).json(allTitles);
      break;
    case 'PATCH':
      await db
        .collection('titles')
        .doc(id as string)
        .set({
          title: title?.title,
          score: title?.score,
        });
      res
        .status(200)
        .end(`Updated Title: ${title?.title} Score: ${title?.score}`);
      break;
    case 'DELETE':
      await db
        .collection('titles')
        .doc(id as string)
        .delete();
      res.status(200).end(`${id} deleted`);
      break;
    default:
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
