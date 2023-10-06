import React, {useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import PulseLoader from "react-spinners/PulseLoader"
import { StateContext } from '../util/stateContext'
import { baseQueueAction, queueData, queueStatus } from '../util/interfaces';
import { removeActionFromQueue, removeAllActionsFromQueue } from '../util/indexedDBHelper';


const iosMessage = `
1. Tap the Share button (square with an arrow pointing up).
2. Scroll down and select "Add to Home Screen."
3. Name the app as you'd like and tap "Add."
`;


const androidMessage = `
1. Tap the three-dot menu on the top right of your browser.
2. Select "Add to Home screen."
3. Name the app if you wish and tap "Add."
`;

const InstallModal = () => {
    const {
        setShowInstallPrompt,
        installPrompt,
        setInstallPrompt,
        platform
    } = useContext(StateContext);


    const handleInstallClick = () => {
        if (installPrompt) {
            installPrompt.prompt();
            installPrompt.userChoice.then((choiceResult: { outcome: 'accepted' | 'dismissed' }) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
            });
            localStorage.setItem('installPromptShown', 'true');
            setInstallPrompt(null);
            setShowInstallPrompt(false);
        }
    }

    return (
        <>
            <article className="h-screen vw-100 modalAreaCover">
                <article className="h-screen w-full modalAreaContainer flex justify-center">
                    <section className="queueModalContainer">

                        {platform == 'desktop' && <article className={`w-full h-full`}>
                                <div className="flex w-full text-center justify-center mt-10">
                                    <p className="md:text-base text-sm">This application is installable, please click the install button below to begin the installation process. To install at a later time, you can use the install option in the navbar.</p>
                                </div>


                                <div className="w-100 md:mt-56 mt-60 flex flex-row">
                                    
                                    <div className="w-3/6 flex justify-center">
                                        <button className="modalButton" onClick={() => handleInstallClick()}>Install</button>
                                    </div>

                                    <div className="w-3/6 flex justify-center">
                                        <button className="modalButton" onClick={() => {
                                            localStorage.setItem('installPromptShown', 'true');
                                            setShowInstallPrompt(false);
                                        }}>Close</button>
                                    </div>
                                    
                                </div>

                        </article>}


                        {platform == 'ios' && <article className={`w-full h-full`}>
                                <div className="flex w-full text-center justify-center mt-10">
                                    <p className="md:text-base text-sm">This application is installable, please follow the instructions below to install.</p>
                                </div>

                                <div className="flex w-full text-center justify-center mt-4">
                                    <p className="text-sm font-medium whitespace">{iosMessage}</p>
                                    
                                </div>


                                <div className="w-100 mt-32 flex justify-center">

                                    <button className="modalButton" onClick={() => {
                                        localStorage.setItem('installPromptShown', 'true');
                                        setShowInstallPrompt(false);
                                    }}>Close</button> 
                                    
                                </div>

                        </article>}


                        {platform == 'android' && <article className={`w-full h-full`}>
                                <div className="flex w-full text-center justify-center mt-10">
                                    <p className="md:text-base text-sm">This application is installable, please follow the instructions below to install.</p>
                                </div>

                                <div className="flex w-full text-center justify-center mt-4">
                                    <p className="text-sm font-medium whitespace">{androidMessage}</p>
                                    
                                </div>


                                <div className="w-100 mt-32 flex justify-center">

                                    <button className="modalButton" onClick={() => {
                                        localStorage.setItem('installPromptShown', 'true');
                                        setShowInstallPrompt(false);
                                    }}>Close</button> 
                                    
                                </div>

                        </article>}
                        
                    </section>
                </article> 
            </article>
        </>
    )
}

export default InstallModal;
