import { MouseEvent } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { DocumentData } from 'firebase/firestore';
import _ from 'lodash';
import clsx from 'clsx';
import { useRouter } from 'next/router';

import styles from '../styles/Home.module.css';
import { Footer } from '../components/Footer';

import firebase from './firebase';

const db = firebase.firestore();

const Home: NextPage = ({ titles }: DocumentData) => {
  const router = useRouter();

  function addVote(e: MouseEvent<HTMLButtonElement>) {
    const target = e.target as Element;
    const selectedTitle = titles.find(
      (x: DocumentData) => x.title === target.innerHTML,
    );
    const unselectedTitle = titles.find(
      (x: DocumentData) => x.title !== target.innerHTML,
    );
    const selectedTitleNewScore = selectedTitle.score + 1;
    const unselectedTitleNewScore = unselectedTitle.score - 1;

    db.collection('titles')
      .doc(selectedTitle.id)
      .set({
        title: selectedTitle.title,
        score: selectedTitleNewScore,
      })
      .then(() => {
        db.collection('titles')
          .doc(unselectedTitle.id)
          .set({
            title: unselectedTitle.title,
            score: unselectedTitleNewScore,
          })
          .then(() => {
            router.replace(router.asPath);
          });
      });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Title Ranker</title>
        <meta name="description" content="Title Ranker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {titles && (
        <main className={styles.main}>
          <h2 className={styles.title}>Which title is better?</h2>

          <div className={styles.grid}>
            <button
              type="button"
              className={clsx(`
                btn
                btn-outline
                p-3
                m-3
                transition-colors
                hover:text-white
                hover:bg-blue-500
                duration-500
                `)}
              onClick={addVote}
            >
              {titles[0]?.title}
            </button>

            <div>vs</div>

            <button
              type="button"
              className={clsx(`
                btn
                btn-outline
                p-3
                m-3
                transition-colors
                hover:text-white
                hover:bg-blue-500
                duration-500
                `)}
              onClick={addVote}
            >
              {titles[1]?.title}
            </button>
          </div>
        </main>
      )}

      {Footer()}
    </div>
  );
};

Home.getInitialProps = async () => {
  const allTitles: Array<DocumentData> = [];

  try {
    const allTitlesRef = await db.collection('titles').get();
    allTitlesRef.forEach((x) =>
      allTitles.push({
        id: x.id,
        ...x.data(),
      }),
    );
  } catch (e) {
    console.error('e :>>', e);
  }

  const titles = _.sampleSize(allTitles, 2);

  return { titles };
};

export default Home;
