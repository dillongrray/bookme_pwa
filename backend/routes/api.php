<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\JWT_AUTH;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/



    Route::post('/register', 'App\Http\Controllers\indexController@register');
    Route::post('/login', 'App\Http\Controllers\indexController@login');
    Route::get('/removeCookies', 'App\Http\Controllers\indexController@removeCookies');

    Route::middleware([JWT_AUTH::class])->group(function () {
        Route::get('/getBooks','App\Http\Controllers\indexController@getBooks');
        Route::get('/auth','App\Http\Controllers\indexController@auth');
        Route::get('/getBook','App\Http\Controllers\indexController@getBook');
        Route::get('/getBorrowedBook','App\Http\Controllers\indexController@getBorrowedBook');
        Route::get('/getUserBooks','App\Http\Controllers\indexController@getUserBooks');
        Route::post('/borrowBook','App\Http\Controllers\indexController@borrowBook');
        Route::post('/returnBook','App\Http\Controllers\indexController@returnBook');
    });




