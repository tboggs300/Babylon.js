import { Logger } from "./logger";
import { GetClass } from "./typeStore";

/**
 * Class used to enable instantiation of objects by class name
 */
export class InstantiationTools {
    /**
     * Use this object to register external classes like custom textures or material
     * to allow the loaders to instantiate them
     */
    public static RegisteredExternalClasses: { [key: string]: object } = {};

    /**
     * Tries to instantiate a new object from a given class name
     * @param className defines the class name to instantiate
     * @returns the new object or null if the system was not able to do the instantiation
     */
    public static Instantiate(className: string): any {
        if (this.RegisteredExternalClasses && this.RegisteredExternalClasses[className]) {
            return this.RegisteredExternalClasses[className];
        }

        const internalClass = GetClass(className);
        if (internalClass) {
            return internalClass;
        }

        Logger.Warn(className + " not found, you may have missed an import.");

        const arr = className.split(".");

        let fn: any = window || this;
        for (let i = 0, len = arr.length; i < len; i++) {
            fn = fn[arr[i]];
        }

        if (typeof fn !== "function") {
            return null;
        }

        return fn;
    }
}
