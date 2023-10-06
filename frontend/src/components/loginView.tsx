
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import styles from '../styles/login.module.css'
import PulseLoader from "react-spinners/PulseLoader"
import { useNavigate } from 'react-router-dom';


type credentialsType = {
    username: string,
    password: string,
    confirmPassword: string
}

type errorType = {
    mainError:string,
    usernameError: string,
    passwordError: string,
    confirmPasswordError: string
}

const baseErrors = {
    mainError:"", 
    usernameError:"", 
    passwordError:"", 
    confirmPasswordError:""
}

const baseCredentials = {
    username: "", 
    password: "", 
    confirmPassword:""
}

const LoginView = () => {
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState<credentialsType>(baseCredentials);
    const [errors, setErrors] = useState<errorType>(baseErrors);
    const [showRegister, setShowRegister] = useState<boolean>(false);
    const [modal,setModal] = useState<{message: string, show: boolean, success: boolean}>({message:"", show: false, success: false});
    const [loading, setLoading] = useState<boolean>(false);
    const [mainLoading, setMainLoading] = useState<boolean>(false);

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let mounted = true;

        const removeCookies = async () => {
            await axios({
                method: 'get',
                url: '/removeCookies',
                
            }).then( async(response) => {
    
            }).catch(err =>{
                
            })
        }

        if(mounted){
            removeCookies();
            if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'INVALIDATE_CACHE',
                    payload: {
                        cacheNames: ['books', 'user-books']
                    }
                });
            }
        }

        return () => {
            mounted = false;
        }
    },[])


    const handleRegisterClick = () => {
        if(errors.usernameError === "" && errors.passwordError === "" && errors.confirmPasswordError === ""){
            if(credentials.username !== "" && credentials.password !== "" && credentials.confirmPassword !== ""){
                if(credentials.password === credentials.confirmPassword){
                    setLoading(true);
                    setModal({...modal, show: true});
                    register();
                }else{
                    setErrors({...baseErrors, mainError:"Passwords must match"});
                    if (passwordRef.current) {
                        passwordRef.current.style.border = '2px solid red';
                    }
    
                    if (confirmPasswordRef.current) {
                        confirmPasswordRef.current.style.border = '2px solid red';
                    }
                }
            }else{
                let usernameError = "", passwordError = "", confirmPasswordError = ""
                if (credentials.username === "" && usernameRef.current) {
                    usernameRef.current.style.border = '2px solid red';
                    usernameError = "Username is required"
                }
    
                if (credentials.password === "" && passwordRef.current) {
                    passwordRef.current.style.border = '2px solid red';
                    passwordError = "Password is required"
                }
    
                if (credentials.confirmPassword === "" && confirmPasswordRef.current) {
                    confirmPasswordRef.current.style.border = '2px solid red';
                    confirmPasswordError = "Confirm Password is required"
                }
    
                setErrors({...baseErrors, usernameError: usernameError, passwordError: passwordError, confirmPasswordError: confirmPasswordError});
            }
            
        }
        
    }

    async function register(){
        await axios({
            method: 'post',
            url: '/register',
            data: {
                username: credentials.username,
                password: credentials.password
            }
            
        }).then( async(response) => {
            if(response.data.success){
                setLoading(false);
                setModal({show: true, message: "Registration Complete!", success: true})
            }else{
                setLoading(false);
                setModal({show: true, message: response.data.message, success: false});
            }
        }).catch(err =>{
            setLoading(false);
            setModal({show:true, message: "There was an error processing the request", success: false});
        });
    }


    const handleLoginClick = () => {
        if(errors.usernameError === "" && errors.passwordError === ""){
            if(credentials.username !== "" && credentials.password !== ""){
                setMainLoading(true);
                login()
            }else{
                let usernameError = "", passwordError = ""
                if (credentials.username === "" && usernameRef.current) {
                    usernameRef.current.style.border = '2px solid red';
                    usernameError = "Username is required"
                }
    
                if (credentials.password === "" && passwordRef.current) {
                    passwordRef.current.style.border = '2px solid red';
                    passwordError = "Password is required"
                }
    
                setErrors({...baseErrors, usernameError: usernameError, passwordError: passwordError});
            }
            
        }
    }

    async function login(){
        await axios({
            method: 'post',
            url: '/login',
            data: {
                username: credentials.username,
                password: credentials.password
            }
            
        }).then( async(response) => {
            if(response.data.success){
                navigate('/');
            }else{
                setMainLoading(false);
                setErrors({...baseErrors, mainError: response.data.message});
            }
        }).catch(err =>{
            if(err.response.status === 401){
                setErrors({...baseErrors, mainError: err.response.data.message});
            }
            setMainLoading(false);
        });
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        
        setCredentials({...credentials, [name]: value})

        const validCharactersRegex = /^[a-zA-Z0-9-_]+$/;

        if (value !== "" && !validCharactersRegex.test(value)) {
        
            switch(name){
                case 'username':
                    if (usernameRef.current) {
                        usernameRef.current.style.border = '2px solid red';
                        setErrors({...errors, usernameError: "Use only letters, numbers, dashes, and hyphens", mainError: ""})
                    }
                    break;

                case 'password':
                    if (passwordRef.current) {
                        passwordRef.current.style.border = '2px solid red';
                        setErrors({...errors, passwordError: "Use only letters, numbers, dashes, and hyphens", mainError: ""})
                    }
                    break;

                case 'confirmPassword':
                    if (confirmPasswordRef.current) {
                        confirmPasswordRef.current.style.border = '2px solid red';
                        setErrors({...errors, confirmPasswordError: "Use only letters, numbers, dashes, and hyphens", mainError: ""})
                    }
                    break;
            }
        } else {
            switch(name){
                case 'username':
                    if (usernameRef.current) {
                        usernameRef.current.style.border = '1px solid rgb(201, 201, 201)';
                        setErrors({...errors, usernameError: "", mainError: ""});
                    }
                    break;

                case 'password':
                    if (passwordRef.current) {
                        passwordRef.current.style.border = '1px solid rgb(201, 201, 201)';
                        setErrors({...errors, passwordError: "", mainError: ""})
                    }
                    break;

                case 'confirmPassword':
                    if (confirmPasswordRef.current) {
                        confirmPasswordRef.current.style.border = '1px solid rgb(201, 201, 201)';
                        setErrors({...errors, confirmPasswordError: "", mainError: ""})
                    }
                    break;
            }
        }
        
    }

    return (
        <>  
            {mainLoading && <article className={`flex w-full justify-center items-center h-screen`}>
                <PulseLoader
                    color="#1fa5cf"
                    loading={true}
                    size={22}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    speedMultiplier={1}
                />
            </article>}

            {modal.show && <>
                <article className="h-screen vw-100 modalAreaCover">
                    <article className="h-screen w-full modalAreaContainer flex justify-center">
                        <section className="queueModalContainer">
                            {loading && <article className={`flex w-full justify-center items-center h-full`}>
                                <PulseLoader
                                    color="#1fa5cf"
                                    loading={true}
                                    size={12}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                    speedMultiplier={1}
                                />
                            </article>}

                            {!loading && <>
                                <div className="w-100 text-center mt-32">
                                    <p className="text-base normalFont pl-8 pr-8">{modal.message}</p>
                                </div>

                                <div className="w-100 mt-36 flex justify-center">
                                    <button className="modalButton font-medium normalFont" onClick={() => {
                                        if(modal.success){
                                            setCredentials(baseCredentials);
                                            setShowRegister(false);
                                        }
                                        setModal({message: "", show: false, success: false});
                                    }}>Close</button>
                                </div>
                            </>}
                        </section>
                    </article>
                </article>
            </>}

            {!mainLoading && <>
                <article className="pt-8 text-center">
                    <p className="font-medium text-7xl bigFont">BookMe</p>
                </article>

                <article className="mt-8 flex justify-center">
                    {errors.mainError !== "" && <p className="font-medium text-base text-red-600">{errors.mainError}</p>}
                </article>
                {!showRegister && <>
                        <article className="mt-24 flex justify-center">
                            <div className={`relative ${styles.inputContainer}`}>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    name="username"
                                    onChange={handleInputChange}
                                    className={`${styles.input} pl-2 pr-2 normalFont w-full`}
                                    value={credentials.username}
                                    ref={usernameRef}
                                />
                                {errors.usernameError !== "" && <label
                                    className="absolute top-0 right-0 mt-1 mr-2 text-red-600 text-xs font-medium"
                                >
                                    {errors.usernameError}
                                </label>}
                            </div>
                        </article>
                    

                    <article className='mt-16 flex justify-center'>
                        <div className={`relative ${styles.inputContainer}`}>
                            <input 
                                type="password" 
                                placeholder="Password" 
                                name="password" 
                                onChange={handleInputChange} 
                                className={`${styles.input} pl-2 pr-2 normalFont w-full`} 
                                value={credentials.password} 
                                ref={passwordRef} 
                            />
                            {errors.passwordError !== "" && <label
                                    className="absolute top-0 right-0 mt-1 mr-2 text-red-600 text-xs font-medium"
                                >
                                    {errors.passwordError}
                                </label>}
                            </div>
                    </article>

                    <article className='mt-16 flex justify-center'>
                        <p className={`${styles.register} text-sm normalFont`} onClick={() => {
                            setErrors(baseErrors);
                            setCredentials(baseCredentials);
                            setShowRegister(true);
                        }}>don't have an account? click here to register</p>
                    </article>

                    <article className='mt-40 flex justify-center'>
                        <button className={`${styles.button}`} onClick={() => handleLoginClick()}>
                            Login
                        </button>
                    </article>
                </>}


                {showRegister && <>
                    <article className="mt-24 flex justify-center">
                            <div className={`relative ${styles.inputContainer}`}>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    name="username"
                                    onChange={handleInputChange}
                                    className={`${styles.input} pl-2 pr-2 normalFont w-full`}
                                    value={credentials.username}
                                    ref={usernameRef}
                                />
                                {errors.usernameError !== "" && <label
                                    className="absolute top-0 right-0 mt-1 mr-2 text-red-600 text-xs font-medium"
                                >
                                    {errors.usernameError}
                                </label>}
                            </div>
                        </article>
                    

                    <article className='mt-16 flex justify-center'>
                        <div className={`relative ${styles.inputContainer}`}>
                            <input 
                                type="password" 
                                placeholder="Password" 
                                name="password" 
                                onChange={handleInputChange} 
                                className={`${styles.input} pl-2 pr-2 normalFont w-full`} 
                                value={credentials.password} 
                                ref={passwordRef} 
                            />
                            {errors.passwordError !== "" && <label
                                    className="absolute top-0 right-0 mt-1 mr-2 text-red-600 text-xs font-medium"
                                >
                                    {errors.passwordError}
                                </label>}
                            </div>
                    </article>

                    <article className='mt-16 flex justify-center'>
                        <div className={`relative ${styles.inputContainer}`}>
                            <input 
                                type="password" 
                                placeholder="Confirm Password" 
                                name="confirmPassword" 
                                onChange={handleInputChange} 
                                className={`${styles.input} pl-2 pr-2 normalFont w-full`} 
                                value={credentials.confirmPassword} 
                                ref={confirmPasswordRef} 
                            />
                            {errors.confirmPasswordError !== "" && <label
                                    className="absolute top-0 right-0 mt-1 mr-2 text-red-600 text-xs font-medium"
                                >
                                    {errors.confirmPasswordError}
                                </label>}
                        </div>
                    </article>

                    <article className='mt-16 flex justify-center'>
                        <p className={`${styles.register} text-sm normalFont`} onClick={() => {
                            setErrors(baseErrors);
                            setCredentials(baseCredentials);
                            setShowRegister(false);
                        }}>already have an account? login here</p>
                    </article>

                    <article className='mt-24 flex justify-center'>
                        <button className={`${styles.button}`} onClick={() => handleRegisterClick()}>
                            Register
                        </button>
                    </article>
                </>}
            </>}
            
        </>
    )
}

export default LoginView
