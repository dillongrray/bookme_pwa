<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;

use App\Models\Book;
use App\Models\Borrowed;
use App\Models\Login;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;


class indexController extends Controller
{
    public function getBooks(Request $request){
        $books = Book::get(['book_id', 'book_name', 'book_quantity', 'book_image_location']);
        $response = $request->attributes->get('response');
        $response->setContent(['success' => true, 'books' => $books]);
        $response->setStatusCode(200);
        return $response;
    }

    public function getBook(Request $request){
        $data = $request->all();
        $response = $request->attributes->get('response');

        $book = Book::where('book_id', $data['id'])->first(['book_name', 'book_image_location', 'book_quantity', 'book_description', 'book_id']);

        if(!$book){
            
            $response->setContent(["message" => "Book does not exist"]);
            $response->setStatusCode(404);
            return $response;
        }

        $response->setContent(['book' => $book]);
        $response->setStatusCode(200);
        return $response;
    }

    public function getBorrowedBook(Request $request){
        $data = $request->all();
        $response = $request->attributes->get('response');
        $userID= $request->attributes->get('user');

        $borrowedId = $data['id'];

        $borrowed = Borrowed::where('borrowed_id', $borrowedId)
                            ->where('user_id', $userID)
                            ->join('books', 'borroweds.book_id', '=', 'books.book_id')
                            ->first(['book_name', 'book_image_location', 'book_description', 'borrowed_id']);

        if ($borrowed) {
            $response->setContent(['borrowedBook' => $borrowed]);
            $response->setStatusCode(200);
            return $response;
        }

        $response->setContent(["message" => "Borrowed book not found"]);
        $response->setStatusCode(404);
        return $response;
    }


    public function borrowBook(Request $request){
        $data = $request->all();
        $response = $request->attributes->get('response');
        $userID= $request->attributes->get('user');

        $book = Book::where('book_id', (int) $data['id'])->first();
    
        if(!$book){
            $response->setContent(["message" => "Book does not exist"]);
            $response->setStatusCode(404);
            return $response;
        }

        $borrowedBook = Borrowed::where('user_id', $userID)
                                ->where('book_id', $book->book_id)
                                ->first();

        if($borrowedBook){
            $response->setContent(["message" => "Book has already been borrowed"]);
            $response->setStatusCode(404);
            return $response;
        }
    
        if($book->book_quantity > 0){
            $newQuantity = $book->book_quantity - 1;
            $newBorrow = new Borrowed();
            $newBorrow->book_id = $book->book_id;
            $newBorrow->user_id = $userID;
            $newBorrow->save();
    
            $book->update(['book_quantity' => $newQuantity]);
            $response->setContent(['message' => 'Book borrowed']);
            $response->setStatusCode(200);
            return $response;
        }else{
            $response->setContent(["message" => "Book is not in stock"]);
            $response->setStatusCode(404);
            return $response;
        }
    }


    public function getUserBooks(Request $request){
        $response = $request->attributes->get('response');
        $userID= $request->attributes->get('user');

        $userBooks = Borrowed::where('user_id', $userID)->join('books', 'borroweds.book_id', '=', 'books.book_id')->get(['borrowed_id', 'book_image_location', 'book_name']);

        $response->setContent(['userBooks' => $userBooks]);
        $response->setStatusCode(200);
        return $response;
    }


    public function returnBook(Request $request){
        $data = $request->all();
        $response = $request->attributes->get('response');
        $userID= $request->attributes->get('user');

        $borrowBook = Borrowed::where('borrowed_id', (int) $data['id'])
                                ->where('user_id', $userID)
                                ->first();
    
        if(!$borrowBook){
            $response->setContent(["message" => "Book was not borrowed"]);
            $response->setStatusCode(404);
            return $response;
        }
    
        $book = Book::where('book_id', $borrowBook->book_id)->first();
    
        if(!$book){
            $response->setContent(["message" => "Book does not exist"]);
            $response->setStatusCode(404);
            return $response;
        }
    
        $newQuantity = $book->book_quantity + 1;
        $book->update(['book_quantity' => $newQuantity]);
        $borrowBook->delete();

        $response->setContent(['message' => 'Book returned']);
        $response->setStatusCode(200);
        return $response;
    }


