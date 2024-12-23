import React, { MouseEvent, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { DocumentData } from 'firebase/firestore';
import _ from 'lodash';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { calculateExpectedOutcome } from '../utils/calculate-expected-outcome';
import { updateScore } from '../utils/update-score';
import { calculateK } from '../utils/calculate-k';

import styles from '../styles/Home.module.css';
import { Footer } from '../components/Footer';

const Home: NextPage<{ titles: DocumentData[]; highestRatingAmt: number; lowestRatingAmt: number }> = ({
  titles,
  highestRatingAmt,
  lowestRatingAmt,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  function refreshData() {
    router.replace(router.asPath);
    setIsRefreshing(true);
  }

  useEffect(() => {
    setIsRefreshing(false);
  }, [titles]);

  async function addVote(e: MouseEvent<HTMLButtonElement>) {
    const target = e.target as Element;
    const selectedTitle = titles.find((x) => x.title === target.innerHTML);
    const unselectedTitle = titles.find((x) => x.title !== target.innerHTML);
    const { expectedOutcomeA, expectedOutcomeB } = calculateExpectedOutcome(
      selectedTitle?.score,
      unselectedTitle?.score,
    );

    const selectedTitleNewScore = Math.round(
      selectedTitle?.score +
        calculateK({
          ratingAmt: selectedTitle?.ratingAmt,
          minRatings: lowestRatingAmt,
          maxRatings: highestRatingAmt,
        }) *
          (1 - expectedOutcomeA),
    );

    const unselectedTitleNewScore = Math.round(
      unselectedTitle?.score +
        calculateK({
          ratingAmt: unselectedTitle?.ratingAmt,
          minRatings: lowestRatingAmt,
          maxRatings: highestRatingAmt,
        }) *
          (0 - expectedOutcomeB),
    );

    await updateScore({
      ...selectedTitle,
      score: selectedTitleNewScore,
      ratingAmt: selectedTitle?.ratingAmt + 1,
    });

    await updateScore({
      ...unselectedTitle,
      score: unselectedTitleNewScore,
      ratingAmt: unselectedTitle?.ratingAmt + 1,
    });

    refreshData();
  }

  return (
    <div>
      <Head>
        <title>Title Ranker</title>
        <meta name="description" content="Title Ranker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content">
          <div className="flex justify-end">
            <label htmlFor="my-drawer" className="btn btn-outline border-hidden">
              <svg viewBox="0 0 100 80" width="40" height="40">
                <rect width="100" height="10"></rect>
                <rect y="30" width="100" height="10"></rect>
                <rect y="60" width="100" height="10"></rect>
              </svg>
            </label>
          </div>

          <div className={styles.container}>
            {titles && (
              <main className={styles.main}>
                <h2 className={styles.title}>Which title is better?</h2>

                <div className={styles.grid}>
                  {isRefreshing ? (
                    <div className="flex items-center justify-center">
                      <div
                        className={`${styles.spinner} w-8 h-8 border-4 border-blue-200 rounded-full animate-spin`}
                      ></div>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </main>
            )}
            {Footer()}
          </div>
        </div>

        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-40 bg-base-100 text-base-content">
            <li>
              <Link href="/admin">Admin</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/title`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const { titles: allTitles, highestRatingAmt, lowestRatingAmt } = await response.json();

  const blankTitles = allTitles.filter((x: DocumentData) => x.ratingAmt === 0);

  function selectTitles() {
    if (blankTitles.length) {
      const firstTitle = _.sample(blankTitles);
      const secondTitle = _.sample(allTitles.filter((x: DocumentData) => x !== firstTitle));
      return [firstTitle, secondTitle];
    } else {
      return _.sampleSize(allTitles, 2);
    }
  }

  const titles = selectTitles();

  return { props: { titles, highestRatingAmt, lowestRatingAmt } };
}

export default Home;
