import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { tap } from "rxjs";
import { AuthService, JwtResultDTO, JwtResultStatus, LoginDTO } from "src/entities/user";
import { ToFormGroup } from "src/shared/types";

@Component({
    selector: 'login-page',
    imports: [
        ReactiveFormsModule
    ],
    template: `
    <div>로그인</div>
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit()">
      <input type="text" placeholder="이메일" formControlName="email"/>
      <input type="password" placeholder="비밀번호" formControlName="password"/>
      <button>로그인</button>  
    </form>
    `,
})
export class LoginPage {
    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly authService: AuthService = inject(AuthService);
    private readonly router: Router = inject(Router);

    readonly formGroup: FormGroup<ToFormGroup<LoginDTO>> = this.fb.group({
        email: this.fb.nonNullable.control(''),
        password: this.fb.nonNullable.control(''),
    });

    onSubmit() {
        const value: LoginDTO = this.formGroup.getRawValue();
        this.authService.login(value).pipe(
            tap((res: JwtResultDTO) => {
                if (res.status === JwtResultStatus.NEED_OTP) {
                    alert('otp 발송');
                } else {
                    this.router.navigateByUrl('/profile');
                }
            })
        ).subscribe();
    }
}