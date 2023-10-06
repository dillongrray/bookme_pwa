import React, {useState, useEffect, useContext} from 'react'
import PulseLoader from "react-spinners/PulseLoader"
import styles from '../styles/dashboard.module.css'
import NavBar from './navBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { StateContext } from '../util/stateContext';
import ModalView from './modalView';
import { errorType } from '../util/interfaces';


type bookType = {
    book_id: number,
    book_quantity: number,
    book_image_location: string,
    book_name: string
}

const Books = () => {

    const navigate = useNavigate();

    const {onlineStatus} = useContext(StateContext);

    const [books, setBooks] = useState<Array<bookType>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<errorType>({show: false, message: ""});
    const [showModal, setShowModal] = useState<boolean>(false);

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
                url: '/getBooks',
                withCredentials: true
                
            }).then( async(response) => {
                if(response){
                    setBooks(response.data.books);
                    setLoading(false);
                }
    
            }).catch(err =>{
                if (!onlineStatus) {
                    setError({show: true, message: "Unable to fetch books, please try again later"});
                    setShowModal(true);
                    setLoading(false);
                } else {
                    if (err.response) {
                        if(err.response.status === 401){
                            navigate('/login');
                        }else{
                            setError({show: true, message: "There was an issue while fetching books, please try again later"});
                            setShowModal(true);
                            setLoading(false);
                        }
                    } 
                    

                }
            })
        }
        if(mounted)
            checkCredentials();

        return () => {
            mounted = false;
        }
    }, [])

    return (
        <>
            {loading && <article className={`flex w-full justify-center items-center h-screen`}>
                <PulseLoader
                      color="#1fa5cf"
                      loading={loading}
                      size={22}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                      speedMultiplier={1}
                  />
            </article>}

            {!loading && <>
                {showModal && <ModalView message={error.message} navigation="/" buttonName='Close' loading = {false} doNavigate={false} setShowModal={setShowModal}/>}
                <NavBar />
                <article className="pt-4 text-center">
                    <p className="font-medium md:text-7xl text-5xl bigFont">Library</p>
                </article>

                {!error.show && <article className={`${styles.bookContainer} flex flex-wrap w-100 pl-10 pr-10 mt-12 lg:mb-0 mb-20`}>
                    {books && books.length > 0 && books.map((data: bookType, index: number) => {
                        return(
                            <section key={index} className={`lg:w-1/3 w-full p-4 ${index >= 3 ? 'mt-52' : index === 0? 'lg:mt-12 mt-0' :'lg:mt-12 mt-52'} `}>
                                <div className="flex flex-row justify-center">
                                    <p className="font-medium text-lg normalFont">{data.book_name} ({data.book_quantity})</p>
                                </div>

                                <div className="flex flex-row justify-center align-center mt-4">
                                    <div className={`${styles.imageContainer} cursor`} onClick={() => {
                                        navigate(`/library/${data.book_id}`);
                                    }}>
                                        <img
                                            src={data.book_image_location}
                                            alt="Book Cover"
                                            width={300}
                                            height={300}
                                        />
                                    </div>
                                </div>
                            </section>
                        )
                    })}
                </article>}
            </>}
        </>
    )
}

export default Books;
