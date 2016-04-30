export { PLATFORM_DIRECTIVES, PLATFORM_PIPES } from 'angular2/src/core/platform_directives_and_pipes';
export * from 'angular2/src/compiler/template_ast';
export { TEMPLATE_TRANSFORMS } from 'angular2/src/compiler/template_parser';
export { CompilerConfig, RenderTypes } from './config';
export * from './compile_metadata';
export * from './offline_compiler';
export { RuntimeCompiler } from './runtime_compiler';
export * from 'angular2/src/compiler/url_resolver';
export * from 'angular2/src/compiler/xhr';
export { ViewResolver } from './view_resolver';
export { DirectiveResolver } from './directive_resolver';
export { PipeResolver } from './pipe_resolver';
import { assertionsEnabled } from 'angular2/src/facade/lang';
import { TemplateParser } from 'angular2/src/compiler/template_parser';
import { HtmlParser } from 'angular2/src/compiler/html_parser';
import { DirectiveNormalizer } from 'angular2/src/compiler/directive_normalizer';
import { CompileMetadataResolver } from 'angular2/src/compiler/metadata_resolver';
import { StyleCompiler } from 'angular2/src/compiler/style_compiler';
import { ViewCompiler } from 'angular2/src/compiler/view_compiler/view_compiler';
import { CompilerConfig } from './config';
import { ComponentResolver } from 'angular2/src/core/linker/component_resolver';
import { RuntimeCompiler } from 'angular2/src/compiler/runtime_compiler';
import { ElementSchemaRegistry } from 'angular2/src/compiler/schema/element_schema_registry';
import { DomElementSchemaRegistry } from 'angular2/src/compiler/schema/dom_element_schema_registry';
import { UrlResolver, DEFAULT_PACKAGE_URL_PROVIDER } from 'angular2/src/compiler/url_resolver';
import { Parser } from './expression_parser/parser';
import { Lexer } from './expression_parser/lexer';
import { ViewResolver } from './view_resolver';
import { DirectiveResolver } from './directive_resolver';
import { PipeResolver } from './pipe_resolver';
function _createCompilerConfig() {
    return new CompilerConfig(assertionsEnabled(), false, true);
}
/**
 * A set of providers that provide `RuntimeCompiler` and its dependencies to use for
 * template compilation.
 */
