import { Preferences } from "@capacitor/preferences";

export class LocalTokenStorage {

    /**
     * 싱글톤 패턴을 위한 프로퍼티
     */
    private static instance: LocalTokenStorage;

    private accessToken: string | null = null;
    private expiresIn: number | null = null;

    private refreshTokenKey: string = 'RT';

    private constructor() { }

    static getInstance(): LocalTokenStorage {
        if (!this.instance) {
            this.instance = new LocalTokenStorage();
        }
        return this.instance;
    }

    getAccessToken(): string | null {
        return this.accessToken;
    }

    async store(accessToken: string, expiresIn: number, refreshToken: string): Promise<void> {
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
        await Preferences.set({ key: this.refreshTokenKey, value: refreshToken });

        console.log('accessToken', this.accessToken);
        console.log('expiresIn', this.expiresIn);
        console.log('refreshToken', await Preferences.get({ key: this.refreshTokenKey }));
    }
}