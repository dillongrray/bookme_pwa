import { useContext } from 'react'
import styles from '../styles/queue.module.css'
import { StateContext } from '../util/stateContext'
const QueueUI = () => {

  const {setShowQueueModal} = useContext(StateContext);

  return (
    <>
        <article className={`${styles.queueUI} flex justify-end items-end`}>
            <button className={`${styles.queueShowButton} normalFont`} onClick={() => {
              setShowQueueModal(true);
            }}>Show Queue</button>
        </article>
    </>
  )
}

export default QueueUI