export const COMPILER_PROVIDERS = 
/*@ts2dart_const*/ [
    Lexer,
    Parser,
    HtmlParser,
    TemplateParser,
    DirectiveNormalizer,
    CompileMetadataResolver,
    DEFAULT_PACKAGE_URL_PROVIDER,
    StyleCompiler,
    ViewCompiler,
    /*@ts2dart_Provider*/ { provide: CompilerConfig, useFactory: _createCompilerConfig, deps: [] },
    RuntimeCompiler,
    /*@ts2dart_Provider*/ { provide: ComponentResolver, useExisting: RuntimeCompiler },
    DomElementSchemaRegistry,
    /*@ts2dart_Provider*/ { provide: ElementSchemaRegistry, useExisting: DomElementSchemaRegistry },
    UrlResolver,
    ViewResolver,
    DirectiveResolver,
    PipeResolver
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLXBuOWhzMFplLnRtcC9hbmd1bGFyMi9zcmMvY29tcGlsZXIvY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsU0FBUSxtQkFBbUIsRUFBRSxjQUFjLFFBQU8saURBQWlELENBQUM7QUFDcEcsY0FBYyxvQ0FBb0MsQ0FBQztBQUNuRCxTQUFRLG1CQUFtQixRQUFPLHVDQUF1QyxDQUFDO0FBQzFFLFNBQVEsY0FBYyxFQUFFLFdBQVcsUUFBTyxVQUFVLENBQUM7QUFDckQsY0FBYyxvQkFBb0IsQ0FBQztBQUNuQyxjQUFjLG9CQUFvQixDQUFDO0FBQ25DLFNBQVEsZUFBZSxRQUFPLG9CQUFvQixDQUFDO0FBQ25ELGNBQWMsb0NBQW9DLENBQUM7QUFDbkQsY0FBYywyQkFBMkIsQ0FBQztBQUUxQyxTQUFRLFlBQVksUUFBTyxpQkFBaUIsQ0FBQztBQUM3QyxTQUFRLGlCQUFpQixRQUFPLHNCQUFzQixDQUFDO0FBQ3ZELFNBQVEsWUFBWSxRQUFPLGlCQUFpQixDQUFDO09BRXRDLEVBQUMsaUJBQWlCLEVBQU8sTUFBTSwwQkFBMEI7T0FDekQsRUFBQyxjQUFjLEVBQUMsTUFBTSx1Q0FBdUM7T0FDN0QsRUFBQyxVQUFVLEVBQUMsTUFBTSxtQ0FBbUM7T0FDckQsRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDRDQUE0QztPQUN2RSxFQUFDLHVCQUF1QixFQUFDLE1BQU0seUNBQXlDO09BQ3hFLEVBQUMsYUFBYSxFQUFDLE1BQU0sc0NBQXNDO09BQzNELEVBQUMsWUFBWSxFQUFDLE1BQU0sbURBQW1EO09BQ3ZFLEVBQUMsY0FBYyxFQUFDLE1BQU0sVUFBVTtPQUNoQyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sNkNBQTZDO09BQ3RFLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0NBQXdDO09BQy9ELEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzREFBc0Q7T0FDbkYsRUFBQyx3QkFBd0IsRUFBQyxNQUFNLDBEQUEwRDtPQUMxRixFQUFDLFdBQVcsRUFBRSw0QkFBNEIsRUFBQyxNQUFNLG9DQUFvQztPQUNyRixFQUFDLE1BQU0sRUFBQyxNQUFNLDRCQUE0QjtPQUMxQyxFQUFDLEtBQUssRUFBQyxNQUFNLDJCQUEyQjtPQUN4QyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQjtPQUNyQyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sc0JBQXNCO09BQy9DLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCO0FBRTVDO0lBQ0UsTUFBTSxDQUFDLElBQUksY0FBYyxDQUFDLGlCQUFpQixFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFFRDs7O0dBR0c7QUFDSCxPQUFPLE1BQU0sa0JBQWtCO0FBQzNCLGtCQUFrQixDQUFBO0lBQ2hCLEtBQUs7SUFDTCxNQUFNO0lBQ04sVUFBVTtJQUNWLGNBQWM7SUFDZCxtQkFBbUI7SUFDbkIsdUJBQXVCO0lBQ3ZCLDRCQUE0QjtJQUM1QixhQUFhO0lBQ2IsWUFBWTtJQUNaLHFCQUFxQixDQUFDLEVBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUscUJBQXFCLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQztJQUM1RixlQUFlO0lBQ2YscUJBQXFCLENBQUMsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBQztJQUNoRix3QkFBd0I7SUFDeEIscUJBQXFCLENBQUMsRUFBQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsV0FBVyxFQUFFLHdCQUF3QixFQUFDO0lBQzdGLFdBQVc7SUFDWCxZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCLFlBQVk7Q0FDYixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHtQTEFURk9STV9ESVJFQ1RJVkVTLCBQTEFURk9STV9QSVBFU30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvcGxhdGZvcm1fZGlyZWN0aXZlc19hbmRfcGlwZXMnO1xuZXhwb3J0ICogZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3RlbXBsYXRlX2FzdCc7XG5leHBvcnQge1RFTVBMQVRFX1RSQU5TRk9STVN9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci90ZW1wbGF0ZV9wYXJzZXInO1xuZXhwb3J0IHtDb21waWxlckNvbmZpZywgUmVuZGVyVHlwZXN9IGZyb20gJy4vY29uZmlnJztcbmV4cG9ydCAqIGZyb20gJy4vY29tcGlsZV9tZXRhZGF0YSc7XG5leHBvcnQgKiBmcm9tICcuL29mZmxpbmVfY29tcGlsZXInO1xuZXhwb3J0IHtSdW50aW1lQ29tcGlsZXJ9IGZyb20gJy4vcnVudGltZV9jb21waWxlcic7XG5leHBvcnQgKiBmcm9tICdhbmd1bGFyMi9zcmMvY29tcGlsZXIvdXJsX3Jlc29sdmVyJztcbmV4cG9ydCAqIGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci94aHInO1xuXG5leHBvcnQge1ZpZXdSZXNvbHZlcn0gZnJvbSAnLi92aWV3X3Jlc29sdmVyJztcbmV4cG9ydCB7RGlyZWN0aXZlUmVzb2x2ZXJ9IGZyb20gJy4vZGlyZWN0aXZlX3Jlc29sdmVyJztcbmV4cG9ydCB7UGlwZVJlc29sdmVyfSBmcm9tICcuL3BpcGVfcmVzb2x2ZXInO1xuXG5pbXBvcnQge2Fzc2VydGlvbnNFbmFibGVkLCBUeXBlfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtUZW1wbGF0ZVBhcnNlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3RlbXBsYXRlX3BhcnNlcic7XG5pbXBvcnQge0h0bWxQYXJzZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci9odG1sX3BhcnNlcic7XG5pbXBvcnQge0RpcmVjdGl2ZU5vcm1hbGl6ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci9kaXJlY3RpdmVfbm9ybWFsaXplcic7XG5pbXBvcnQge0NvbXBpbGVNZXRhZGF0YVJlc29sdmVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29tcGlsZXIvbWV0YWRhdGFfcmVzb2x2ZXInO1xuaW1wb3J0IHtTdHlsZUNvbXBpbGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29tcGlsZXIvc3R5bGVfY29tcGlsZXInO1xuaW1wb3J0IHtWaWV3Q29tcGlsZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci92aWV3X2NvbXBpbGVyL3ZpZXdfY29tcGlsZXInO1xuaW1wb3J0IHtDb21waWxlckNvbmZpZ30gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHtDb21wb25lbnRSZXNvbHZlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL2NvbXBvbmVudF9yZXNvbHZlcic7XG5pbXBvcnQge1J1bnRpbWVDb21waWxlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3J1bnRpbWVfY29tcGlsZXInO1xuaW1wb3J0IHtFbGVtZW50U2NoZW1hUmVnaXN0cnl9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci9zY2hlbWEvZWxlbWVudF9zY2hlbWFfcmVnaXN0cnknO1xuaW1wb3J0IHtEb21FbGVtZW50U2NoZW1hUmVnaXN0cnl9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci9zY2hlbWEvZG9tX2VsZW1lbnRfc2NoZW1hX3JlZ2lzdHJ5JztcbmltcG9ydCB7VXJsUmVzb2x2ZXIsIERFRkFVTFRfUEFDS0FHRV9VUkxfUFJPVklERVJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci91cmxfcmVzb2x2ZXInO1xuaW1wb3J0IHtQYXJzZXJ9IGZyb20gJy4vZXhwcmVzc2lvbl9wYXJzZXIvcGFyc2VyJztcbmltcG9ydCB7TGV4ZXJ9IGZyb20gJy4vZXhwcmVzc2lvbl9wYXJzZXIvbGV4ZXInO1xuaW1wb3J0IHtWaWV3UmVzb2x2ZXJ9IGZyb20gJy4vdmlld19yZXNvbHZlcic7XG5pbXBvcnQge0RpcmVjdGl2ZVJlc29sdmVyfSBmcm9tICcuL2RpcmVjdGl2ZV9yZXNvbHZlcic7XG5pbXBvcnQge1BpcGVSZXNvbHZlcn0gZnJvbSAnLi9waXBlX3Jlc29sdmVyJztcblxuZnVuY3Rpb24gX2NyZWF0ZUNvbXBpbGVyQ29uZmlnKCkge1xuICByZXR1cm4gbmV3IENvbXBpbGVyQ29uZmlnKGFzc2VydGlvbnNFbmFibGVkKCksIGZhbHNlLCB0cnVlKTtcbn1cblxuLyoqXG4gKiBBIHNldCBvZiBwcm92aWRlcnMgdGhhdCBwcm92aWRlIGBSdW50aW1lQ29tcGlsZXJgIGFuZCBpdHMgZGVwZW5kZW5jaWVzIHRvIHVzZSBmb3JcbiAqIHRlbXBsYXRlIGNvbXBpbGF0aW9uLlxuICovXG5leHBvcnQgY29uc3QgQ09NUElMRVJfUFJPVklERVJTOiBBcnJheTxhbnkgfCBUeXBlIHwge1trOiBzdHJpbmddOiBhbnl9IHwgYW55W10+ID1cbiAgICAvKkB0czJkYXJ0X2NvbnN0Ki9bXG4gICAgICBMZXhlcixcbiAgICAgIFBhcnNlcixcbiAgICAgIEh0bWxQYXJzZXIsXG4gICAgICBUZW1wbGF0ZVBhcnNlcixcbiAgICAgIERpcmVjdGl2ZU5vcm1hbGl6ZXIsXG4gICAgICBDb21waWxlTWV0YWRhdGFSZXNvbHZlcixcbiAgICAgIERFRkFVTFRfUEFDS0FHRV9VUkxfUFJPVklERVIsXG4gICAgICBTdHlsZUNvbXBpbGVyLFxuICAgICAgVmlld0NvbXBpbGVyLFxuICAgICAgLypAdHMyZGFydF9Qcm92aWRlciovIHtwcm92aWRlOiBDb21waWxlckNvbmZpZywgdXNlRmFjdG9yeTogX2NyZWF0ZUNvbXBpbGVyQ29uZmlnLCBkZXBzOiBbXX0sXG4gICAgICBSdW50aW1lQ29tcGlsZXIsXG4gICAgICAvKkB0czJkYXJ0X1Byb3ZpZGVyKi8ge3Byb3ZpZGU6IENvbXBvbmVudFJlc29sdmVyLCB1c2VFeGlzdGluZzogUnVudGltZUNvbXBpbGVyfSxcbiAgICAgIERvbUVsZW1lbnRTY2hlbWFSZWdpc3RyeSxcbiAgICAgIC8qQHRzMmRhcnRfUHJvdmlkZXIqLyB7cHJvdmlkZTogRWxlbWVudFNjaGVtYVJlZ2lzdHJ5LCB1c2VFeGlzdGluZzogRG9tRWxlbWVudFNjaGVtYVJlZ2lzdHJ5fSxcbiAgICAgIFVybFJlc29sdmVyLFxuICAgICAgVmlld1Jlc29sdmVyLFxuICAgICAgRGlyZWN0aXZlUmVzb2x2ZXIsXG4gICAgICBQaXBlUmVzb2x2ZXJcbiAgICBdO1xuIl19