import { useContext, useState } from 'react';
import Router from 'next/router';
import type { NextPage } from 'next';
import { DocumentData } from 'firebase/firestore';

import styles from '../styles/Home.module.css';
import { AddTitleModal} from '../modals/AddTitleModal';
import { EditTitleModal} from '../modals/EditTitleModal';
import { Footer } from '../components/Footer';
import { AuthContext } from '../contexts/userContext';
import Modal from '../components/Modal';

const Ranking: NextPage = ({ titles }: DocumentData) => {
  const { authenticated } = useContext(AuthContext);
  const [selectedTitle, setSelectedTitle] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  function handleModalOpen(title: DocumentData) {
    setShowModal(true);
    setModalTitle("Edit Title")
    setSelectedTitle(title);
  }

  function handleCreateModalOpen() {
    setShowModal(true);
    setModalTitle("Add Title")
  }

  async function handleDeleteTitle(title: DocumentData) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/title/${title.id}`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
    });

    Router.reload();
  }

  const rows = titles
    .sort((a: DocumentData, b: DocumentData) => (a.score > b.score ? -1 : 1))
    .map((x: DocumentData) => {
      return (
        <tr key={x.id}>
          {authenticated && (
            <td className="py-1 px-2">
              <button
                onClick={() => handleModalOpen(x)}
                className="p-0 btn bg-transparent border-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    id={x.id}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </td>
          )}
          <td className="py-1 px-2">{x.score}</td>
          <td className="py-1 px-2 break-normal">{x.title}</td>
          {authenticated && (
            <td className="py-1 px-2">
              <button
                onClick={() => handleDeleteTitle(x)}
                className="p-0 btn bg-transparent border-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </td>
          )}
        </tr>
      );
    });

  return (
    <div className={`${styles.container} flex-auto`}>
      <h1 className="text-3xl p-3 m-3 text-center">Title Ranks</h1>
      <div className="flex w-full place-content-center">
        {
          authenticated && <button
              onClick={() => handleCreateModalOpen()}
              className="w-1/2 mb-6 p-0 btn border-none"
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        }
      </div>
      <div className="mb-24 place-content-center place-items-center text-center">
        <table className="w-auto table table-zebra border">
          <thead>
            <tr>
              {authenticated && <td className="py-1 px-2">Edit</td>}
              <th className="py-1 px-2">Score</th>
              <th className="py-1 px-2">Title</th>
              {authenticated && <td className="py-1 px-2">Del</td>}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
        <Modal title={modalTitle} onClose={() => setShowModal(false)} show={showModal}>
          {authenticated && showModal && modalTitle === "Edit Title"
            ? <EditTitleModal selectedTitle={selectedTitle}/>
            : <AddTitleModal />
          }
        </Modal>
      </div>

      {Footer()}
    </div>
  );
};

Ranking.getInitialProps = async () => {
  let titles: Array<DocumentData> = [];

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/title`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  titles = await response.json();

  return { titles };
};

export default Ranking;
