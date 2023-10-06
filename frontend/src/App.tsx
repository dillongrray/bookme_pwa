
import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PulseLoader from "react-spinners/PulseLoader"
import { baseQueueAction, baseQueueData, queueData, queueStatus } from './util/interfaces';
import { StateContext } from './util/stateContext';
import QueueManager from './components/queueManager';
import QueueUI from './components/queueUI';
import QueueModalView from './components/queueModal';
import InstallModal from './components/installModal';
import LoginView from './components/loginView';

const Dashboard = React.lazy(() => import("./components/dashboard"));
const UserBook = React.lazy(() => import("./components/userBook"));
const Books = React.lazy(() => import("./components/books"));
const BookData = React.lazy(() => import("./components/bookData"));


function App() {
  const [queueExists, setQueueExists] = useState<boolean>(false);
  const [queueData, setQueueData] = useState<Array<queueData>>(baseQueueData);
  const [showQueueModal, setShowQueueModal] = useState<boolean>(false);
  const [onlineStatus, setOnlineStatus] = useState<boolean>(navigator.onLine);
  const [queueActions, setQueueActions] = useState<any>(baseQueueAction);
  const [queueCompleted, setQueueCompleted] = useState<boolean>(false);
  const [queueStatus, setQueueStatus] = useState<Array<queueStatus>>([]);
  const [queueError, setQueueError] = useState<boolean>(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState<boolean>(false);
  const [platform, setPlatform] = useState<string>('desktop');

  return (
    <StateContext.Provider value={{
        queueExists: queueExists,
        setQueueExists: setQueueExists,
        queueData: queueData,
        setQueueData: setQueueData,
        setShowQueueModal: setShowQueueModal,
        onlineStatus: onlineStatus,
        setOnlineStatus: setOnlineStatus,
        queueActions: queueActions,
        setQueueActions: setQueueActions,
        queueCompleted: queueCompleted,
        setQueueCompleted: setQueueCompleted,
        queueStatus: queueStatus,
        setQueueStatus: setQueueStatus,
        queueError: queueError,
        setQueueError: setQueueError,
        installPrompt: installPrompt,
        setInstallPrompt: setInstallPrompt,
        setShowInstallPrompt: setShowInstallPrompt,
        platform: platform,
        setPlatform: setPlatform

    }}>
      <QueueManager />
      <Router basename={process.env.REACT_APP_SUBPATH}>
        {showQueueModal && <QueueModalView />}
        {!showQueueModal && showInstallPrompt && <InstallModal/>}
        {!onlineStatus && queueExists && !showQueueModal && <QueueUI />}
        <React.Suspense fallback={
          <article className={`flex w-full justify-center items-center h-screen`}>
            <PulseLoader
                  color="#1fa5cf"
                  loading={true}
                  size={22}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                  speedMultiplier={1}
              />
          </article>
        }>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/book/:id" element={<UserBook />} />
            <Route path="/library" element={<Books />} />
            <Route path="/library/:id" element={<BookData />} />
          </Routes>
        </React.Suspense>
      </Router>
    </StateContext.Provider>
  );
}

export default App;
