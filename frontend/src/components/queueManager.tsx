import {useEffect, useContext} from 'react'
import { StateContext } from '../util/stateContext';
import { getActionsFromQueue } from '../util/indexedDBHelper';
import { baseQueueData } from '../util/interfaces';

const QueueManager = () => {
    const {
        setQueueExists, 
        setQueueData, 
        setOnlineStatus, 
        setShowQueueModal, 
        onlineStatus, 
        setQueueActions, 
        setQueueCompleted, 
        setQueueStatus,
        setQueueError,
        setInstallPrompt,
        setShowInstallPrompt,
        setPlatform
    } = useContext(StateContext);
    
    useEffect(() => {
        let mounted = true;

        const checkDataStore = async () => {
            const dataStore: any = await getActionsFromQueue();
    
            if (!dataStore || dataStore.length === 0) {
                setQueueExists(false);
                setQueueData(baseQueueData);
            } else {
                if (onlineStatus) {
                    setShowQueueModal(true);
                    notifyServiceWorkerOnline();
                } else {
                    setQueueExists(true);
                    setQueueData(dataStore);
                }
            }
        }

        if(mounted)
            checkDataStore()

        return () => {
            mounted = false;
        }
    }, [onlineStatus]);


    //Check online and offline status
    useEffect(() => {
        let mounted = true;
        // Function to set online status to true
        const handleOnline = () => {
            setOnlineStatus(true);
        }

        // Function to set online status to false
        const handleOffline = () => {
            setOnlineStatus(false);
        }

        if(mounted){

            // Attach event listeners
            window.addEventListener('online', handleOnline);
            window.addEventListener('offline', handleOffline);
        }

        return () => {
            mounted = false;
            // Cleanup - remove the event listeners when the component is unmounted
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        }
    }, [setOnlineStatus]);

    

    //Listen for messages from service worker
    useEffect(() => {
        let mounted = true;
        // Handle message events from the service worker.
        function handleMessage(event: any) {
            if (event.data && event.data.type === 'QUEUE_DB_CHANGED' && event.data.payload.dbChanged !== undefined) {
                setQueueExists(event.data.payload.dbChanged);
                setQueueData(event.data.payload.dbData);
            }

            if (event.data && event.data.type === 'ONLINE_DB_SHOW_RESPONSE') {
                setShowQueueModal(true);
            }
            

            if (event.data && event.data.type === 'ACTION_EXECUTING') {
                setQueueActions(event.data.payload.queueAction);
            }


            if (event.data && event.data.type === 'ALL_ACTIONS_EXECUTED') {
                setQueueStatus(event.data.payload.queueStatus)
                if(event.data.payload.queueError)
                    setQueueError(true);
                setQueueCompleted(true);
                
            }

            
        }

        if(mounted){
            // Add the event listener.
            navigator.serviceWorker.addEventListener('message', handleMessage);
        }

        // Cleanup the event listener on unmount.
        return () => {
            mounted = false;
            navigator.serviceWorker.removeEventListener('message', handleMessage);
        };
    }, [setQueueExists, setQueueData, setQueueActions, setQueueCompleted, setQueueStatus, setShowQueueModal, setQueueError]);


    

    useEffect(() => {
        const getPlatform = () => {
            const userAgent = window.navigator.userAgent.toLowerCase();
    
            if (/iphone|ipad|ipod/.test(userAgent)) {
              return 'ios';
            } else if (/android/.test(userAgent)) {
              return 'android';
            } else {
              return 'desktop';
            }
        };

        const currentPlatform = getPlatform();
        setPlatform(currentPlatform);

        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
        const hasPromptBeenShown = localStorage.getItem('installPromptShown');

        if (!isStandalone) {
            if (currentPlatform === 'ios' || currentPlatform === 'android') {
                if (!hasPromptBeenShown) {
                    setTimeout(() => {
                        setShowInstallPrompt(true);
                    }, 5000)
                    
                    
                }
            }else{
                const handleBeforeInstallPrompt = (event: any) => {
                    event.preventDefault();
                    setInstallPrompt(event); 
                    if (!hasPromptBeenShown) {
                    setTimeout(() => {
                        setShowInstallPrompt(true);
                    }, 5000);
                    }
                };
            
                window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            
                return () => {
                    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
                };
            }
        }
    }, []); 


    const notifyServiceWorkerOnline = () => {
        try {
            if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'ONLINE_DB_SHOW',
                });
            }
        } catch (error) {
            console.error("Error sending online message:", error);
        }
    }

    



    return null
}


export default QueueManager;
