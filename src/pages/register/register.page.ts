import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { tap } from "rxjs";
import { AuthService, RegisterDTO, VerifyOtpDTO } from "src/entities/user";
import { ToFormGroup } from "src/shared/types";

@Component({
    selector: 'register-page',
    imports: [
        ReactiveFormsModule
    ],
    template: `
    <div>
        <h1>회원가입</h1>
        <form [formGroup]="formGroup" (ngSubmit)="onSubmit()">
            <input type="text" placeholder="이메일" formControlName="email"/>
            <input type="text" placeholder="비밀번호" formControlName="password"/>
            <button>회원가입</button>
        </form>
        <form [formGroup]="formGroup2" (ngSubmit)="onSubmit2()">
            <input type="text" placeholder="OTP" formControlName="otp"/>
            <button>OTP인증</button>
        </form>
    </div>
    `,
})
export class RegisterPage {

    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly authService: AuthService = inject(AuthService);

    readonly formGroup: FormGroup<ToFormGroup<RegisterDTO>> = this.fb.group({
        email: this.fb.nonNullable.control(''),
        password: this.fb.nonNullable.control('')
    });

    readonly formGroup2: FormGroup = this.fb.group({
        otp: this.fb.nonNullable.control('')
    });

    onSubmit() {
        const value: RegisterDTO = this.formGroup.getRawValue();
        this.authService.register(value).pipe(
            tap(console.log)
        ).subscribe();
    }

    onSubmit2() {
        const value: RegisterDTO = this.formGroup.getRawValue();
        const value2 = this.formGroup2.getRawValue();
        const otp = value2.otp as string;

        const dto: VerifyOtpDTO = {
            email: value.email,
            otp
        }

        console.log(dto);

        this.authService.verifyOtp(dto).pipe(
            tap(console.log)
        ).subscribe();
    }
}