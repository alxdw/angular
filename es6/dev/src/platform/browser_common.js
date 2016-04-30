import { IS_DART } from 'angular2/src/facade/lang';
import { OpaqueToken } from 'angular2/src/core/di';
import { XHR } from 'angular2/src/compiler/xhr';
import { PLATFORM_INITIALIZER, PLATFORM_DIRECTIVES, PLATFORM_PIPES, ExceptionHandler, RootRenderer, APPLICATION_COMMON_PROVIDERS, PLATFORM_COMMON_PROVIDERS } from "angular2/core";
import { COMMON_DIRECTIVES, COMMON_PIPES, FORM_PROVIDERS } from "angular2/common";
import { Testability } from 'angular2/src/core/testability/testability';
import { DOM } from 'angular2/src/platform/dom/dom_adapter';
import { DomEventsPlugin } from 'angular2/src/platform/dom/events/dom_events';
import { KeyEventsPlugin } from 'angular2/src/platform/dom/events/key_events';
import { DOCUMENT } from 'angular2/src/platform/dom/dom_tokens';
import { DomRootRenderer, DomRootRenderer_ } from 'angular2/src/platform/dom/dom_renderer';
import { DomSharedStylesHost, SharedStylesHost } from 'angular2/src/platform/dom/shared_styles_host';
import { BrowserDetails } from "angular2/src/animate/browser_details";
import { AnimationBuilder } from "angular2/src/animate/animation_builder";
import { BrowserDomAdapter } from './browser/browser_adapter';
import { BrowserGetTestability } from 'angular2/src/platform/browser/testability';
import { CachedXHR } from 'angular2/src/platform/browser/xhr_cache';
import { wtfInit } from 'angular2/src/core/profile/wtf_init';
import { EventManager, EVENT_MANAGER_PLUGINS } from "angular2/src/platform/dom/events/event_manager";
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerGesturesPlugin } from 'angular2/src/platform/dom/events/hammer_gestures';
import { ELEMENT_PROBE_PROVIDERS } from 'angular2/platform/common_dom';
export { DOCUMENT } from 'angular2/src/platform/dom/dom_tokens';
export { Title } from 'angular2/src/platform/browser/title';
export { ELEMENT_PROBE_PROVIDERS, ELEMENT_PROBE_PROVIDERS_PROD_MODE, inspectNativeElement, By } from 'angular2/platform/common_dom';
export { BrowserDomAdapter } from './browser/browser_adapter';
export { enableDebugTools, disableDebugTools } from 'angular2/src/platform/browser/tools/tools';
export { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from './dom/events/hammer_gestures';
export const BROWSER_PLATFORM_MARKER = 
/*@ts2dart_const*/ new OpaqueToken('BrowserPlatformMarker');
/**
 * A set of providers to initialize the Angular platform in a web browser.
 *
 * Used automatically by `bootstrap`, or can be passed to {@link platform}.
 */
export const BROWSER_PROVIDERS = [
    /*@ts2dart_Provider*/ { provide: BROWSER_PLATFORM_MARKER, useValue: true },
    PLATFORM_COMMON_PROVIDERS,
    /*@ts2dart_Provider*/ { provide: PLATFORM_INITIALIZER, useValue: initDomAdapter, multi: true },
];
function _exceptionHandler() {
    // !IS_DART is required because we must rethrow exceptions in JS,
    // but must not rethrow exceptions in Dart
    return new ExceptionHandler(DOM, !IS_DART);
}
function _document() {
    return DOM.defaultDoc();
}
/**
 * A set of providers to initialize an Angular application in a web browser.
 *
 * Used automatically by `bootstrap`, or can be passed to {@link PlatformRef.application}.
 */
export const BROWSER_APP_COMMON_PROVIDERS = 
/*@ts2dart_const*/ [
    APPLICATION_COMMON_PROVIDERS,
    FORM_PROVIDERS,
    /* @ts2dart_Provider */ { provide: PLATFORM_PIPES, useValue: COMMON_PIPES, multi: true },
    /* @ts2dart_Provider */ { provide: PLATFORM_DIRECTIVES, useValue: COMMON_DIRECTIVES, multi: true },
    /* @ts2dart_Provider */ { provide: ExceptionHandler, useFactory: _exceptionHandler, deps: [] },
    /* @ts2dart_Provider */ { provide: DOCUMENT, useFactory: _document, deps: [] },
    /* @ts2dart_Provider */ { provide: EVENT_MANAGER_PLUGINS, useClass: DomEventsPlugin, multi: true },
    /* @ts2dart_Provider */ { provide: EVENT_MANAGER_PLUGINS, useClass: KeyEventsPlugin, multi: true },
    /* @ts2dart_Provider */ { provide: EVENT_MANAGER_PLUGINS, useClass: HammerGesturesPlugin, multi: true },
    /* @ts2dart_Provider */ { provide: HAMMER_GESTURE_CONFIG, useClass: HammerGestureConfig },
    /* @ts2dart_Provider */ { provide: DomRootRenderer, useClass: DomRootRenderer_ },
    /* @ts2dart_Provider */ { provide: RootRenderer, useExisting: DomRootRenderer },
    /* @ts2dart_Provider */ { provide: SharedStylesHost, useExisting: DomSharedStylesHost },
    DomSharedStylesHost,
    Testability,
    BrowserDetails,
    AnimationBuilder,
    EventManager,
    ELEMENT_PROBE_PROVIDERS
];
export const CACHED_TEMPLATE_PROVIDER = 
/*@ts2dart_const*/ [{ provide: XHR, useClass: CachedXHR }];
export function initDomAdapter() {
    BrowserDomAdapter.makeCurrent();
    wtfInit();
    BrowserGetTestability.init();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlcl9jb21tb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLXBuOWhzMFplLnRtcC9hbmd1bGFyMi9zcmMvcGxhdGZvcm0vYnJvd3Nlcl9jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSwwQkFBMEI7T0FDekMsRUFBb0IsV0FBVyxFQUFDLE1BQU0sc0JBQXNCO09BQzVELEVBQUMsR0FBRyxFQUFDLE1BQU0sMkJBQTJCO09BQ3RDLEVBQ0wsb0JBQW9CLEVBQ3BCLG1CQUFtQixFQUNuQixjQUFjLEVBRWQsZ0JBQWdCLEVBRWhCLFlBQVksRUFFWiw0QkFBNEIsRUFDNUIseUJBQXlCLEVBQzFCLE1BQU0sZUFBZTtPQUNmLEVBQUMsaUJBQWlCLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBQyxNQUFNLGlCQUFpQjtPQUN4RSxFQUFDLFdBQVcsRUFBQyxNQUFNLDJDQUEyQztPQUM5RCxFQUFDLEdBQUcsRUFBQyxNQUFNLHVDQUF1QztPQUNsRCxFQUFDLGVBQWUsRUFBQyxNQUFNLDZDQUE2QztPQUNwRSxFQUFDLGVBQWUsRUFBQyxNQUFNLDZDQUE2QztPQUNwRSxFQUFDLFFBQVEsRUFBQyxNQUFNLHNDQUFzQztPQUN0RCxFQUFDLGVBQWUsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHdDQUF3QztPQUNqRixFQUFDLG1CQUFtQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sOENBQThDO09BQzNGLEVBQUMsY0FBYyxFQUFDLE1BQU0sc0NBQXNDO09BQzVELEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx3Q0FBd0M7T0FDaEUsRUFBQyxpQkFBaUIsRUFBQyxNQUFNLDJCQUEyQjtPQUNwRCxFQUFDLHFCQUFxQixFQUFDLE1BQU0sMkNBQTJDO09BQ3hFLEVBQUMsU0FBUyxFQUFDLE1BQU0seUNBQXlDO09BQzFELEVBQUMsT0FBTyxFQUFDLE1BQU0sb0NBQW9DO09BQ25ELEVBQUMsWUFBWSxFQUFFLHFCQUFxQixFQUFDLE1BQU0sZ0RBQWdEO09BQzNGLEVBQ0wscUJBQXFCLEVBQ3JCLG1CQUFtQixFQUNuQixvQkFBb0IsRUFDckIsTUFBTSxrREFBa0Q7T0FDbEQsRUFBQyx1QkFBdUIsRUFBQyxNQUFNLDhCQUE4QjtBQUNwRSxTQUFRLFFBQVEsUUFBTyxzQ0FBc0MsQ0FBQztBQUM5RCxTQUFRLEtBQUssUUFBTyxxQ0FBcUMsQ0FBQztBQUMxRCxTQUNFLHVCQUF1QixFQUN2QixpQ0FBaUMsRUFDakMsb0JBQW9CLEVBQ3BCLEVBQUUsUUFDRyw4QkFBOEIsQ0FBQztBQUN0QyxTQUFRLGlCQUFpQixRQUFPLDJCQUEyQixDQUFDO0FBQzVELFNBQVEsZ0JBQWdCLEVBQUUsaUJBQWlCLFFBQU8sMkNBQTJDLENBQUM7QUFDOUYsU0FBUSxxQkFBcUIsRUFBRSxtQkFBbUIsUUFBTyw4QkFBOEIsQ0FBQztBQUV4RixPQUFPLE1BQU0sdUJBQXVCO0FBQ2hDLGtCQUFrQixDQUFDLElBQUksV0FBVyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFFaEU7Ozs7R0FJRztBQUNILE9BQU8sTUFBTSxpQkFBaUIsR0FBNkQ7SUFDekYscUJBQXFCLENBQUMsRUFBQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztJQUN4RSx5QkFBeUI7SUFDekIscUJBQXFCLENBQUMsRUFBQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO0NBQzdGLENBQUM7QUFFRjtJQUNFLGlFQUFpRTtJQUNqRSwwQ0FBMEM7SUFDMUMsTUFBTSxDQUFDLElBQUksZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUVEO0lBQ0UsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUMxQixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE9BQU8sTUFBTSw0QkFBNEI7QUFDckMsa0JBQWtCLENBQUE7SUFDaEIsNEJBQTRCO0lBQzVCLGNBQWM7SUFDZCx1QkFBdUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO0lBQ3RGLHVCQUF1QixDQUFDLEVBQUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO0lBQ2hHLHVCQUF1QixDQUFDLEVBQUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDO0lBQzVGLHVCQUF1QixDQUFDLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUM7SUFDNUUsdUJBQXVCLENBQUMsRUFBQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO0lBQ2hHLHVCQUF1QixDQUFDLEVBQUMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQztJQUNoRyx1QkFBdUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxRQUFRLEVBQUUsb0JBQW9CLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQztJQUNyRyx1QkFBdUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLEVBQUM7SUFDdkYsdUJBQXVCLENBQUMsRUFBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBQztJQUM5RSx1QkFBdUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBQztJQUM3RSx1QkFBdUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUM7SUFDckYsbUJBQW1CO0lBQ25CLFdBQVc7SUFDWCxjQUFjO0lBQ2QsZ0JBQWdCO0lBQ2hCLFlBQVk7SUFDWix1QkFBdUI7Q0FDeEIsQ0FBQztBQUVOLE9BQU8sTUFBTSx3QkFBd0I7QUFDakMsa0JBQWtCLENBQUEsQ0FBdUIsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0FBRWxGO0lBQ0UsaUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDaEMsT0FBTyxFQUFFLENBQUM7SUFDVixxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMvQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJU19EQVJUfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtwcm92aWRlLCBJbmplY3RvciwgT3BhcXVlVG9rZW59IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7WEhSfSBmcm9tICdhbmd1bGFyMi9zcmMvY29tcGlsZXIveGhyJztcbmltcG9ydCB7XG4gIFBMQVRGT1JNX0lOSVRJQUxJWkVSLFxuICBQTEFURk9STV9ESVJFQ1RJVkVTLFxuICBQTEFURk9STV9QSVBFUyxcbiAgQ29tcG9uZW50UmVmLFxuICBFeGNlcHRpb25IYW5kbGVyLFxuICBSZWZsZWN0b3IsXG4gIFJvb3RSZW5kZXJlcixcbiAgcmVmbGVjdG9yLFxuICBBUFBMSUNBVElPTl9DT01NT05fUFJPVklERVJTLFxuICBQTEFURk9STV9DT01NT05fUFJPVklERVJTXG59IGZyb20gXCJhbmd1bGFyMi9jb3JlXCI7XG5pbXBvcnQge0NPTU1PTl9ESVJFQ1RJVkVTLCBDT01NT05fUElQRVMsIEZPUk1fUFJPVklERVJTfSBmcm9tIFwiYW5ndWxhcjIvY29tbW9uXCI7XG5pbXBvcnQge1Rlc3RhYmlsaXR5fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS90ZXN0YWJpbGl0eS90ZXN0YWJpbGl0eSc7XG5pbXBvcnQge0RPTX0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9kb21fYWRhcHRlcic7XG5pbXBvcnQge0RvbUV2ZW50c1BsdWdpbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9ldmVudHMvZG9tX2V2ZW50cyc7XG5pbXBvcnQge0tleUV2ZW50c1BsdWdpbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9ldmVudHMva2V5X2V2ZW50cyc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2RvbV90b2tlbnMnO1xuaW1wb3J0IHtEb21Sb290UmVuZGVyZXIsIERvbVJvb3RSZW5kZXJlcl99IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vZG9tX3JlbmRlcmVyJztcbmltcG9ydCB7RG9tU2hhcmVkU3R5bGVzSG9zdCwgU2hhcmVkU3R5bGVzSG9zdH0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9zaGFyZWRfc3R5bGVzX2hvc3QnO1xuaW1wb3J0IHtCcm93c2VyRGV0YWlsc30gZnJvbSBcImFuZ3VsYXIyL3NyYy9hbmltYXRlL2Jyb3dzZXJfZGV0YWlsc1wiO1xuaW1wb3J0IHtBbmltYXRpb25CdWlsZGVyfSBmcm9tIFwiYW5ndWxhcjIvc3JjL2FuaW1hdGUvYW5pbWF0aW9uX2J1aWxkZXJcIjtcbmltcG9ydCB7QnJvd3NlckRvbUFkYXB0ZXJ9IGZyb20gJy4vYnJvd3Nlci9icm93c2VyX2FkYXB0ZXInO1xuaW1wb3J0IHtCcm93c2VyR2V0VGVzdGFiaWxpdHl9IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9icm93c2VyL3Rlc3RhYmlsaXR5JztcbmltcG9ydCB7Q2FjaGVkWEhSfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vYnJvd3Nlci94aHJfY2FjaGUnO1xuaW1wb3J0IHt3dGZJbml0fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9wcm9maWxlL3d0Zl9pbml0JztcbmltcG9ydCB7RXZlbnRNYW5hZ2VyLCBFVkVOVF9NQU5BR0VSX1BMVUdJTlN9IGZyb20gXCJhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2V2ZW50cy9ldmVudF9tYW5hZ2VyXCI7XG5pbXBvcnQge1xuICBIQU1NRVJfR0VTVFVSRV9DT05GSUcsXG4gIEhhbW1lckdlc3R1cmVDb25maWcsXG4gIEhhbW1lckdlc3R1cmVzUGx1Z2luXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vZXZlbnRzL2hhbW1lcl9nZXN0dXJlcyc7XG5pbXBvcnQge0VMRU1FTlRfUFJPQkVfUFJPVklERVJTfSBmcm9tICdhbmd1bGFyMi9wbGF0Zm9ybS9jb21tb25fZG9tJztcbmV4cG9ydCB7RE9DVU1FTlR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vZG9tX3Rva2Vucyc7XG5leHBvcnQge1RpdGxlfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vYnJvd3Nlci90aXRsZSc7XG5leHBvcnQge1xuICBFTEVNRU5UX1BST0JFX1BST1ZJREVSUyxcbiAgRUxFTUVOVF9QUk9CRV9QUk9WSURFUlNfUFJPRF9NT0RFLFxuICBpbnNwZWN0TmF0aXZlRWxlbWVudCxcbiAgQnlcbn0gZnJvbSAnYW5ndWxhcjIvcGxhdGZvcm0vY29tbW9uX2RvbSc7XG5leHBvcnQge0Jyb3dzZXJEb21BZGFwdGVyfSBmcm9tICcuL2Jyb3dzZXIvYnJvd3Nlcl9hZGFwdGVyJztcbmV4cG9ydCB7ZW5hYmxlRGVidWdUb29scywgZGlzYWJsZURlYnVnVG9vbHN9IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9icm93c2VyL3Rvb2xzL3Rvb2xzJztcbmV4cG9ydCB7SEFNTUVSX0dFU1RVUkVfQ09ORklHLCBIYW1tZXJHZXN0dXJlQ29uZmlnfSBmcm9tICcuL2RvbS9ldmVudHMvaGFtbWVyX2dlc3R1cmVzJztcblxuZXhwb3J0IGNvbnN0IEJST1dTRVJfUExBVEZPUk1fTUFSS0VSID1cbiAgICAvKkB0czJkYXJ0X2NvbnN0Ki8gbmV3IE9wYXF1ZVRva2VuKCdCcm93c2VyUGxhdGZvcm1NYXJrZXInKTtcblxuLyoqXG4gKiBBIHNldCBvZiBwcm92aWRlcnMgdG8gaW5pdGlhbGl6ZSB0aGUgQW5ndWxhciBwbGF0Zm9ybSBpbiBhIHdlYiBicm93c2VyLlxuICpcbiAqIFVzZWQgYXV0b21hdGljYWxseSBieSBgYm9vdHN0cmFwYCwgb3IgY2FuIGJlIHBhc3NlZCB0byB7QGxpbmsgcGxhdGZvcm19LlxuICovXG5leHBvcnQgY29uc3QgQlJPV1NFUl9QUk9WSURFUlM6IEFycmF5PGFueSAvKlR5cGUgfCBQcm92aWRlciB8IGFueVtdKi8+ID0gLypAdHMyZGFydF9jb25zdCovW1xuICAvKkB0czJkYXJ0X1Byb3ZpZGVyKi8ge3Byb3ZpZGU6IEJST1dTRVJfUExBVEZPUk1fTUFSS0VSLCB1c2VWYWx1ZTogdHJ1ZX0sXG4gIFBMQVRGT1JNX0NPTU1PTl9QUk9WSURFUlMsXG4gIC8qQHRzMmRhcnRfUHJvdmlkZXIqLyB7cHJvdmlkZTogUExBVEZPUk1fSU5JVElBTElaRVIsIHVzZVZhbHVlOiBpbml0RG9tQWRhcHRlciwgbXVsdGk6IHRydWV9LFxuXTtcblxuZnVuY3Rpb24gX2V4Y2VwdGlvbkhhbmRsZXIoKTogRXhjZXB0aW9uSGFuZGxlciB7XG4gIC8vICFJU19EQVJUIGlzIHJlcXVpcmVkIGJlY2F1c2Ugd2UgbXVzdCByZXRocm93IGV4Y2VwdGlvbnMgaW4gSlMsXG4gIC8vIGJ1dCBtdXN0IG5vdCByZXRocm93IGV4Y2VwdGlvbnMgaW4gRGFydFxuICByZXR1cm4gbmV3IEV4Y2VwdGlvbkhhbmRsZXIoRE9NLCAhSVNfREFSVCk7XG59XG5cbmZ1bmN0aW9uIF9kb2N1bWVudCgpOiBhbnkge1xuICByZXR1cm4gRE9NLmRlZmF1bHREb2MoKTtcbn1cblxuLyoqXG4gKiBBIHNldCBvZiBwcm92aWRlcnMgdG8gaW5pdGlhbGl6ZSBhbiBBbmd1bGFyIGFwcGxpY2F0aW9uIGluIGEgd2ViIGJyb3dzZXIuXG4gKlxuICogVXNlZCBhdXRvbWF0aWNhbGx5IGJ5IGBib290c3RyYXBgLCBvciBjYW4gYmUgcGFzc2VkIHRvIHtAbGluayBQbGF0Zm9ybVJlZi5hcHBsaWNhdGlvbn0uXG4gKi9cbmV4cG9ydCBjb25zdCBCUk9XU0VSX0FQUF9DT01NT05fUFJPVklERVJTOiBBcnJheTxhbnkgLypUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXSovPiA9XG4gICAgLypAdHMyZGFydF9jb25zdCovW1xuICAgICAgQVBQTElDQVRJT05fQ09NTU9OX1BST1ZJREVSUyxcbiAgICAgIEZPUk1fUFJPVklERVJTLFxuICAgICAgLyogQHRzMmRhcnRfUHJvdmlkZXIgKi8ge3Byb3ZpZGU6IFBMQVRGT1JNX1BJUEVTLCB1c2VWYWx1ZTogQ09NTU9OX1BJUEVTLCBtdWx0aTogdHJ1ZX0sXG4gICAgICAvKiBAdHMyZGFydF9Qcm92aWRlciAqLyB7cHJvdmlkZTogUExBVEZPUk1fRElSRUNUSVZFUywgdXNlVmFsdWU6IENPTU1PTl9ESVJFQ1RJVkVTLCBtdWx0aTogdHJ1ZX0sXG4gICAgICAvKiBAdHMyZGFydF9Qcm92aWRlciAqLyB7cHJvdmlkZTogRXhjZXB0aW9uSGFuZGxlciwgdXNlRmFjdG9yeTogX2V4Y2VwdGlvbkhhbmRsZXIsIGRlcHM6IFtdfSxcbiAgICAgIC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBET0NVTUVOVCwgdXNlRmFjdG9yeTogX2RvY3VtZW50LCBkZXBzOiBbXX0sXG4gICAgICAvKiBAdHMyZGFydF9Qcm92aWRlciAqLyB7cHJvdmlkZTogRVZFTlRfTUFOQUdFUl9QTFVHSU5TLCB1c2VDbGFzczogRG9tRXZlbnRzUGx1Z2luLCBtdWx0aTogdHJ1ZX0sXG4gICAgICAvKiBAdHMyZGFydF9Qcm92aWRlciAqLyB7cHJvdmlkZTogRVZFTlRfTUFOQUdFUl9QTFVHSU5TLCB1c2VDbGFzczogS2V5RXZlbnRzUGx1Z2luLCBtdWx0aTogdHJ1ZX0sXG4gICAgICAvKiBAdHMyZGFydF9Qcm92aWRlciAqLyB7cHJvdmlkZTogRVZFTlRfTUFOQUdFUl9QTFVHSU5TLCB1c2VDbGFzczogSGFtbWVyR2VzdHVyZXNQbHVnaW4sIG11bHRpOiB0cnVlfSxcbiAgICAgIC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBIQU1NRVJfR0VTVFVSRV9DT05GSUcsIHVzZUNsYXNzOiBIYW1tZXJHZXN0dXJlQ29uZmlnfSxcbiAgICAgIC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBEb21Sb290UmVuZGVyZXIsIHVzZUNsYXNzOiBEb21Sb290UmVuZGVyZXJffSxcbiAgICAgIC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBSb290UmVuZGVyZXIsIHVzZUV4aXN0aW5nOiBEb21Sb290UmVuZGVyZXJ9LFxuICAgICAgLyogQHRzMmRhcnRfUHJvdmlkZXIgKi8ge3Byb3ZpZGU6IFNoYXJlZFN0eWxlc0hvc3QsIHVzZUV4aXN0aW5nOiBEb21TaGFyZWRTdHlsZXNIb3N0fSxcbiAgICAgIERvbVNoYXJlZFN0eWxlc0hvc3QsXG4gICAgICBUZXN0YWJpbGl0eSxcbiAgICAgIEJyb3dzZXJEZXRhaWxzLFxuICAgICAgQW5pbWF0aW9uQnVpbGRlcixcbiAgICAgIEV2ZW50TWFuYWdlcixcbiAgICAgIEVMRU1FTlRfUFJPQkVfUFJPVklERVJTXG4gICAgXTtcblxuZXhwb3J0IGNvbnN0IENBQ0hFRF9URU1QTEFURV9QUk9WSURFUjogQXJyYXk8YW55IC8qVHlwZSB8IFByb3ZpZGVyIHwgYW55W10qLz4gPVxuICAgIC8qQHRzMmRhcnRfY29uc3QqL1svKkB0czJkYXJ0X1Byb3ZpZGVyKi8ge3Byb3ZpZGU6IFhIUiwgdXNlQ2xhc3M6IENhY2hlZFhIUn1dO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdERvbUFkYXB0ZXIoKSB7XG4gIEJyb3dzZXJEb21BZGFwdGVyLm1ha2VDdXJyZW50KCk7XG4gIHd0ZkluaXQoKTtcbiAgQnJvd3NlckdldFRlc3RhYmlsaXR5LmluaXQoKTtcbn1cbiJdfQ==