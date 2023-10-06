import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/nav.module.css';
import { StateContext } from '../util/stateContext';

const NavBar = () => {
    const {installPrompt, setInstallPrompt} = useContext(StateContext);

    const [showInstallPrompt, setShowInstallPrompt] = useState(false);

    const navigate = useNavigate();
    const handleNavClick = (url: string) => {
        navigate(url)
    } 

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
            setInstallPrompt(null);
        }
    }


    useEffect(() => {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;

        const isInstallable = (window.navigator as any).getInstalledRelatedApps;

        if (!isStandalone && isInstallable) {
            setShowInstallPrompt(true);
        } else {
            setShowInstallPrompt(false);
        }

        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleAppInstalled = () => {
        setShowInstallPrompt(false);
    };

    return(
        <article className={`${styles.navBody} flex flex-row w-full`}>
            <section className={`w-1/6 flex items-center pl-2`}>
                {/* <img src="./logo_old.png" alt="Logo" width={25} height={30}/>; */}
                <p className="font-semibold text-lg text-white ml-2 bigFontBase">BookMe</p>
                {showInstallPrompt && <p className="text-white text-sm font-medium md:ml-14 ml-8 cursor normalFontBase" onClick={() => handleInstallClick()}>Install</p>}
            </section>

            <section className="w-5/6 flex justify-end items-center">
                <p className="text-white text-sm font-medium cursor normalFontBase" onClick={() => handleNavClick("/")}>Catalogues</p>
                <p className="text-white text-sm font-medium ml-5 cursor normalFontBase" onClick={() => handleNavClick("/library")}>Library</p>
                <p className="text-white text-sm font-medium md:ml-14 ml-5 mr-2 cursor normalFontBase" onClick={() => handleNavClick("/login")}>Logout</p>
            </section>
        </article>
    )
}

export default NavBar