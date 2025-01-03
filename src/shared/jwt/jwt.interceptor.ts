import { HttpContext, HttpContextToken, HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

import { LocalTokenStorage } from "./local-token.storage";
import { RefreshService } from "./refresh.service";

/**
 * jwtInterceptor를 건너뜀
 */
const skipJwtContextToken = new HttpContextToken<boolean>(() => false);

export function skipAuth(): HttpContext {
    return new HttpContext().set(skipJwtContextToken, true);
}

let isRefreshing: boolean = false;

/**
 * 1. JWT 인증이 필요한 API라고 판단 되면 -> 요청에 Bearer {token} 해더를 넣어주기
 * 2. JWT 유효기간이 Null이거나, 만료직전이거나 (5분 이하 남음), 만료가 됐다면 -> 토큰 재발급 요청을 해주기
 * 2-1. 토큰 재발급 요청중에 들어온 요청들을 어떻게 해야하는가? -> 토큰을 재발급 중이라는 `플래그` 를 만들어서 임시 대기열(배열)에 넣어두기
 * 2-2. 재발급이 끝나면 대기열에 있는 요청들을 일괄 보내주기
 * 2-error. 재발급 요청이 실패하면 -> 인증만료 에러 (피드백, 로그인 페이지 이동 등등
 */
export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    // 1. JWT 인증이 필요한 API가 아니면 그냥 넘어가기
    if (req.context.get(skipJwtContextToken)) {
        return next(req);
    }

    const tokenStorage: LocalTokenStorage = inject(LocalTokenStorage);
    const refreshService: RefreshService = inject(RefreshService);
    const router: Router = inject(Router);

    // 2. 엑세스토큰이 없거나, 만료직전이거나, 만료가 되었는가? -> 토큰 재발급 요청을 해주기
    if (tokenStorage.isExpiringSoon()) { // YES
        if (!isRefreshing) {
            isRefreshing = true;

            refreshService.refresh()
                .catch(() => {
                    window.alert('로그인 정보가 만료되었습니다. 다시 로그인해주세요.');
                    router.navigateByUrl('/');
                })
                .finally(() => {
                    isRefreshing = false;
                });
        }

        // 일단 현재 실패할 요청을 대기열에 저장하기
        return new Observable(observer => {
            refreshService.addPendingRequest((accessToken: string | null) => {
                if (accessToken) {
                    const updatedReq = req.clone({
                        headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
                    });
                    next(updatedReq).subscribe(observer);
                } else {
                    console.log('엑세스토큰 없음!!');
                    observer.error(async (err: HttpErrorResponse) => {
                        console.error(err);
                        console.error('인증이 필요한 API 재요청 실패');
                        await tokenStorage.clear();
                        window.alert('로그인 정보가 만료되었습니다. 다시 로그인해주세요.');
                        router.navigateByUrl('/');
                    });
                }
            });
        });
    }

    const accessToken = tokenStorage.getAccessToken();
    // JWT 유효기간이 Null이거나, 만료직전이거나 (5분 이하 남음), 만료가 됐다면 -> 토큰 재발급 요청을 해주기
    const updatedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
    });
    return next(updatedReq);
}