    public function login(Request $request){
        $response = new Response();
        $username = trim($request->input('username'));
        $password = trim($request->input('password'));

        $username = preg_replace("/[^a-zA-Z0-9-_]/", "", $username);
        $password = preg_replace("/[^a-zA-Z0-9-_]/", "", $password);

        try{
            $login = Login::where('username','=', $username)->first();

            if($login){
                if(Hash::check($password, $login->password)){

                    $accessPayload = [
                        'user' => $login->id,
                        'exp' => time() + (env('JWT_ACCESS_TOKEN_LIFETIME') * 60),
                        'iat' => time()
                    ];

                    $refreshPayload = [
                        'user' => $login->id,
                        'exp' => time() + (env('JWT_REFRESH_TOKEN_LIFETIME') * 60),
                        'iat' => time()
                    ];

                    $accessToken = JWT::encode($accessPayload, env('JWT_SECRET'), env('JWT_ALGORITHM'));
                    $refreshToken = JWT::encode($refreshPayload, env('JWT_SECRET'), env('JWT_ALGORITHM'));

                    $response->setContent(['success' => true, 'user_ID' => $login->id], 200)->setStatusCode(200);
                    $response->cookie(env('JWT_AUTH_COOKIE'), $accessToken, (env('JWT_ACCESS_TOKEN_LIFETIME') * 60), env('JWT_AUTH_COOKIE_PATH'), env('JWT_AUTH_COOKIE_DOMAIN'), env('JWT_AUTH_COOKIE_SECURE'), env('JWT_AUTH_COOKIE_HTTP_ONLY'));
                    $response->cookie(env('JWT_AUTH_COOKIE_REFRESH'), $refreshToken, (env('JWT_ACCESS_TOKEN_LIFETIME') * 60), env('JWT_AUTH_COOKIE_PATH'), env('JWT_AUTH_COOKIE_DOMAIN'), env('JWT_AUTH_COOKIE_SECURE'), env('JWT_AUTH_COOKIE_HTTP_ONLY'));
                    return $response;

                }else{
                    return response()->json(['success' => false, 'message' => 'Incorrect credentials'], 401);
                }
            }else{
                return response()->json(['success' => false, 'message' => 'Incorrect credentials'], 401);
            }

        }catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Incorrect credentials'], 401);
        }
    }


    public function register(Request $request){
        $username = trim($request->input('username'));
        $password = trim($request->input('password'));
        
        $username = preg_replace("/[^a-zA-Z0-9-_]/", "", $username);
        $password = preg_replace("/[^a-zA-Z0-9-_]/", "", $password);

        $user = Login::where('username', $username)->first();

        if($user){
            return response()->json(['success' => false, 'message' => 'Username already exists']);
        }else{
            $register = new Login();
            $register->username = $username;
            $register->password = Hash::make($password);
            $register->save();

            return response()->json(['success' => true], 200);
        }

        


    }

    public function auth(Request $request){
        $response = $request->attributes->get('response');
        $response->setContent(['success' => true]);
        return $response;
    }

    public function removeCookies(){
        $access_cookie = Cookie::forget(env('JWT_AUTH_COOKIE'), env('JWT_AUTH_COOKIE_PATH'), env('JWT_AUTH_COOKIE_DOMAIN'), env('JWT_AUTH_COOKIE_SECURE'), env('JWT_AUTH_COOKIE_HTTP_ONLY'));
        $refresh_cookie = Cookie::forget(env('JWT_AUTH_COOKIE_REFRESH'), env('JWT_AUTH_COOKIE_PATH'), env('JWT_AUTH_COOKIE_DOMAIN'), env('JWT_AUTH_COOKIE_SECURE'), env('JWT_AUTH_COOKIE_HTTP_ONLY'));
        $session_cookie = Cookie::forget('session_info', env('JWT_AUTH_COOKIE_PATH'), env('JWT_AUTH_COOKIE_DOMAIN'), env('JWT_AUTH_COOKIE_SECURE'), env('JWT_AUTH_COOKIE_HTTP_ONLY'));

        return response()->json([],200)
                        ->withCookie($access_cookie)->withCookie($refresh_cookie)->withCookie($session_cookie);
    }


}
