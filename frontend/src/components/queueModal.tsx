import React, {useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import PulseLoader from "react-spinners/PulseLoader"
import { StateContext } from '../util/stateContext'
import { baseQueueAction, queueData, queueStatus } from '../util/interfaces';
import { removeActionFromQueue, removeAllActionsFromQueue } from '../util/indexedDBHelper';

const subpath = process.env.REACT_APP_SUBPATH || "/";
const proxyPort = process.env.REACT_APP_PROXY_PORT || "8080";
const proxyLocalhost = (process.env.REACT_APP_PROXY_LOCALHOST || "true").toLowerCase();
const currentLocation = window.location;

const QueueModalView = () => {
    const navigate = useNavigate()
    const {
        setShowQueueModal, 
        queueData, 
        onlineStatus, 
        queueActions, 
        queueCompleted, 
        setQueueCompleted,
        queueStatus,
        setQueueStatus,
        queueError,
        setQueueError
    } = useContext(StateContext);

    const [modalLoading, setModalLoading] = useState<boolean>(false);
    const [entries, setEntries] = useState<Array<queueData>>(queueData);
    const [showQueueError, setShowQueueError] = useState<Number>(-1);


    const handleRemoveAction = (index: number) => {
        if (index >= 0 && index < entries.length) {
            setModalLoading(true);
            removeFromDB(entries[index]).then(() => {
                const newEntries = [...entries];
                newEntries.splice(index, 1);
                setEntries(newEntries);
            }).catch((error) => {
                console.error("Error removing data:", error);
            }).finally(() => {
                setModalLoading(false);
            });
        }
    }

    async function removeFromDB(queueData: queueData){
        try {
            await removeActionFromQueue(queueData.queue_key);
            if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'QUEUE_DB_CHANGED',
                });
            }
            console.log("Data removed with key:", queueData.queue_key);
        } catch (error) {
            console.error("Error removing data:", error);
            throw error;
        }
    }

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

    return (
        <>
            <article className="h-screen vw-100 modalAreaCover">
                <article className="h-screen w-full modalAreaContainer flex justify-center">
                    <section className="queueModalContainer">
                        {modalLoading && <article className={`flex w-full justify-center items-center h-full`}>
                            <PulseLoader
                                color="#1fa5cf"
                                loading={true}
                                size={12}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                                speedMultiplier={1}
                            />
                        </article>}

                        {!modalLoading && onlineStatus && <article className={`w-full h-full`}>
                            {!queueCompleted && <>
                                <div className="flex w-full justify-center mt-5">
                                    <p className="font-medium text-lg normalFont">Processing Queue</p>
                                </div>

                                {queueActions !== baseQueueAction && <div className="flex flex-row w-full justify-center mt-5">
                                    <div className="w-3/6 flex justify-center">
                                        <p className="font-medium text-base normalFont">Action: {queueActions.queue_action}</p>
                                    </div>

                                    <div className="w-3/6 flex justify-center">
                                        <p className="font-medium text-base normalFont">Name: {queueActions.queue_details.item_name}</p>
                                    </div>
                                    
                                </div>}

                                <div className = {`flex w-full flex justify-center items-center queueProcessingContainer`}>
                                    <PulseLoader
                                        color="#1fa5cf"
                                        loading={true}
                                        size={12}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                        speedMultiplier={1}
                                    />
                                </div>
                            </>}

                            {queueCompleted && <>
                                
                                <div className="flex w-full justify-center mt-5">
                                    <p className="font-medium text-lg">Queue Processing Completed</p>
                                </div>

                                <div className="queueStatusContainer pl-4 pr-4">
                                    {queueStatus && queueStatus.length > 0 && queueStatus.map((data: queueStatus, index: number) => {
                                        
                                        return(
                                            <React.Fragment key={index}>
                                                <article className="flex flex-wrap mt-10 cursor" onClick={() => {
                                                    if(data.queue_status === "Failed")
                                                        setShowQueueError(showQueueError === index? -1 : index);
                                                }}>
                                                    <section className="w-3/6 flex justify-center">
                                                        <p className="text-sm normalFont">{data.queue_name}</p>
                                                    </section>

                                                    <section className="w-2/6 flex justify-center">
                                                        <p className="text-sm normalFont">{data.queue_action}</p>
                                                    </section>

                                                    <section className="w-1/6 flex justify-center">
                                                        <p className="text-sm normalFont">{data.queue_status}</p>
                                                    </section>
                                                </article>

                                                {data.queue_status === "Failed" && showQueueError === index && <section className = "flex items-center justify-center queueErrorContainer bg-gray-200">
                                                    <p className="text-sm normalFont font-medium error">{data.queue_error}</p>    
                                                </section>}
                                            
                                            </React.Fragment>
                                            
                                        )
                                    })}
                                </div>

                                <div className="w-100 mt-2 flex flex-row">
                                    {queueError && <>
                                        <div className="w-3/6 flex justify-center">
                                            <button className="modalButton font-medium normalFont" onClick={() => {
                                                setQueueCompleted(false);
                                                setQueueStatus([]);
                                                setQueueError(false);
                                                setShowQueueError(-1);
                                                notifyServiceWorkerOnline()
                                            }}>Retry</button>
                                        </div>

                                        <div className="w-3/6 flex justify-center">
                                            <button className="modalButton font-medium normalFont" onClick={() => {
                                                removeAllActionsFromQueue();
                                                setQueueCompleted(false);
                                                setQueueStatus([]);
                                                setQueueError(false);
                                                setShowQueueModal(false);
                                                if (window.location.pathname === `${subpath}`) {
                                                    let newPath;
                                                    if(proxyLocalhost === "true"){
                                                        newPath = `${currentLocation.protocol}//${currentLocation.hostname}:${proxyPort}${subpath}/`
                                                    }else{
                                                        newPath = `${currentLocation.protocol}//${currentLocation.hostname}${subpath}/`
                                                    }
                                                    window.location.href = newPath;
                                                } else {
                                                    navigate('/');
                                                }
                                            }}>Cancel</button>
                                        </div>
                                    </>}


                                    {!queueError && <>

                                        <div className="w-full flex justify-center">
                                            <button className="modalButton font-medium normalFont" onClick={() => {
                                                removeAllActionsFromQueue();
                                                setQueueCompleted(false);
                                                setQueueStatus([]);
                                                setQueueError(false);
                                                setShowQueueModal(false);
                                                if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                                                    navigator.serviceWorker.controller.postMessage({
                                                        type: 'INVALIDATE_CACHE',
                                                        payload: {
                                                            cacheNames: ['books', 'user-books', 'borrowed-book-details', 'book-details']
                                                        }
                                                    });
                                                }
                                                if (window.location.pathname === `${subpath}`) {
                                                    let newPath;
                                                    if(proxyLocalhost === "true"){
                                                        newPath = `${currentLocation.protocol}//${currentLocation.hostname}:${proxyPort}${subpath}/`
                                                    }else{
                                                        newPath = `${currentLocation.protocol}//${currentLocation.hostname}${subpath}/`
                                                    }
                                                    window.location.href = newPath;
                                                } else {
                                                    navigate('/');
                                                }
                                            }}>Close</button>
                                        </div>
                                    </>}
                                    
                                    
                                </div>
                            </>}
                            
                            
                        </article>}

                        {!modalLoading && !onlineStatus && <>
                            <div className={entries.length > 0? `w-100 text-center queueDataContainer` : `w-100 text-center queueDataContainer flex justify-center text-center items-center`}>
                                {entries && entries.map((data: queueData, index: number) => {
                                    return(
                                        <div key={index} className="flex flex-row w-full mt-8">
                                            <div className="w-2/6 flex justify-center">
                                                <p className="normalFont md:text-base text-sm">{data.queue_details.item_name}</p>
                                            </div>

                                            <div className="w-2/6 flex justify-center">
                                                <p className="normalFont md:text-base text-sm">{data.queue_action}</p>
                                            </div>

                                            <div className="w-2/6 flex justify-center">
                                                <button className="queueRemoveButton font-medium normalFont" onClick={() => handleRemoveAction(index)}>Remove</button>
                                            </div>
                                        </div>
                                    )
                                })}

                                {entries.length === 0 && <>
                                    <p>No actions in the queue</p>
                                </>}
                            </div>

                            <div className="w-100 mt-5 flex justify-center">
                                <button className="modalButton font-medium normalFont" onClick={() => {
                                    setShowQueueModal(false);
                                }}>Close</button>
                            </div>
                        </>}
                        
                    </section>
                </article> 
            </article>
        </>
    )
}

export default QueueModalView;
