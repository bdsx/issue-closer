
import * as core from '@actions/core';

enum KeyOption {
    Required,
    Optional,
}
type OptionsToObject<T extends Record<string, KeyOption>> = {
    [key in keyof T]:T[key] extends KeyOption.Optional ? undefined|string : string;
};
export function getInputs<T extends Record<string, KeyOption>>(obj:T):OptionsToObject<T> {
    let failed = false;
    const out = {} as OptionsToObject<T>;
    for (const [key, opts] of Object.entries(obj)) {
        const v = core.getInput(key);
        switch (opts) {
        case KeyOption.Optional:
            if (v !== '') out[key as keyof T] = v;
            break;
        case KeyOption.Required:
            if (v === '') {
                core.error(`'${key}' input required`);
                failed = true;
            } else {
                out[key as keyof T] = v;
            }
            break;
        }
    }
    if (failed) throw Error(`Invalid inputs`);
    return out;
}
