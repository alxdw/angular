import {CONST_EXPR, assertionsEnabled} from 'angular2/src/facade/lang';
import {DOM} from 'angular2/src/platform/dom/dom_adapter';
import {DomRootRenderer} from 'angular2/src/platform/dom/dom_renderer';
import {DebugNode, getDebugNode, DebugDomRootRenderer, Provider, RootRenderer, NgZone, ApplicationRef} from 'angular2/core';

const CORE_TOKENS = CONST_EXPR({'ApplicationRef': ApplicationRef, 'NgZone': NgZone});

const INSPECT_GLOBAL_NAME = 'ng.probe';
const CORE_TOKENS_GLOBAL_NAME = 'ng.coreTokens';

/**
 * Returns a {@link DebugElement} for the given native DOM element, or
 * null if the given native element does not have an Angular view associated
 * with it.
 */
export function inspectNativeElement(element): DebugNode {
  return getDebugNode(element);
}

function _createConditionalRootRenderer(rootRenderer) {
  if (assertionsEnabled()) {
    return _createRootRenderer(rootRenderer);
  }
  return rootRenderer;
}

function _createRootRenderer(rootRenderer) {
  DOM.setGlobalVar(INSPECT_GLOBAL_NAME, inspectNativeElement);
  DOM.setGlobalVar(CORE_TOKENS_GLOBAL_NAME, CORE_TOKENS);
  return new DebugDomRootRenderer(rootRenderer);
}

/**
 * Providers which support debugging Angular applications (e.g. via `ng.probe`).
 */
export const ELEMENT_PROBE_PROVIDERS: any[] = CONST_EXPR([
  new Provider(RootRenderer,
               {useFactory: _createConditionalRootRenderer, deps: [DomRootRenderer]})
]);

export const ELEMENT_PROBE_PROVIDERS_PROD_MODE: any[] = CONST_EXPR(
    [new Provider(RootRenderer, {useFactory: _createRootRenderer, deps: [DomRootRenderer]})]);