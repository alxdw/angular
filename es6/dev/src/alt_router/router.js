import { provide, ReflectiveInjector } from 'angular2/core';
import { isBlank, isPresent } from 'angular2/src/facade/lang';
import { ListWrapper } from 'angular2/src/facade/collection';
import { EventEmitter, PromiseWrapper } from 'angular2/src/facade/async';
import { StringMapWrapper } from 'angular2/src/facade/collection';
import { BaseException } from 'angular2/src/facade/exceptions';
import { recognize } from './recognize';
import { link } from './link';
import { equalSegments, routeSegmentComponentFactory, RouteSegment, rootNode } from './segments';
import { hasLifecycleHook } from './lifecycle_reflector';
import { DEFAULT_OUTLET_NAME } from './constants';
export class RouterOutletMap {
    constructor() {
        /** @internal */
        this._outlets = {};
    }
    registerOutlet(name, outlet) { this._outlets[name] = outlet; }
}
export class Router {
    constructor(_rootComponent, _rootComponentType, _componentResolver, _urlSerializer, _routerOutletMap, _location) {
        this._rootComponent = _rootComponent;
        this._rootComponentType = _rootComponentType;
        this._componentResolver = _componentResolver;
        this._urlSerializer = _urlSerializer;
        this._routerOutletMap = _routerOutletMap;
        this._location = _location;
        this._changes = new EventEmitter();
        this.navigateByUrl(this._location.path());
    }
    get urlTree() { return this._urlTree; }
    navigateByUrl(url) {
        return this._navigate(this._urlSerializer.parse(url));
    }
    navigate(changes, segment) {
        return this._navigate(this.createUrlTree(changes, segment));
    }
    _navigate(url) {
        this._urlTree = url;
        return recognize(this._componentResolver, this._rootComponentType, url)
            .then(currTree => {
            return new _LoadSegments(currTree, this._prevTree)
                .load(this._routerOutletMap, this._rootComponent)
                .then(_ => {
                this._prevTree = currTree;
                this._location.go(this._urlSerializer.serialize(this._urlTree));
                this._changes.emit(null);
            });
        });
    }
    createUrlTree(changes, segment) {
        if (isPresent(this._prevTree)) {
            let s = isPresent(segment) ? segment : this._prevTree.root;
            return link(s, this._prevTree, this.urlTree, changes);
        }
        else {
            return null;
        }
    }
    serializeUrl(url) { return this._urlSerializer.serialize(url); }
    get changes() { return this._changes; }
    get routeTree() { return this._prevTree; }
}
class _LoadSegments {
    constructor(currTree, prevTree) {
        this.currTree = currTree;
        this.prevTree = prevTree;
        this.deactivations = [];
        this.performMutation = true;
    }
    load(parentOutletMap, rootComponent) {
        let prevRoot = isPresent(this.prevTree) ? rootNode(this.prevTree) : null;
        let currRoot = rootNode(this.currTree);
        return this.canDeactivate(currRoot, prevRoot, parentOutletMap, rootComponent)
            .then(res => {
            this.performMutation = true;
            if (res) {
                this.loadChildSegments(currRoot, prevRoot, parentOutletMap, [rootComponent]);
            }
        });
    }
    canDeactivate(currRoot, prevRoot, outletMap, rootComponent) {
        this.performMutation = false;
        this.loadChildSegments(currRoot, prevRoot, outletMap, [rootComponent]);
        let allPaths = PromiseWrapper.all(this.deactivations.map(r => this.checkCanDeactivatePath(r)));
        return allPaths.then((values) => values.filter(v => v).length === values.length);
    }
    checkCanDeactivatePath(path) {
        let curr = PromiseWrapper.resolve(true);
        for (let p of ListWrapper.reversed(path)) {
            curr = curr.then(_ => {
                if (hasLifecycleHook("routerCanDeactivate", p)) {
                    return p.routerCanDeactivate(this.prevTree, this.currTree);
                }
                else {
                    return _;
                }
            });
        }
        return curr;
    }
    loadChildSegments(currNode, prevNode, outletMap, components) {
        let prevChildren = isPresent(prevNode) ?
            prevNode.children.reduce((m, c) => {
                m[c.value.outlet] = c;
                return m;
            }, {}) :
            {};
        currNode.children.forEach(c => {
            this.loadSegments(c, prevChildren[c.value.outlet], outletMap, components);
            StringMapWrapper.delete(prevChildren, c.value.outlet);
        });
        StringMapWrapper.forEach(prevChildren, (v, k) => this.unloadOutlet(outletMap._outlets[k], components));
    }
    loadSegments(currNode, prevNode, parentOutletMap, components) {
        let curr = currNode.value;
        let prev = isPresent(prevNode) ? prevNode.value : null;
        let outlet = this.getOutlet(parentOutletMap, currNode.value);
        if (equalSegments(curr, prev)) {
            this.loadChildSegments(currNode, prevNode, outlet.outletMap, components.concat([outlet.loadedComponent]));
        }
        else {
            this.unloadOutlet(outlet, components);
            if (this.performMutation) {
                let outletMap = new RouterOutletMap();
                let loadedComponent = this.loadNewSegment(outletMap, curr, prev, outlet);
                this.loadChildSegments(currNode, prevNode, outletMap, components.concat([loadedComponent]));
            }
        }
    }
    loadNewSegment(outletMap, curr, prev, outlet) {
        let resolved = ReflectiveInjector.resolve([provide(RouterOutletMap, { useValue: outletMap }), provide(RouteSegment, { useValue: curr })]);
        let ref = outlet.load(routeSegmentComponentFactory(curr), resolved, outletMap);
        if (hasLifecycleHook("routerOnActivate", ref.instance)) {
            ref.instance.routerOnActivate(curr, prev, this.currTree, this.prevTree);
        }
        return ref.instance;
    }
    getOutlet(outletMap, segment) {
        let outlet = outletMap._outlets[segment.outlet];
        if (isBlank(outlet)) {
            if (segment.outlet == DEFAULT_OUTLET_NAME) {
                throw new BaseException(`Cannot find default outlet`);
            }
            else {
                throw new BaseException(`Cannot find the outlet ${segment.outlet}`);
            }
        }
        return outlet;
    }
    unloadOutlet(outlet, components) {
        if (outlet.isLoaded) {
            StringMapWrapper.forEach(outlet.outletMap._outlets, (v, k) => this.unloadOutlet(v, components));
            if (this.performMutation) {
                outlet.unload();
            }
            else {
                this.deactivations.push(components.concat([outlet.loadedComponent]));
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1wbjloczBaZS50bXAvYW5ndWxhcjIvc3JjL2FsdF9yb3V0ZXIvcm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQVMsT0FBTyxFQUFFLGtCQUFrQixFQUFvQixNQUFNLGVBQWU7T0FFN0UsRUFBTyxPQUFPLEVBQUUsU0FBUyxFQUFDLE1BQU0sMEJBQTBCO09BQzFELEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0NBQWdDO09BQ25ELEVBQUMsWUFBWSxFQUFjLGNBQWMsRUFBQyxNQUFNLDJCQUEyQjtPQUMzRSxFQUFDLGdCQUFnQixFQUFDLE1BQU0sZ0NBQWdDO09BQ3hELEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0NBQWdDO09BR3JELEVBQUMsU0FBUyxFQUFDLE1BQU0sYUFBYTtPQUU5QixFQUFDLElBQUksRUFBQyxNQUFNLFFBQVE7T0FFcEIsRUFDTCxhQUFhLEVBQ2IsNEJBQTRCLEVBQzVCLFlBQVksRUFFWixRQUFRLEVBSVQsTUFBTSxZQUFZO09BQ1osRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHVCQUF1QjtPQUMvQyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sYUFBYTtBQUUvQztJQUFBO1FBQ0UsZ0JBQWdCO1FBQ2hCLGFBQVEsR0FBbUMsRUFBRSxDQUFDO0lBRWhELENBQUM7SUFEQyxjQUFjLENBQUMsSUFBWSxFQUFFLE1BQW9CLElBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzVGLENBQUM7QUFFRDtJQU1FLFlBQW9CLGNBQXNCLEVBQVUsa0JBQXdCLEVBQ3hELGtCQUFxQyxFQUNyQyxjQUFtQyxFQUNuQyxnQkFBaUMsRUFBVSxTQUFtQjtRQUg5RCxtQkFBYyxHQUFkLGNBQWMsQ0FBUTtRQUFVLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBTTtRQUN4RCx1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QyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7Z0JBQzFDLE1BQU0sSUFBSSxhQUFhLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUN4RCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sTUFBTSxJQUFJLGFBQWEsQ0FBQywwQkFBMEIsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDdEUsQ0FBQztRQUNILENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxZQUFZLENBQUMsTUFBb0IsRUFBRSxVQUFvQjtRQUM3RCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNwQixnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQ3pCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3JFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDbEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZFLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7T25Jbml0LCBwcm92aWRlLCBSZWZsZWN0aXZlSW5qZWN0b3IsIENvbXBvbmVudFJlc29sdmVyfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7Um91dGVyT3V0bGV0fSBmcm9tICcuL2RpcmVjdGl2ZXMvcm91dGVyX291dGxldCc7XG5pbXBvcnQge1R5cGUsIGlzQmxhbmssIGlzUHJlc2VudH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge0V2ZW50RW1pdHRlciwgT2JzZXJ2YWJsZSwgUHJvbWlzZVdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvYXN5bmMnO1xuaW1wb3J0IHtTdHJpbmdNYXBXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtSb3V0ZXJVcmxTZXJpYWxpemVyfSBmcm9tICcuL3JvdXRlcl91cmxfc2VyaWFsaXplcic7XG5pbXBvcnQge0NhbkRlYWN0aXZhdGV9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQge3JlY29nbml6ZX0gZnJvbSAnLi9yZWNvZ25pemUnO1xuaW1wb3J0IHtMb2NhdGlvbn0gZnJvbSAnYW5ndWxhcjIvcGxhdGZvcm0vY29tbW9uJztcbmltcG9ydCB7bGlua30gZnJvbSAnLi9saW5rJztcblxuaW1wb3J0IHtcbiAgZXF1YWxTZWdtZW50cyxcbiAgcm91dGVTZWdtZW50Q29tcG9uZW50RmFjdG9yeSxcbiAgUm91dGVTZWdtZW50LFxuICBUcmVlLFxuICByb290Tm9kZSxcbiAgVHJlZU5vZGUsXG4gIFVybFNlZ21lbnQsXG4gIHNlcmlhbGl6ZVJvdXRlU2VnbWVudFRyZWVcbn0gZnJvbSAnLi9zZWdtZW50cyc7XG5pbXBvcnQge2hhc0xpZmVjeWNsZUhvb2t9IGZyb20gJy4vbGlmZWN5Y2xlX3JlZmxlY3Rvcic7XG5pbXBvcnQge0RFRkFVTFRfT1VUTEVUX05BTUV9IGZyb20gJy4vY29uc3RhbnRzJztcblxuZXhwb3J0IGNsYXNzIFJvdXRlck91dGxldE1hcCB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX291dGxldHM6IHtbbmFtZTogc3RyaW5nXTogUm91dGVyT3V0bGV0fSA9IHt9O1xuICByZWdpc3Rlck91dGxldChuYW1lOiBzdHJpbmcsIG91dGxldDogUm91dGVyT3V0bGV0KTogdm9pZCB7IHRoaXMuX291dGxldHNbbmFtZV0gPSBvdXRsZXQ7IH1cbn1cblxuZXhwb3J0IGNsYXNzIFJvdXRlciB7XG4gIHByaXZhdGUgX3ByZXZUcmVlOiBUcmVlPFJvdXRlU2VnbWVudD47XG4gIHByaXZhdGUgX3VybFRyZWU6IFRyZWU8VXJsU2VnbWVudD47XG5cbiAgcHJpdmF0ZSBfY2hhbmdlczogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3Jvb3RDb21wb25lbnQ6IE9iamVjdCwgcHJpdmF0ZSBfcm9vdENvbXBvbmVudFR5cGU6IFR5cGUsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NvbXBvbmVudFJlc29sdmVyOiBDb21wb25lbnRSZXNvbHZlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfdXJsU2VyaWFsaXplcjogUm91dGVyVXJsU2VyaWFsaXplcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfcm91dGVyT3V0bGV0TWFwOiBSb3V0ZXJPdXRsZXRNYXAsIHByaXZhdGUgX2xvY2F0aW9uOiBMb2NhdGlvbikge1xuICAgIHRoaXMubmF2aWdhdGVCeVVybCh0aGlzLl9sb2NhdGlvbi5wYXRoKCkpO1xuICB9XG5cbiAgZ2V0IHVybFRyZWUoKTogVHJlZTxVcmxTZWdtZW50PiB7IHJldHVybiB0aGlzLl91cmxUcmVlOyB9XG5cbiAgbmF2aWdhdGVCeVVybCh1cmw6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9uYXZpZ2F0ZSh0aGlzLl91cmxTZXJpYWxpemVyLnBhcnNlKHVybCkpO1xuICB9XG5cbiAgbmF2aWdhdGUoY2hhbmdlczogYW55W10sIHNlZ21lbnQ/OiBSb3V0ZVNlZ21lbnQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fbmF2aWdhdGUodGhpcy5jcmVhdGVVcmxUcmVlKGNoYW5nZXMsIHNlZ21lbnQpKTtcbiAgfVxuXG4gIHByaXZhdGUgX25hdmlnYXRlKHVybDogVHJlZTxVcmxTZWdtZW50Pik6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuX3VybFRyZWUgPSB1cmw7XG4gICAgcmV0dXJuIHJlY29nbml6ZSh0aGlzLl9jb21wb25lbnRSZXNvbHZlciwgdGhpcy5fcm9vdENvbXBvbmVudFR5cGUsIHVybClcbiAgICAgICAgLnRoZW4oY3VyclRyZWUgPT4ge1xuICAgICAgICAgIHJldHVybiBuZXcgX0xvYWRTZWdtZW50cyhjdXJyVHJlZSwgdGhpcy5fcHJldlRyZWUpXG4gICAgICAgICAgICAgIC5sb2FkKHRoaXMuX3JvdXRlck91dGxldE1hcCwgdGhpcy5fcm9vdENvbXBvbmVudClcbiAgICAgICAgICAgICAgLnRoZW4oXyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJldlRyZWUgPSBjdXJyVHJlZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2NhdGlvbi5nbyh0aGlzLl91cmxTZXJpYWxpemVyLnNlcmlhbGl6ZSh0aGlzLl91cmxUcmVlKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlcy5lbWl0KG51bGwpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gIH1cblxuICBjcmVhdGVVcmxUcmVlKGNoYW5nZXM6IGFueVtdLCBzZWdtZW50PzogUm91dGVTZWdtZW50KTogVHJlZTxVcmxTZWdtZW50PiB7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLl9wcmV2VHJlZSkpIHtcbiAgICAgIGxldCBzID0gaXNQcmVzZW50KHNlZ21lbnQpID8gc2VnbWVudCA6IHRoaXMuX3ByZXZUcmVlLnJvb3Q7XG4gICAgICByZXR1cm4gbGluayhzLCB0aGlzLl9wcmV2VHJlZSwgdGhpcy51cmxUcmVlLCBjaGFuZ2VzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgc2VyaWFsaXplVXJsKHVybDogVHJlZTxVcmxTZWdtZW50Pik6IHN0cmluZyB7IHJldHVybiB0aGlzLl91cmxTZXJpYWxpemVyLnNlcmlhbGl6ZSh1cmwpOyB9XG5cbiAgZ2V0IGNoYW5nZXMoKTogT2JzZXJ2YWJsZTx2b2lkPiB7IHJldHVybiB0aGlzLl9jaGFuZ2VzOyB9XG5cbiAgZ2V0IHJvdXRlVHJlZSgpOiBUcmVlPFJvdXRlU2VnbWVudD4geyByZXR1cm4gdGhpcy5fcHJldlRyZWU7IH1cbn1cblxuXG5jbGFzcyBfTG9hZFNlZ21lbnRzIHtcbiAgcHJpdmF0ZSBkZWFjdGl2YXRpb25zOiBPYmplY3RbXVtdID0gW107XG4gIHByaXZhdGUgcGVyZm9ybU11dGF0aW9uOiBib29sZWFuID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGN1cnJUcmVlOiBUcmVlPFJvdXRlU2VnbWVudD4sIHByaXZhdGUgcHJldlRyZWU6IFRyZWU8Um91dGVTZWdtZW50Pikge31cblxuICBsb2FkKHBhcmVudE91dGxldE1hcDogUm91dGVyT3V0bGV0TWFwLCByb290Q29tcG9uZW50OiBPYmplY3QpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsZXQgcHJldlJvb3QgPSBpc1ByZXNlbnQodGhpcy5wcmV2VHJlZSkgPyByb290Tm9kZSh0aGlzLnByZXZUcmVlKSA6IG51bGw7XG4gICAgbGV0IGN1cnJSb290ID0gcm9vdE5vZGUodGhpcy5jdXJyVHJlZSk7XG5cbiAgICByZXR1cm4gdGhpcy5jYW5EZWFjdGl2YXRlKGN1cnJSb290LCBwcmV2Um9vdCwgcGFyZW50T3V0bGV0TWFwLCByb290Q29tcG9uZW50KVxuICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgIHRoaXMucGVyZm9ybU11dGF0aW9uID0gdHJ1ZTtcbiAgICAgICAgICBpZiAocmVzKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRDaGlsZFNlZ21lbnRzKGN1cnJSb290LCBwcmV2Um9vdCwgcGFyZW50T3V0bGV0TWFwLCBbcm9vdENvbXBvbmVudF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNhbkRlYWN0aXZhdGUoY3VyclJvb3Q6IFRyZWVOb2RlPFJvdXRlU2VnbWVudD4sIHByZXZSb290OiBUcmVlTm9kZTxSb3V0ZVNlZ21lbnQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0bGV0TWFwOiBSb3V0ZXJPdXRsZXRNYXAsIHJvb3RDb21wb25lbnQ6IE9iamVjdCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHRoaXMucGVyZm9ybU11dGF0aW9uID0gZmFsc2U7XG4gICAgdGhpcy5sb2FkQ2hpbGRTZWdtZW50cyhjdXJyUm9vdCwgcHJldlJvb3QsIG91dGxldE1hcCwgW3Jvb3RDb21wb25lbnRdKTtcblxuICAgIGxldCBhbGxQYXRocyA9IFByb21pc2VXcmFwcGVyLmFsbCh0aGlzLmRlYWN0aXZhdGlvbnMubWFwKHIgPT4gdGhpcy5jaGVja0NhbkRlYWN0aXZhdGVQYXRoKHIpKSk7XG4gICAgcmV0dXJuIGFsbFBhdGhzLnRoZW4oKHZhbHVlczogYm9vbGVhbltdKSA9PiB2YWx1ZXMuZmlsdGVyKHYgPT4gdikubGVuZ3RoID09PSB2YWx1ZXMubGVuZ3RoKTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tDYW5EZWFjdGl2YXRlUGF0aChwYXRoOiBPYmplY3RbXSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGxldCBjdXJyID0gUHJvbWlzZVdyYXBwZXIucmVzb2x2ZSh0cnVlKTtcbiAgICBmb3IgKGxldCBwIG9mIExpc3RXcmFwcGVyLnJldmVyc2VkKHBhdGgpKSB7XG4gICAgICBjdXJyID0gY3Vyci50aGVuKF8gPT4ge1xuICAgICAgICBpZiAoaGFzTGlmZWN5Y2xlSG9vayhcInJvdXRlckNhbkRlYWN0aXZhdGVcIiwgcCkpIHtcbiAgICAgICAgICByZXR1cm4gKDxDYW5EZWFjdGl2YXRlPnApLnJvdXRlckNhbkRlYWN0aXZhdGUodGhpcy5wcmV2VHJlZSwgdGhpcy5jdXJyVHJlZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIF87XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gY3VycjtcbiAgfVxuXG4gIHByaXZhdGUgbG9hZENoaWxkU2VnbWVudHMoY3Vyck5vZGU6IFRyZWVOb2RlPFJvdXRlU2VnbWVudD4sIHByZXZOb2RlOiBUcmVlTm9kZTxSb3V0ZVNlZ21lbnQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dGxldE1hcDogUm91dGVyT3V0bGV0TWFwLCBjb21wb25lbnRzOiBPYmplY3RbXSk6IHZvaWQge1xuICAgIGxldCBwcmV2Q2hpbGRyZW4gPSBpc1ByZXNlbnQocHJldk5vZGUpID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZOb2RlLmNoaWxkcmVuLnJlZHVjZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobSwgYykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbVtjLnZhbHVlLm91dGxldF0gPSBjO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7fSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAge307XG5cbiAgICBjdXJyTm9kZS5jaGlsZHJlbi5mb3JFYWNoKGMgPT4ge1xuICAgICAgdGhpcy5sb2FkU2VnbWVudHMoYywgcHJldkNoaWxkcmVuW2MudmFsdWUub3V0bGV0XSwgb3V0bGV0TWFwLCBjb21wb25lbnRzKTtcbiAgICAgIFN0cmluZ01hcFdyYXBwZXIuZGVsZXRlKHByZXZDaGlsZHJlbiwgYy52YWx1ZS5vdXRsZXQpO1xuICAgIH0pO1xuXG4gICAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKHByZXZDaGlsZHJlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYsIGspID0+IHRoaXMudW5sb2FkT3V0bGV0KG91dGxldE1hcC5fb3V0bGV0c1trXSwgY29tcG9uZW50cykpO1xuICB9XG5cbiAgbG9hZFNlZ21lbnRzKGN1cnJOb2RlOiBUcmVlTm9kZTxSb3V0ZVNlZ21lbnQ+LCBwcmV2Tm9kZTogVHJlZU5vZGU8Um91dGVTZWdtZW50PixcbiAgICAgICAgICAgICAgIHBhcmVudE91dGxldE1hcDogUm91dGVyT3V0bGV0TWFwLCBjb21wb25lbnRzOiBPYmplY3RbXSk6IHZvaWQge1xuICAgIGxldCBjdXJyID0gY3Vyck5vZGUudmFsdWU7XG4gICAgbGV0IHByZXYgPSBpc1ByZXNlbnQocHJldk5vZGUpID8gcHJldk5vZGUudmFsdWUgOiBudWxsO1xuICAgIGxldCBvdXRsZXQgPSB0aGlzLmdldE91dGxldChwYXJlbnRPdXRsZXRNYXAsIGN1cnJOb2RlLnZhbHVlKTtcblxuICAgIGlmIChlcXVhbFNlZ21lbnRzKGN1cnIsIHByZXYpKSB7XG4gICAgICB0aGlzLmxvYWRDaGlsZFNlZ21lbnRzKGN1cnJOb2RlLCBwcmV2Tm9kZSwgb3V0bGV0Lm91dGxldE1hcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5jb25jYXQoW291dGxldC5sb2FkZWRDb21wb25lbnRdKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudW5sb2FkT3V0bGV0KG91dGxldCwgY29tcG9uZW50cyk7XG4gICAgICBpZiAodGhpcy5wZXJmb3JtTXV0YXRpb24pIHtcbiAgICAgICAgbGV0IG91dGxldE1hcCA9IG5ldyBSb3V0ZXJPdXRsZXRNYXAoKTtcbiAgICAgICAgbGV0IGxvYWRlZENvbXBvbmVudCA9IHRoaXMubG9hZE5ld1NlZ21lbnQob3V0bGV0TWFwLCBjdXJyLCBwcmV2LCBvdXRsZXQpO1xuICAgICAgICB0aGlzLmxvYWRDaGlsZFNlZ21lbnRzKGN1cnJOb2RlLCBwcmV2Tm9kZSwgb3V0bGV0TWFwLCBjb21wb25lbnRzLmNvbmNhdChbbG9hZGVkQ29tcG9uZW50XSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbG9hZE5ld1NlZ21lbnQob3V0bGV0TWFwOiBSb3V0ZXJPdXRsZXRNYXAsIGN1cnI6IFJvdXRlU2VnbWVudCwgcHJldjogUm91dGVTZWdtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgIG91dGxldDogUm91dGVyT3V0bGV0KTogT2JqZWN0IHtcbiAgICBsZXQgcmVzb2x2ZWQgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZShcbiAgICAgICAgW3Byb3ZpZGUoUm91dGVyT3V0bGV0TWFwLCB7dXNlVmFsdWU6IG91dGxldE1hcH0pLCBwcm92aWRlKFJvdXRlU2VnbWVudCwge3VzZVZhbHVlOiBjdXJyfSldKTtcbiAgICBsZXQgcmVmID0gb3V0bGV0LmxvYWQocm91dGVTZWdtZW50Q29tcG9uZW50RmFjdG9yeShjdXJyKSwgcmVzb2x2ZWQsIG91dGxldE1hcCk7XG4gICAgaWYgKGhhc0xpZmVjeWNsZUhvb2soXCJyb3V0ZXJPbkFjdGl2YXRlXCIsIHJlZi5pbnN0YW5jZSkpIHtcbiAgICAgIHJlZi5pbnN0YW5jZS5yb3V0ZXJPbkFjdGl2YXRlKGN1cnIsIHByZXYsIHRoaXMuY3VyclRyZWUsIHRoaXMucHJldlRyZWUpO1xuICAgIH1cbiAgICByZXR1cm4gcmVmLmluc3RhbmNlO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRPdXRsZXQob3V0bGV0TWFwOiBSb3V0ZXJPdXRsZXRNYXAsIHNlZ21lbnQ6IFJvdXRlU2VnbWVudCk6IFJvdXRlck91dGxldCB7XG4gICAgbGV0IG91dGxldCA9IG91dGxldE1hcC5fb3V0bGV0c1tzZWdtZW50Lm91dGxldF07XG4gICAgaWYgKGlzQmxhbmsob3V0bGV0KSkge1xuICAgICAgaWYgKHNlZ21lbnQub3V0bGV0ID09IERFRkFVTFRfT1VUTEVUX05BTUUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYENhbm5vdCBmaW5kIGRlZmF1bHQgb3V0bGV0YCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgQ2Fubm90IGZpbmQgdGhlIG91dGxldCAke3NlZ21lbnQub3V0bGV0fWApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0bGV0O1xuICB9XG5cbiAgcHJpdmF0ZSB1bmxvYWRPdXRsZXQob3V0bGV0OiBSb3V0ZXJPdXRsZXQsIGNvbXBvbmVudHM6IE9iamVjdFtdKTogdm9pZCB7XG4gICAgaWYgKG91dGxldC5pc0xvYWRlZCkge1xuICAgICAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKG91dGxldC5vdXRsZXRNYXAuX291dGxldHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYsIGspID0+IHRoaXMudW5sb2FkT3V0bGV0KHYsIGNvbXBvbmVudHMpKTtcbiAgICAgIGlmICh0aGlzLnBlcmZvcm1NdXRhdGlvbikge1xuICAgICAgICBvdXRsZXQudW5sb2FkKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlYWN0aXZhdGlvbnMucHVzaChjb21wb25lbnRzLmNvbmNhdChbb3V0bGV0LmxvYWRlZENvbXBvbmVudF0pKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0iXX0=