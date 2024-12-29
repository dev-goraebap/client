import { inject, Injectable } from "@angular/core";
import { LocalTokenStorage } from "./local-token.storage";

@Injectable({
    providedIn: 'root'
})
export class RefreshService {

    private readonly tokenStorage: LocalTokenStorage = inject(LocalTokenStorage);

    private refreshUrl: string | null = null;
    private pendingRequests: ((accessToken: string | null) => void)[] = [];

    /**
     * 사전에 토큰재발급 요청을 위한 URL을 초기화
     */
    initRefreshUrl(url: string) {
        this.refreshUrl = url;
    }

    addPendingRequest(callback: (accessToken: string | null) => void) {
        this.pendingRequests.push(callback);
    }

    async refresh(): Promise<void> {
        if (!this.refreshUrl) {
            throw new Error('토큰 재발급 URL이 초기화 되지 않았습니다.');
        }

        const refreshToken = await this.tokenStorage.getRefreshToken();

        try {
            const res = await fetch(this.refreshUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${refreshToken}`
                }
            });

            if (!res.ok) {
                // ... 토큰재발급 요청 마저 실패 ? -> 진짜 세션 만료 처리
                throw new Error('토큰 재발급 요청 실패');
            }

            // 토큰이 잘 발급이 되었다? -> 재발급한 토큰 정보를 다시 저장하고 다시 요청보내기
            const result = await res.json();

            // 저장 
            await this.tokenStorage.store(result.accessToken, result.expiresIn, result.refreshToken);

            // 다시 요청보내기 
            this.pendingRequests.forEach(callback => callback(result.accessToken));
        } catch (err) {
            console.error('토큰 재발급 요청 실패');
            await this.tokenStorage.clear();
            // 다시 요청보내기 
            this.pendingRequests.forEach(callback => callback(null));
            throw err;
        } finally {
            this.pendingRequests = [];
        }
    }
}