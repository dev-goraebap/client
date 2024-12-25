import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { tap } from "rxjs";
import { environment } from "src/shared/environments";
import { LocalTokenStorage } from "src/shared/jwt";
import { JwtResultDTO, JwtResultStatus, LoginDTO, ProfileResultDTO, RegisterDTO, VerifyOtpDTO } from "../types";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly httpClient: HttpClient = inject(HttpClient);

    login(dto: LoginDTO) {
        return this.httpClient.post<JwtResultDTO>(`${environment.apiUrl}/api/v1/auth/login`, dto).pipe(
            tap(async (res: JwtResultDTO) => {
                if (res.status === JwtResultStatus.SUCCESS) {
                    const tokenStorage: LocalTokenStorage = LocalTokenStorage.getInstance();
                    await tokenStorage.store(res.accessToken as string, res.expiresIn as number, res.refreshToken as string);
                }
            })
        )
    }

    register(dto: RegisterDTO) {
        return this.httpClient.post(`${environment.apiUrl}/api/v1/auth/register`, dto);
    }

    verifyOtp(dto: VerifyOtpDTO) {
        return this.httpClient.post(`${environment.apiUrl}/api/v1/auth/verify-otp`, dto);
    }

    getProfile() {
        return this.httpClient.get<ProfileResultDTO>(`${environment.apiUrl}/api/v1/users/me`);
    }
}