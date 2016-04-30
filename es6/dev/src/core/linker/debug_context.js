import { isPresent, isBlank } from 'angular2/src/facade/lang';
import { StringMapWrapper } from 'angular2/src/facade/collection';
import { ViewType } from './view_type';
/* @ts2dart_const */
export class StaticNodeDebugInfo {
    constructor(providerTokens, componentToken, refTokens) {
        this.providerTokens = providerTokens;
        this.componentToken = componentToken;
        this.refTokens = refTokens;
    }
}
export class DebugContext {
    constructor(_view, _nodeIndex, _tplRow, _tplCol) {
        this._view = _view;
        this._nodeIndex = _nodeIndex;
        this._tplRow = _tplRow;
        this._tplCol = _tplCol;
    }
    get _staticNodeInfo() {
        return isPresent(this._nodeIndex) ? this._view.staticNodeDebugInfos[this._nodeIndex] : null;
    }
    get context() { return this._view.context; }
    get component() {
        var staticNodeInfo = this._staticNodeInfo;
        if (isPresent(staticNodeInfo) && isPresent(staticNodeInfo.componentToken)) {
            return this.injector.get(staticNodeInfo.componentToken);
        }
        return null;
    }
    get componentRenderElement() {
        var componentView = this._view;
        while (isPresent(componentView.declarationAppElement) &&
            componentView.type !== ViewType.COMPONENT) {
            componentView = componentView.declarationAppElement.parentView;
        }
        return isPresent(componentView.declarationAppElement) ?
            componentView.declarationAppElement.nativeElement :
            null;
    }
    get injector() { return this._view.injector(this._nodeIndex); }
    get renderNode() {
        if (isPresent(this._nodeIndex) && isPresent(this._view.allNodes)) {
            return this._view.allNodes[this._nodeIndex];
        }
        else {
            return null;
        }
    }
    get providerTokens() {
        var staticNodeInfo = this._staticNodeInfo;
        return isPresent(staticNodeInfo) ? staticNodeInfo.providerTokens : null;
    }
    get source() {
        return `${this._view.componentType.templateUrl}:${this._tplRow}:${this._tplCol}`;
    }
    get references() {
        var varValues = {};
        var staticNodeInfo = this._staticNodeInfo;
        if (isPresent(staticNodeInfo)) {
            var refs = staticNodeInfo.refTokens;
            StringMapWrapper.forEach(refs, (refToken, refName) => {
                var varValue;
                if (isBlank(refToken)) {
                    varValue = isPresent(this._view.allNodes) ? this._view.allNodes[this._nodeIndex] : null;
                }
                else {
                    varValue = this._view.injectorGet(refToken, this._nodeIndex, null);
                }
                varValues[refName] = varValue;
            });
        }
        return varValues;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWdfY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtcG45aHMwWmUudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9kZWJ1Z19jb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxNQUFNLDBCQUEwQjtPQUNwRCxFQUFjLGdCQUFnQixFQUFDLE1BQU0sZ0NBQWdDO09BSXJFLEVBQUMsUUFBUSxFQUFDLE1BQU0sYUFBYTtBQUVwQyxvQkFBb0I7QUFDcEI7SUFDRSxZQUFtQixjQUFxQixFQUFTLGNBQW1CLEVBQ2pELFNBQStCO1FBRC9CLG1CQUFjLEdBQWQsY0FBYyxDQUFPO1FBQVMsbUJBQWMsR0FBZCxjQUFjLENBQUs7UUFDakQsY0FBUyxHQUFULFNBQVMsQ0FBc0I7SUFBRyxDQUFDO0FBQ3hELENBQUM7QUFFRDtJQUNFLFlBQW9CLEtBQXdCLEVBQVUsVUFBa0IsRUFBVSxPQUFlLEVBQzdFLE9BQWU7UUFEZixVQUFLLEdBQUwsS0FBSyxDQUFtQjtRQUFVLGVBQVUsR0FBVixVQUFVLENBQVE7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQzdFLFlBQU8sR0FBUCxPQUFPLENBQVE7SUFBRyxDQUFDO0lBRXZDLElBQVksZUFBZTtRQUN6QixNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDOUYsQ0FBQztJQUVELElBQUksT0FBTyxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDNUMsSUFBSSxTQUFTO1FBQ1gsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUMxQyxFQUFFLENB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LENBQUM7UUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25CLENBQUM7QUFDSCxDQUFDO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzUHJlc2VudCwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TGlzdFdyYXBwZXIsIFN0cmluZ01hcFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge0luamVjdG9yfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5pbXBvcnQge1JlbmRlckRlYnVnSW5mb30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvcmVuZGVyL2FwaSc7XG5pbXBvcnQge0RlYnVnQXBwVmlld30gZnJvbSAnLi92aWV3JztcbmltcG9ydCB7Vmlld1R5cGV9IGZyb20gJy4vdmlld190eXBlJztcblxuLyogQHRzMmRhcnRfY29uc3QgKi9cbmV4cG9ydCBjbGFzcyBTdGF0aWNOb2RlRGVidWdJbmZvIHtcbiAgY29uc3RydWN0b3IocHVibGljIHByb3ZpZGVyVG9rZW5zOiBhbnlbXSwgcHVibGljIGNvbXBvbmVudFRva2VuOiBhbnksXG4gICAgICAgICAgICAgIHB1YmxpYyByZWZUb2tlbnM6IHtba2V5OiBzdHJpbmddOiBhbnl9KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgRGVidWdDb250ZXh0IGltcGxlbWVudHMgUmVuZGVyRGVidWdJbmZvIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdmlldzogRGVidWdBcHBWaWV3PGFueT4sIHByaXZhdGUgX25vZGVJbmRleDogbnVtYmVyLCBwcml2YXRlIF90cGxSb3c6IG51bWJlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfdHBsQ29sOiBudW1iZXIpIHt9XG5cbiAgcHJpdmF0ZSBnZXQgX3N0YXRpY05vZGVJbmZvKCk6IFN0YXRpY05vZGVEZWJ1Z0luZm8ge1xuICAgIHJldHVybiBpc1ByZXNlbnQodGhpcy5fbm9kZUluZGV4KSA/IHRoaXMuX3ZpZXcuc3RhdGljTm9kZURlYnVnSW5mb3NbdGhpcy5fbm9kZUluZGV4XSA6IG51bGw7XG4gIH1cblxuICBnZXQgY29udGV4dCgpIHsgcmV0dXJuIHRoaXMuX3ZpZXcuY29udGV4dDsgfVxuICBnZXQgY29tcG9uZW50KCkge1xuICAgIHZhciBzdGF0aWNOb2RlSW5mbyA9IHRoaXMuX3N0YXRpY05vZGVJbmZvO1xuICAgIGlmIChpc1ByZXNlbnQoc3RhdGljTm9kZUluZm8pICYmIGlzUHJlc2VudChzdGF0aWNOb2RlSW5mby5jb21wb25lbnRUb2tlbikpIHtcbiAgICAgIHJldHVybiB0aGlzLmluamVjdG9yLmdldChzdGF0aWNOb2RlSW5mby5jb21wb25lbnRUb2tlbik7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGdldCBjb21wb25lbnRSZW5kZXJFbGVtZW50KCkge1xuICAgIHZhciBjb21wb25lbnRWaWV3ID0gdGhpcy5fdmlldztcbiAgICB3aGlsZSAoaXNQcmVzZW50KGNvbXBvbmVudFZpZXcuZGVjbGFyYXRpb25BcHBFbGVtZW50KSAmJlxuICAgICAgICAgICBjb21wb25lbnRWaWV3LnR5cGUgIT09IFZpZXdUeXBlLkNPTVBPTkVOVCkge1xuICAgICAgY29tcG9uZW50VmlldyA9IDxEZWJ1Z0FwcFZpZXc8YW55Pj5jb21wb25lbnRWaWV3LmRlY2xhcmF0aW9uQXBwRWxlbWVudC5wYXJlbnRWaWV3O1xuICAgIH1cbiAgICByZXR1cm4gaXNQcmVzZW50KGNvbXBvbmVudFZpZXcuZGVjbGFyYXRpb25BcHBFbGVtZW50KSA/XG4gICAgICAgICAgICAgICBjb21wb25lbnRWaWV3LmRlY2xhcmF0aW9uQXBwRWxlbWVudC5uYXRpdmVFbGVtZW50IDpcbiAgICAgICAgICAgICAgIG51bGw7XG4gIH1cbiAgZ2V0IGluamVjdG9yKCk6IEluamVjdG9yIHsgcmV0dXJuIHRoaXMuX3ZpZXcuaW5qZWN0b3IodGhpcy5fbm9kZUluZGV4KTsgfVxuICBnZXQgcmVuZGVyTm9kZSgpOiBhbnkge1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy5fbm9kZUluZGV4KSAmJiBpc1ByZXNlbnQodGhpcy5fdmlldy5hbGxOb2RlcykpIHtcbiAgICAgIHJldHVybiB0aGlzLl92aWV3LmFsbE5vZGVzW3RoaXMuX25vZGVJbmRleF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuICBnZXQgcHJvdmlkZXJUb2tlbnMoKTogYW55W10ge1xuICAgIHZhciBzdGF0aWNOb2RlSW5mbyA9IHRoaXMuX3N0YXRpY05vZGVJbmZvO1xuICAgIHJldHVybiBpc1ByZXNlbnQoc3RhdGljTm9kZUluZm8pID8gc3RhdGljTm9kZUluZm8ucHJvdmlkZXJUb2tlbnMgOiBudWxsO1xuICB9XG4gIGdldCBzb3VyY2UoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7dGhpcy5fdmlldy5jb21wb25lbnRUeXBlLnRlbXBsYXRlVXJsfToke3RoaXMuX3RwbFJvd306JHt0aGlzLl90cGxDb2x9YDtcbiAgfVxuICBnZXQgcmVmZXJlbmNlcygpOiB7W2tleTogc3RyaW5nXTogYW55fSB7XG4gICAgdmFyIHZhclZhbHVlczoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbiAgICB2YXIgc3RhdGljTm9kZUluZm8gPSB0aGlzLl9zdGF0aWNOb2RlSW5mbztcbiAgICBpZiAoaXNQcmVzZW50KHN0YXRpY05vZGVJbmZvKSkge1xuICAgICAgdmFyIHJlZnMgPSBzdGF0aWNOb2RlSW5mby5yZWZUb2tlbnM7XG4gICAgICBTdHJpbmdNYXBXcmFwcGVyLmZvckVhY2gocmVmcywgKHJlZlRva2VuLCByZWZOYW1lKSA9PiB7XG4gICAgICAgIHZhciB2YXJWYWx1ZTtcbiAgICAgICAgaWYgKGlzQmxhbmsocmVmVG9rZW4pKSB7XG4gICAgICAgICAgdmFyVmFsdWUgPSBpc1ByZXNlbnQodGhpcy5fdmlldy5hbGxOb2RlcykgPyB0aGlzLl92aWV3LmFsbE5vZGVzW3RoaXMuX25vZGVJbmRleF0gOiBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhclZhbHVlID0gdGhpcy5fdmlldy5pbmplY3RvckdldChyZWZUb2tlbiwgdGhpcy5fbm9kZUluZGV4LCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICB2YXJWYWx1ZXNbcmVmTmFtZV0gPSB2YXJWYWx1ZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdmFyVmFsdWVzO1xuICB9XG59XG4iXX0=