import { constructor } from "tsyringe/dist/typings/types";
import glob from "glob";

/**
 * Auto discover and import the default export from directory.
 * @param base base directory
 * @returns injectables
 */
export function autoDiscover<T>(base: string): constructor<T>[] {
    // find all matching files    
    const files = glob.sync(`${__dirname}/../${base}/**/*.{ts,js}`)

    // require default export from all mathcing files
    return files.map(file => require(file).default).filter(Boolean)
}
