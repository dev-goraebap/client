export type RegisterDTO = {
    readonly email: string;
    readonly password: string;
}

export type LoginDTO = & RegisterDTO;

export type VerifyOtpDTO = {
    readonly email: string;
    readonly otp: string;
}

export enum JwtResultStatus {
    SUCCESS = 'SUCCESS',
    NEED_OTP = 'NEED_OTP',
}

export type JwtResultDTO = {
    status: JwtResultStatus;
    accessToken: string | null;
    expiresIn: number | null;
    refreshToken: string | null;
}

export type ProfileResultDTO = {
    id: string;
    nickname: string;
    email: string;
    createdAt: Date;
}