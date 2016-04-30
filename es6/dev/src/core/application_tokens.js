import { OpaqueToken } from 'angular2/src/core/di';
import { Math, StringWrapper } from 'angular2/src/facade/lang';
/**
 * A DI Token representing a unique string id assigned to the application by Angular and used
 * primarily for prefixing application attributes and CSS styles when
 * {@link ViewEncapsulation#Emulated} is being used.
 *
 * If you need to avoid randomly generated value to be used as an application id, you can provide
 * a custom value via a DI provider <!-- TODO: provider --> configuring the root {@link Injector}
 * using this token.
 */
export const APP_ID = new OpaqueToken('AppId');
function _appIdRandomProviderFactory() {
    return `${_randomChar()}${_randomChar()}${_randomChar()}`;
}
/**
 * Providers that will generate a random APP_ID_TOKEN.
 */
export const APP_ID_RANDOM_PROVIDER = 
/*@ts2dart_const*/ /* @ts2dart_Provider */ {
    provide: APP_ID,
    useFactory: _appIdRandomProviderFactory,
    deps: []
};
function _randomChar() {
    return StringWrapper.fromCharCode(97 + Math.floor(Math.random() * 25));
}
/**
 * A function that will be executed when a platform is initialized.
 */
export const PLATFORM_INITIALIZER = 
/*@ts2dart_const*/ new OpaqueToken("Platform Initializer");
/**
 * A function that will be executed when an application is initialized.
 */
export const APP_INITIALIZER = 
/*@ts2dart_const*/ new OpaqueToken("Application Initializer");
/**
 * A token which indicates the root directory of the application
 */
