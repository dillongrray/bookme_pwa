<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;

class JWT_AUTH
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $response = new Response();
        $didRefresh = false;
        if($request->hasCookie('access_token')){
            $token = $request->cookie('access_token');
        }else{
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try{
            $decoded = JWT::decode($token, new Key(env('JWT_SECRET'), env('JWT_ALGORITHM')));
            $user = $decoded->user;
        } catch (ExpiredException $e){

            if($request->hasCookie('refresh_token')){
                $refresh_token = $request->cookie('refresh_token');
            }else{
                return response()->json(['error' => 'Unauthorized'], 401);
            }
            try{
                $refresh_decoded = JWT::decode($refresh_token, new Key(env('JWT_SECRET'), env('JWT_ALGORITHM')));
            }catch (ExpiredException $e){
                return response()->json(['error' => 'Unauthorized, refresh token expired'], 401);
            }catch (\Exception $e){
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $accessPayload = [
                'user' => $refresh_decoded->user,
                'exp' => time() + (env('JWT_ACCESS_TOKEN_LIFETIME') * 60),
                'iat' => time(),
            ];

            $accessToken = JWT::encode($accessPayload, env('JWT_SECRET'), env('JWT_ALGORITHM'));


            $user = $refresh_decoded->user;
            $response->cookie(env('JWT_AUTH_COOKIE'), $accessToken, (env('JWT_ACCESS_TOKEN_LIFETIME') * 60), env('JWT_AUTH_COOKIE_PATH'), env('JWT_AUTH_COOKIE_DOMAIN'), env('JWT_AUTH_COOKIE_SECURE'), env('JWT_AUTH_COOKIE_HTTP_ONLY'));
            $didRefresh = true;
        }
        catch (\Exception $e){
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        $request->attributes->add(['user' => $user, 'did_refresh' => $didRefresh, "response" => $response]);

        // Continue to the next middleware or route
        return $next($request);
    }
}
