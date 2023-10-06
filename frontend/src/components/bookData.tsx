import {useState, useEffect, useContext} from 'react'
import PulseLoader from "react-spinners/PulseLoader"
import styles from '../styles/userBook.module.css'
import NavBar from './navBar';
import axios from 'axios';
import {useParams} from 'react-router-dom'
import ModalView from './modalView';
import { StateContext } from '../util/stateContext';
import { queueData } from '../util/interfaces';
import { addActionToQueue, checkActionExists } from '../util/indexedDBHelper';
import { useNavigate } from 'react-router-dom';


type Modal = {
    show: boolean,
    loading: boolean,
    message: string
}

type bookType = {
    book_id: number,
    book_description: string,
    book_name: string,
    book_quantity: number,
    book_image_location: string
}

const BookData = () => {
    const navigate = useNavigate();

    const {onlineStatus} = useContext(StateContext)
    const [book, setBook] = useState<bookType>({book_id: -1, book_description: "", book_image_location: "", book_name: "", book_quantity: -1});
    const [loading, setLoading] = useState<boolean>(true);
    const [modal, setModal] = useState<Modal>({loading: false, show: false, message: ""});
    const [error, setError] = useState<boolean>(false);
    const [borrowError, setBorrowError] = useState<boolean>(false);

    const params = useParams();
    const {id} = params;



    useEffect(() => {
        let mounted = true;

        const checkCredentials = async () => {
            await axios({
                method: 'get',
                url: '/auth',
                withCredentials: true
                
            }).then( async(response) => {
                if(response){
                    getData();
                }
    
            }).catch(err =>{
                if (!onlineStatus) {
                    getData();
                } else {
                    if(err.response.status === 401){
                        navigate('/login');
                    }else{
                        navigate('/login');
                    }
                }
            })
        }

        const getData = async () => {
            await axios({
                method: 'get',
                url: '/getBook',
                params: {
                    id: id
                },
                withCredentials: true
                
            }).then( async(response) => {
                if(response){
                    setBook(response.data.book);
                    setLoading(false);
                }
    
            }).catch(err => {
                if (!onlineStatus) {
                    setError(true);
                } else {
                    if (err.response) {
                        if(err.response.status === 401){
                            navigate('/login');
                        }else{
                            setError(true);
                        }
                    } 
                    

                }
                
            });
        }
        if(mounted && id !== undefined)
            checkCredentials();

        return () => {
            mounted = false;
        }
    }, [id, onlineStatus])


    const borrowBook = async() => {
        if(onlineStatus){
            await axios({
                method: 'post',
                url: '/borrowBook',
                data: {
                    id: id
                },
                withCredentials: true
                
            }).then( async(response) => {
                if(response){
                    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                        navigator.serviceWorker.controller.postMessage({
                        type: 'INVALIDATE_CACHE',
                        payload: {
                            cacheNames: ['books', 'user-books', 'book-details']
                        }
                        });
                    }
                    setModal({...modal, loading: false, show: true});
                }

            }).catch(err => {
                if (err.response) {
                    if(err.response.code === 401){
                        navigate('/login');
                    }else{
                        setModal({...modal, message: err.response.data.message})
                        setBorrowError(true);
                    }
                } 
                
                
            });
        }else{
            handleAddData();
        }
    }


    const handleAddData = async () => {
        const queueData:queueData = {
            queue_key: String(book.book_id),
            queue_action: "Borrow",
            queue_details: {
                item_id: book.book_id,
                item_name: book.book_name
            }
        }
        
        try {
            const exists = await checkActionExists(queueData);
        
            if (exists) {
                setModal({loading: false, show: true, message: "This action is already in the queue."});
            } else {
                await addActionToQueue(queueData);
        
                if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({
                      type: 'QUEUE_DB_CHANGED',
                    });
                }
        
                setModal({loading: false, show: true, message: "The book will be borrowed when you are back online"});
                console.log("Data added:", queueData);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <>
            {loading && <>
                {error && <ModalView message='Unable to fetch book details, please try again later' navigation="/library" buttonName='Back' loading = {false}/> }
                <article className={`flex w-full justify-center items-center h-screen`}>
                    <PulseLoader
                        color="#1fa5cf"
                        loading={loading}
                        size={22}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        speedMultiplier={1}
                    />
                </article>
            </>}

            {!loading && <>
                {error && <ModalView message='Unable to make request, please try again later' navigation="/library" buttonName='Back' loading = {false}/> }
                {modal.show && <ModalView message={modal.message !== ""? modal.message:'Book has been borrowed'} navigation="/library" loading={modal.loading} />}
                {borrowError && <ModalView message={modal.message} navigation="/" buttonName='Close' loading = {false} doNavigate={false} setShowModal={setBorrowError}/>}
                <NavBar />
                <article className="pt-4 text-center">
                    <p className="font-medium md:text-5xl text-2xl bigFont">{book.book_name} ({book.book_quantity})</p>
                </article>

                <article className={`${styles.detailsContainer} mt-8 w-100 flex flex-wrap`}>
                    <section className="lg:w-3/6 w-full h-100 flex justify-center items-center">
                        <div className={`${styles.imageContainer}`}>
                            <img
                                src={book.book_image_location}
                                alt="Book Cover"
                                width={350}
                            />
                        </div>
                    </section>

                    <section className="lg:w-3/6 lg:mt-0 mt-8 w-full h-100">
                        <div className={`${styles.descriptionContainer} w-100 p-3 pt-24 text-center`}>
                            <p className="normalFont">{book.book_description}</p>
                        </div>

                        <div className="w-100 lg:pb-0 pb-8 lg:mt-0 mt-10 flex justify-center">
                            <button className={`${styles.returnBook}`} onClick={() => borrowBook()} disabled = {book.book_quantity > 0? false: true}>Borrow Book</button>
                        </div>
                    </section>
                </article>
            </>}
        </>
    )
}

export default BookData;
