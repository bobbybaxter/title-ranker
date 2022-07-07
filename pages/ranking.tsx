import type { NextPage } from 'next';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, DocumentData } from 'firebase/firestore';

import { Footer } from '../components/Footer';
import styles from '../styles/Home.module.css';

import firebase from './firebase';

const Ranking: NextPage = () => {
  let rows;
  const db = firebase.firestore();

  const [allTitles, allTitlesLoading] = useCollection(
    collection(db, 'titles'),
    {},
  );

  if (!allTitlesLoading && allTitles) {
    const mappedTitles: Array<DocumentData> = allTitles.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    rows = mappedTitles
      .sort((a: DocumentData, b: DocumentData) => (a.score > b.score ? -1 : 1))
      .map((x: DocumentData) => {
        return (
          <tr key={x.id}>
            <td className="p-3">{x.score}</td>
            <td className="p-3">{x.title}</td>
          </tr>
        );
      });
  }

  return (
    <div className={`${styles.container} flex-auto`}>
      <h1 className="text-3xl p-3 m-3 text-center">Title Ranks</h1>
      <div className="place-content-center place-items-center text-center">
        <table className="min-w-fit table-auto table-zebra border table">
          <thead>
            <tr>
              <th className="p-3">Score</th>
              <th className="p-3">Title</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>

      {Footer()}
    </div>
  );
};

export default Ranking;
