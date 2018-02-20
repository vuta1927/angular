export class Utils {

    public static maskToString(
        mask: string | RegExp | Array<string | RegExp>): string | string[] | null {

        if (typeof mask === 'string') {

            return mask as string;

        } else if (mask instanceof RegExp) {

            return mask.toString();

        } else if (Array.isArray(mask)) {

            return mask.map((value) => Utils.maskToString(value)) as string[];
        }

        return null;
    }

    public static maskFromString(
        mask: string | string[]): string | RegExp | Array<string | RegExp> | null {

        if (typeof mask === 'string') {

            const isRegExp = (mask as string).startsWith('/') && (mask as string).endsWith('/');

            return isRegExp ? new RegExp((mask as string).slice(1, mask.length - 1)) : mask;

        } else if (Array.isArray(mask)) {

            return (mask as string[]).map((value) => Utils.maskFromString(value)) as string[];
        }

        return null;
    }

    public static merge(value: any, baseValue: any = null): any {

        if (value === undefined || value === null) {
            return baseValue;
        }

        if (typeof value === 'object') {

            for (const property in value) {

                if (value.hasOwnProperty(property) && typeof value[property] === 'object') {

                    value[property] = Utils.merge(value[property], baseValue
                        ? baseValue[property]
                        : null);
                }
            }

            return baseValue !== null ? Object.assign(baseValue, value) : value;
        }

        return value;
    }

    public static parseJSONReviver(_key: string, value: any): any {

        const regexDateISO =
            /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

        return typeof value === 'string' && regexDateISO.test(value) ? new Date(value) : value;
    }
}