export const PACKAGE_ROOT_URL = 
/*@ts2dart_const*/ new OpaqueToken("Application Packages Root URL");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25fdG9rZW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1wbjloczBaZS50bXAvYW5ndWxhcjIvc3JjL2NvcmUvYXBwbGljYXRpb25fdG9rZW5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsV0FBVyxFQUFXLE1BQU0sc0JBQXNCO09BQ25ELEVBQUMsSUFBSSxFQUFFLGFBQWEsRUFBQyxNQUFNLDBCQUEwQjtBQUU1RDs7Ozs7Ozs7R0FRRztBQUNILE9BQU8sTUFBTSxNQUFNLEdBQTJCLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRXZFO0lBQ0UsTUFBTSxDQUFDLEdBQUcsV0FBVyxFQUFFLEdBQUcsV0FBVyxFQUFFLEdBQUcsV0FBVyxFQUFFLEVBQUUsQ0FBQztBQUM1RCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxPQUFPLE1BQU0sc0JBQXNCO0FBQy9CLGtCQUFrQixDQUFDLHVCQUF1QixDQUFDO0lBQ3pDLE9BQU8sRUFBRSxNQUFNO0lBQ2YsVUFBVSxFQUFFLDJCQUEyQjtJQUN2QyxJQUFJLEVBQUUsRUFBRTtDQUNULENBQUM7QUFFTjtJQUNFLE1BQU0sQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pFLENBQUM7QUFFRDs7R0FFRztBQUNILE9BQU8sTUFBTSxvQkFBb0I7QUFDN0Isa0JBQWtCLENBQUMsSUFBSSxXQUFXLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUUvRDs7R0FFRztBQUNILE9BQU8sTUFBTSxlQUFlO0FBQ3hCLGtCQUFrQixDQUFDLElBQUksV0FBVyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFFbEU7O0dBRUc7QUFDSCxPQUFPLE1BQU0sZ0JBQWdCO0FBQ3pCLGtCQUFrQixDQUFDLElBQUksV0FBVyxDQUFDLCtCQUErQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge09wYXF1ZVRva2VuLCBQcm92aWRlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtNYXRoLCBTdHJpbmdXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuXG4vKipcbiAqIEEgREkgVG9rZW4gcmVwcmVzZW50aW5nIGEgdW5pcXVlIHN0cmluZyBpZCBhc3NpZ25lZCB0byB0aGUgYXBwbGljYXRpb24gYnkgQW5ndWxhciBhbmQgdXNlZFxuICogcHJpbWFyaWx5IGZvciBwcmVmaXhpbmcgYXBwbGljYXRpb24gYXR0cmlidXRlcyBhbmQgQ1NTIHN0eWxlcyB3aGVuXG4gKiB7QGxpbmsgVmlld0VuY2Fwc3VsYXRpb24jRW11bGF0ZWR9IGlzIGJlaW5nIHVzZWQuXG4gKlxuICogSWYgeW91IG5lZWQgdG8gYXZvaWQgcmFuZG9tbHkgZ2VuZXJhdGVkIHZhbHVlIHRvIGJlIHVzZWQgYXMgYW4gYXBwbGljYXRpb24gaWQsIHlvdSBjYW4gcHJvdmlkZVxuICogYSBjdXN0b20gdmFsdWUgdmlhIGEgREkgcHJvdmlkZXIgPCEtLSBUT0RPOiBwcm92aWRlciAtLT4gY29uZmlndXJpbmcgdGhlIHJvb3Qge0BsaW5rIEluamVjdG9yfVxuICogdXNpbmcgdGhpcyB0b2tlbi5cbiAqL1xuZXhwb3J0IGNvbnN0IEFQUF9JRDogYW55ID0gLypAdHMyZGFydF9jb25zdCovIG5ldyBPcGFxdWVUb2tlbignQXBwSWQnKTtcblxuZnVuY3Rpb24gX2FwcElkUmFuZG9tUHJvdmlkZXJGYWN0b3J5KCkge1xuICByZXR1cm4gYCR7X3JhbmRvbUNoYXIoKX0ke19yYW5kb21DaGFyKCl9JHtfcmFuZG9tQ2hhcigpfWA7XG59XG5cbi8qKlxuICogUHJvdmlkZXJzIHRoYXQgd2lsbCBnZW5lcmF0ZSBhIHJhbmRvbSBBUFBfSURfVE9LRU4uXG4gKi9cbmV4cG9ydCBjb25zdCBBUFBfSURfUkFORE9NX1BST1ZJREVSID1cbiAgICAvKkB0czJkYXJ0X2NvbnN0Ki8gLyogQHRzMmRhcnRfUHJvdmlkZXIgKi8ge1xuICAgICAgcHJvdmlkZTogQVBQX0lELFxuICAgICAgdXNlRmFjdG9yeTogX2FwcElkUmFuZG9tUHJvdmlkZXJGYWN0b3J5LFxuICAgICAgZGVwczogW11cbiAgICB9O1xuXG5mdW5jdGlvbiBfcmFuZG9tQ2hhcigpOiBzdHJpbmcge1xuICByZXR1cm4gU3RyaW5nV3JhcHBlci5mcm9tQ2hhckNvZGUoOTcgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNSkpO1xufVxuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIHdoZW4gYSBwbGF0Zm9ybSBpcyBpbml0aWFsaXplZC5cbiAqL1xuZXhwb3J0IGNvbnN0IFBMQVRGT1JNX0lOSVRJQUxJWkVSOiBhbnkgPVxuICAgIC8qQHRzMmRhcnRfY29uc3QqLyBuZXcgT3BhcXVlVG9rZW4oXCJQbGF0Zm9ybSBJbml0aWFsaXplclwiKTtcblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCB3aGVuIGFuIGFwcGxpY2F0aW9uIGlzIGluaXRpYWxpemVkLlxuICovXG5leHBvcnQgY29uc3QgQVBQX0lOSVRJQUxJWkVSOiBhbnkgPVxuICAgIC8qQHRzMmRhcnRfY29uc3QqLyBuZXcgT3BhcXVlVG9rZW4oXCJBcHBsaWNhdGlvbiBJbml0aWFsaXplclwiKTtcblxuLyoqXG4gKiBBIHRva2VuIHdoaWNoIGluZGljYXRlcyB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhlIGFwcGxpY2F0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBQQUNLQUdFX1JPT1RfVVJMOiBhbnkgPVxuICAgIC8qQHRzMmRhcnRfY29uc3QqLyBuZXcgT3BhcXVlVG9rZW4oXCJBcHBsaWNhdGlvbiBQYWNrYWdlcyBSb290IFVSTFwiKTtcbiJdfQ==