import { FormControl } from "@angular/forms";

export type ToFormGroup<T> = {
    [K in keyof T]: FormControl<T[K]>;
};