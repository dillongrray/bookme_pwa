import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import PulseLoader from "react-spinners/PulseLoader"

const ModalView = (props:{message: string, navigation: string, buttonName?: string, loading: boolean, doNavigate?: boolean, setShowModal?: any}) => {
    const navigate = useNavigate();

    const {message, navigation, buttonName, loading, doNavigate, setShowModal} = props;

    const [modalLoading, setModalLoading] = useState<boolean>(loading);

    const NewButtonName = buttonName? buttonName : "Close";

    useEffect(() => {
        if (modalLoading) {
            const handleServiceWorkerMessage = (event: any) => {
              if (event.data && event.data.type === 'CACHE_INVALIDATED') {
                showModal();
              }
            };
        
            // Add the event listener to listen for messages from the service worker
            navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
        
            return () => {
              // Clean up the event listener when the component is unmounted or if loading becomes false
              navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
            };
        }

    },[modalLoading])

    async function showModal(){
        setModalLoading(false);
    }

    return (
        <>
            <article className="h-screen vw-100 modalAreaCover">
                <article className="h-screen w-full modalAreaContainer flex justify-center">
                    <section className="modalContainer">
                        {modalLoading && <article className={`flex w-full justify-center items-center h-full`}>
                            <PulseLoader
                                color="black"
                                loading={loading}
                                size={12}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                                speedMultiplier={1}
                            />
                        </article>}

                        {!modalLoading && <>
                            <div className="w-100 text-center mt-12">
                                <p className="text-base normalFont pl-8 pr-8">{message}</p>
                            </div>

                            <div className="w-100 mt-36 flex justify-center">
                                <button className="modalButton font-medium normalFont" onClick={() => {
                                    if(!doNavigate && doNavigate !== undefined){
                                        setShowModal(false);
                                    }else{
                                        navigate(navigation);
                                    }
                                        
                                }}>{NewButtonName}</button>
                            </div>
                        </>}
                        
                    </section>
                </article> 
            </article>
        </>
    )
}

export default ModalView;
