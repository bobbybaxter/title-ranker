import { MouseEvent } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { DocumentData } from 'firebase/firestore';
import _ from 'lodash';
import clsx from 'clsx';
import { useRouter } from 'next/router';

import styles from '../styles/Home.module.css';
import { Footer } from '../components/Footer';

interface Title {
  title: string;
  score: number;
}

const Home: NextPage = ({ titles }: DocumentData) => {
  const router = useRouter();

  async function addVote(e: MouseEvent<HTMLButtonElement>) {
    const target = e.target as Element;
    const selectedTitle: Title = titles.find(
      (x: DocumentData) => x.title === target.innerHTML,
    );
    const unselectedTitle: Title = titles.find(
      (x: DocumentData) => x.title !== target.innerHTML,
    );
    const selectedTitleNewScore = selectedTitle.score + 1;
    const unselectedTitleNewScore = unselectedTitle.score - 1;

    async function updateScore(title: DocumentData, newScore: number) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/title/${title.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.title,
          score: newScore,
        }),
      });
    }

    await updateScore(selectedTitle, selectedTitleNewScore);
    await updateScore(unselectedTitle, unselectedTitleNewScore);
    router.replace(router.asPath);
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

export async function getServerSideProps() {
  let allTitles: Array<DocumentData> = [];

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/title`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  allTitles = await response.json();

  const titles = _.sampleSize(allTitles, 2);

  return { props: { titles } };
}

export default Home;
