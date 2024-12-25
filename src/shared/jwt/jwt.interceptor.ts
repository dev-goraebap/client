/**
 * 1. JWT 인증이 필요한 API라고 판단 되면 -> 요청에 Bearer {token} 해더를 넣어주기
 * 2. JWT 유효기간이 Null이거나, 만료직전이거나 (5분 이하 남음), 만료가 됐다면 -> 토큰 재발급 요청을 해주기
 * 2-1. 토큰 재발급 요청중에 들어온 요청들을 어떻게 해야하는가? -> 토큰을 재발급 중이라는 `플래그` 를 만들어서 임시 대기열(배열)에 넣어두기
 * 2-2. 재발급이 끝나면 대기열에 있는 요청들을 일괄 보내주기
 * 2-error. 재발급 요청이 실패하면 -> 인증만료 에러 (피드백, 로그인 페이지 이동 등등)
 */

import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { LocalTokenStorage } from "./local-token.storage";

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    console.log('jwtInterceptor');

    const tokenStorage = LocalTokenStorage.getInstance();
    const accessToken = tokenStorage.getAccessToken();

    // JWT 유효기간이 Null이거나, 만료직전이거나 (5분 이하 남음), 만료가 됐다면 -> 토큰 재발급 요청을 해주기

    const updatedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
    });
    return next(updatedReq);
}