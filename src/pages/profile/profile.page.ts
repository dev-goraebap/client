import { Component, inject } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { tap } from "rxjs";
import { AuthService, ProfileResultDTO } from "src/entities/user";

@Component({
    selector: 'profile-page',
    imports: [
        ReactiveFormsModule
    ],
    template: `
    <div>
        프로필 페이지
    </div>
    `,
})
export class ProfilePage {

    private readonly authService: AuthService = inject(AuthService);

    constructor() {
        this.authService.getProfile().pipe(
            tap((res: ProfileResultDTO) => {
                console.log(res);
            })
        ).subscribe();
        this.authService.getProfile().pipe(
            tap((res: ProfileResultDTO) => {
                console.log(res);
            })
        ).subscribe();
        this.authService.getProfile().pipe(
            tap((res: ProfileResultDTO) => {
                console.log(res);
            })
        ).subscribe();
        this.authService.getProfile().pipe(
            tap((res: ProfileResultDTO) => {
                console.log(res);
            })
        ).subscribe();
        this.authService.getProfile().pipe(
            tap((res: ProfileResultDTO) => {
                console.log(res);
            })
        ).subscribe();
    }
}