import { Injectable } from "@angular/core";
import { Preferences } from "@capacitor/preferences";

@Injectable({
    providedIn: 'root'
})
export class LocalTokenStorage {

    private accessToken: string | null = null;
    private expiresIn: number | null = null;

    private refreshTokenKey: string = 'RT';

    getAccessToken(): string | null {
        return this.accessToken;
    }

    async getRefreshToken(): Promise<string | null> {
        const result = await Preferences.get({ key: this.refreshTokenKey });
        return result.value ?? null;
    }

    isExpiringSoon(): boolean {
        if (!this.expiresIn) {
            return true;
        }
        const expiresIn = this.expiresIn * 1000;
        const fiveMinutes = 5 * 60 * 1000; // 5분

        const timeUntilExpiry = expiresIn - Date.now();

        // 만료되었거나 5분 이하로 남은 경우
        return timeUntilExpiry <= fiveMinutes;
    }

    async store(accessToken: string, expiresIn: number, refreshToken: string): Promise<void> {
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
        await Preferences.set({ key: this.refreshTokenKey, value: refreshToken });

        console.log('accessToken', this.accessToken);
        console.log('expiresIn', this.expiresIn);
        console.log('refreshToken', await Preferences.get({ key: this.refreshTokenKey }));
    }

    async clear() {
        this.accessToken = null;
        this.expiresIn = null;
        await Preferences.remove({ key: this.refreshTokenKey });
    }
}