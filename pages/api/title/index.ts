import type { NextApiRequest, NextApiResponse } from 'next';
import { DocumentData } from 'firebase/firestore';

import firebase from '../firebase';
const db = firebase.firestore();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    method,
    body: title,
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
    case 'POST':
      await db.collection('titles').add({
        title: title as string,
        score: 0,
      });

      res.status(201).end(`${title} added.`);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
