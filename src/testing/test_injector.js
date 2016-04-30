'use strict';"use strict";
var core_1 = require('angular2/core');
var exceptions_1 = require('angular2/src/facade/exceptions');
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var async_1 = require('./async');
var async_test_completer_1 = require('./async_test_completer');
var async_2 = require('./async');
exports.async = async_2.async;
var TestInjector = (function () {
    function TestInjector() {
        this._instantiated = false;
        this._injector = null;
        this._providers = [];
        this.platformProviders = [];
        this.applicationProviders = [];
    }
    TestInjector.prototype.reset = function () {
        this._injector = null;
        this._providers = [];
        this._instantiated = false;
    };
    TestInjector.prototype.addProviders = function (providers) {
        if (this._instantiated) {
            throw new exceptions_1.BaseException('Cannot add providers after test injector is instantiated');
        }
        this._providers = collection_1.ListWrapper.concat(this._providers, providers);
    };
    TestInjector.prototype.createInjector = function () {
        var rootInjector = core_1.ReflectiveInjector.resolveAndCreate(this.platformProviders);
        this._injector = rootInjector.resolveAndCreateChild(collection_1.ListWrapper.concat(this.applicationProviders, this._providers));
        this._instantiated = true;
        return this._injector;
    };
    TestInjector.prototype.get = function (token) {
        if (!this._instantiated) {
            this.createInjector();
        }
        return this._injector.get(token);
    };
    TestInjector.prototype.execute = function (tokens, fn) {
        var _this = this;
        if (!this._instantiated) {
            this.createInjector();
        }
        var params = tokens.map(function (t) { return _this._injector.get(t); });
        return lang_1.FunctionWrapper.apply(fn, params);
    };
    return TestInjector;
}());
exports.TestInjector = TestInjector;
var _testInjector = null;
function getTestInjector() {
    if (_testInjector == null) {
        _testInjector = new TestInjector();
    }
    return _testInjector;
}
exports.getTestInjector = getTestInjector;
/**
 * Set the providers that the test injector should use. These should be providers
 * common to every test in the suite.
 *
 * This may only be called once, to set up the common providers for the current test
 * suite on teh current platform. If you absolutely need to change the providers,
 * first use `resetBaseTestProviders`.
 *
 * Test Providers for individual platforms are available from
 * 'angular2/platform/testing/<platform_name>'.
 */
function setBaseTestProviders(platformProviders, applicationProviders) {
    var testInjector = getTestInjector();
    if (testInjector.platformProviders.length > 0 || testInjector.applicationProviders.length > 0) {
        throw new exceptions_1.BaseException('Cannot set base providers because it has already been called');
    }
    testInjector.platformProviders = platformProviders;
    testInjector.applicationProviders = applicationProviders;
    var injector = testInjector.createInjector();
    var inits = injector.get(core_1.PLATFORM_INITIALIZER, null);
    if (lang_1.isPresent(inits)) {
        inits.forEach(function (init) { return init(); });
    }
    testInjector.reset();
}
exports.setBaseTestProviders = setBaseTestProviders;
/**
 * Reset the providers for the test injector.
 */
function resetBaseTestProviders() {
    var testInjector = getTestInjector();
    testInjector.platformProviders = [];
    testInjector.applicationProviders = [];
    testInjector.reset();
}
exports.resetBaseTestProviders = resetBaseTestProviders;
/**
 * Allows injecting dependencies in `beforeEach()` and `it()`.
 *
 * Example:
 *
 * ```
 * beforeEach(inject([Dependency, AClass], (dep, object) => {
 *   // some code that uses `dep` and `object`
 *   // ...
 * }));
 *
 * it('...', inject([AClass], (object) => {
 *   object.doSomething();
 *   expect(...);
 * })
 * ```
 *
 * Notes:
 * - inject is currently a function because of some Traceur limitation the syntax should
 * eventually
 *   becomes `it('...', @Inject (object: AClass, async: AsyncTestCompleter) => { ... });`
 *
 * @param {Array} tokens
 * @param {Function} fn
 * @return {Function}
 */
function inject(tokens, fn) {
    var testInjector = getTestInjector();
    if (tokens.indexOf(async_test_completer_1.AsyncTestCompleter) >= 0) {
        // Return an async test method that returns a Promise if AsyncTestCompleter is one of the
        // injected tokens.
        return function () {
            var completer = testInjector.get(async_test_completer_1.AsyncTestCompleter);
            testInjector.execute(tokens, fn);
            return completer.promise;
        };
    }
    else {
        // Return a synchronous test method with the injected tokens.
        return function () { return getTestInjector().execute(tokens, fn); };
    }
}
exports.inject = inject;
var InjectSetupWrapper = (function () {
    function InjectSetupWrapper(_providers) {
        this._providers = _providers;
    }
    InjectSetupWrapper.prototype._addProviders = function () {
        var additionalProviders = this._providers();
        if (additionalProviders.length > 0) {
            getTestInjector().addProviders(additionalProviders);
        }
    };
    InjectSetupWrapper.prototype.inject = function (tokens, fn) {
        var _this = this;
        return function () {
            _this._addProviders();
            return inject_impl(tokens, fn)();
        };
    };
    /** @Deprecated {use async(withProviders().inject())} */
    InjectSetupWrapper.prototype.injectAsync = function (tokens, fn) {
        var _this = this;
        return function () {
            _this._addProviders();
            return injectAsync_impl(tokens, fn)();
        };
    };
    return InjectSetupWrapper;
}());
exports.InjectSetupWrapper = InjectSetupWrapper;
function withProviders(providers) {
    return new InjectSetupWrapper(providers);
}
exports.withProviders = withProviders;
/**
 * @Deprecated {use async(inject())}
 *
 * Allows injecting dependencies in `beforeEach()` and `it()`. The test must return
 * a promise which will resolve when all asynchronous activity is complete.
 *
 * Example:
 *
 * ```
 * it('...', injectAsync([AClass], (object) => {
 *   return object.doSomething().then(() => {
 *     expect(...);
 *   });
 * })
 * ```
 *
 * @param {Array} tokens
 * @param {Function} fn
 * @return {Function}
 */
function injectAsync(tokens, fn) {
    return async_1.async(inject(tokens, fn));
}
exports.injectAsync = injectAsync;
// This is to ensure inject(Async) within InjectSetupWrapper doesn't call itself
// when transpiled to Dart.
var inject_impl = inject;
var injectAsync_impl = injectAsync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9pbmplY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtZjFQMkxSNmoudG1wL2FuZ3VsYXIyL3NyYy90ZXN0aW5nL3Rlc3RfaW5qZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUFpRSxlQUFlLENBQUMsQ0FBQTtBQUNqRiwyQkFBOEMsZ0NBQWdDLENBQUMsQ0FBQTtBQUMvRSwyQkFBMEIsZ0NBQWdDLENBQUMsQ0FBQTtBQUMzRCxxQkFBK0MsMEJBQTBCLENBQUMsQ0FBQTtBQUUxRSxzQkFBb0IsU0FBUyxDQUFDLENBQUE7QUFDOUIscUNBQWlDLHdCQUF3QixDQUFDLENBQUE7QUFFMUQsc0JBQW9CLFNBQVMsQ0FBQztBQUF0Qiw4QkFBc0I7QUFFOUI7SUFBQTtRQUNVLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBRS9CLGNBQVMsR0FBdUIsSUFBSSxDQUFDO1FBRXJDLGVBQVUsR0FBbUMsRUFBRSxDQUFDO1FBUXhELHNCQUFpQixHQUFtQyxFQUFFLENBQUM7UUFFdkQseUJBQW9CLEdBQW1DLEVBQUUsQ0FBQztJQStCNUQsQ0FBQztJQXZDQyw0QkFBSyxHQUFMO1FBQ0UsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7SUFDN0IsQ0FBQztJQU1ELG1DQUFZLEdBQVosVUFBYSxTQUF5QztRQUNwRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUN2QixNQUFNLElBQUksMEJBQWEsQ0FBQywwREFBMEQsQ0FBQyxDQUFDO1FBQ3RGLENBQUM7UUFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLHdCQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7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LENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDdEQsQ0FBQztJQUNILENBQUM7SUFFRCxtQ0FBTSxHQUFOLFVBQU8sTUFBYSxFQUFFLEVBQVk7UUFBbEMsaUJBS0M7UUFKQyxNQUFNLENBQUM7WUFDTCxLQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNuQyxDQUFDLENBQUE7SUFDSCxDQUFDO0lBRUQsd0RBQXdEO0lBQ3hELHdDQUFXLEdBQVgsVUFBWSxNQUFhLEVBQUUsRUFBWTtRQUF2QyxpQkFLQztRQUpDLE1BQU0sQ0FBQztZQUNMLEtBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNyQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDeEMsQ0FBQyxDQUFBO0lBQ0gsQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQXhCRCxJQXdCQztBQXhCWSwwQkFBa0IscUJBd0I5QixDQUFBO0FBRUQsdUJBQThCLFNBQW9CO0lBQ2hELE1BQU0sQ0FBQyxJQUFJLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzNDLENBQUM7QUFGZSxxQkFBYSxnQkFFNUIsQ0FBQTtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUJHO0FBQ0gscUJBQTRCLE1BQWEsRUFBRSxFQUFZO0lBQ3JELE1BQU0sQ0FBQyxhQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFGZSxtQkFBVyxjQUUxQixDQUFBO0FBRUQsZ0ZBQWdGO0FBQ2hGLDJCQUEyQjtBQUMzQixJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUM7QUFDekIsSUFBSSxnQkFBZ0IsR0FBRyxXQUFXLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1JlZmxlY3RpdmVJbmplY3RvciwgUHJvdmlkZXIsIFBMQVRGT1JNX0lOSVRJQUxJWkVSfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbiwgRXhjZXB0aW9uSGFuZGxlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7TGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge0Z1bmN0aW9uV3JhcHBlciwgaXNQcmVzZW50LCBUeXBlfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuXG5pbXBvcnQge2FzeW5jfSBmcm9tICcuL2FzeW5jJztcbmltcG9ydCB7QXN5bmNUZXN0Q29tcGxldGVyfSBmcm9tICcuL2FzeW5jX3Rlc3RfY29tcGxldGVyJztcblxuZXhwb3J0IHthc3luY30gZnJvbSAnLi9hc3luYyc7XG5cbmV4cG9ydCBjbGFzcyBUZXN0SW5qZWN0b3Ige1xuICBwcml2YXRlIF9pbnN0YW50aWF0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIF9pbmplY3RvcjogUmVmbGVjdGl2ZUluamVjdG9yID0gbnVsbDtcblxuICBwcml2YXRlIF9wcm92aWRlcnM6IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPiA9IFtdO1xuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuX2luamVjdG9yID0gbnVsbDtcbiAgICB0aGlzLl9wcm92aWRlcnMgPSBbXTtcbiAgICB0aGlzLl9pbnN0YW50aWF0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHBsYXRmb3JtUHJvdmlkZXJzOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4gPSBbXTtcblxuICBhcHBsaWNhdGlvblByb3ZpZGVyczogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+ID0gW107XG5cbiAgYWRkUHJvdmlkZXJzKHByb3ZpZGVyczogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+KSB7XG4gICAgaWYgKHRoaXMuX2luc3RhbnRpYXRlZCkge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oJ0Nhbm5vdCBhZGQgcHJvdmlkZXJzIGFmdGVyIHRlc3QgaW5qZWN0b3IgaXMgaW5zdGFudGlhdGVkJyk7XG4gICAgfVxuICAgIHRoaXMuX3Byb3ZpZGVycyA9IExpc3RXcmFwcGVyLmNvbmNhdCh0aGlzLl9wcm92aWRlcnMsIHByb3ZpZGVycyk7XG4gIH1cblxuICBjcmVhdGVJbmplY3RvcigpIHtcbiAgICB2YXIgcm9vdEluamVjdG9yID0gUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmVBbmRDcmVhdGUodGhpcy5wbGF0Zm9ybVByb3ZpZGVycyk7XG4gICAgdGhpcy5faW5qZWN0b3IgPSByb290SW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZUNoaWxkKFxuICAgICAgICBMaXN0V3JhcHBlci5jb25jYXQodGhpcy5hcHBsaWNhdGlvblByb3ZpZGVycywgdGhpcy5fcHJvdmlkZXJzKSk7XG4gICAgdGhpcy5faW5zdGFudGlhdGVkID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcy5faW5qZWN0b3I7XG4gIH1cblxuICBnZXQodG9rZW46IGFueSkge1xuICAgIGlmICghdGhpcy5faW5zdGFudGlhdGVkKSB7XG4gICAgICB0aGlzLmNyZWF0ZUluamVjdG9yKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9pbmplY3Rvci5nZXQodG9rZW4pO1xuICB9XG5cbiAgZXhlY3V0ZSh0b2tlbnM6IGFueVtdLCBmbjogRnVuY3Rpb24pOiBhbnkge1xuICAgIGlmICghdGhpcy5faW5zdGFudGlhdGVkKSB7XG4gICAgICB0aGlzLmNyZWF0ZUluamVjdG9yKCk7XG4gICAgfVxuICAgIHZhciBwYXJhbXMgPSB0b2tlbnMubWFwKHQgPT4gdGhpcy5faW5qZWN0b3IuZ2V0KHQpKTtcbiAgICByZXR1cm4gRnVuY3Rpb25XcmFwcGVyLmFwcGx5KGZuLCBwYXJhbXMpO1xuICB9XG59XG5cbnZhciBfdGVzdEluamVjdG9yOiBUZXN0SW5qZWN0b3IgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGVzdEluamVjdG9yKCkge1xuICBpZiAoX3Rlc3RJbmplY3RvciA9PSBudWxsKSB7XG4gICAgX3Rlc3RJbmplY3RvciA9IG5ldyBUZXN0SW5qZWN0b3IoKTtcbiAgfVxuICByZXR1cm4gX3Rlc3RJbmplY3Rvcjtcbn1cblxuLyoqXG4gKiBTZXQgdGhlIHByb3ZpZGVycyB0aGF0IHRoZSB0ZXN0IGluamVjdG9yIHNob3VsZCB1c2UuIFRoZXNlIHNob3VsZCBiZSBwcm92aWRlcnNcbiAqIGNvbW1vbiB0byBldmVyeSB0ZXN0IGluIHRoZSBzdWl0ZS5cbiAqXG4gKiBUaGlzIG1heSBvbmx5IGJlIGNhbGxlZCBvbmNlLCB0byBzZXQgdXAgdGhlIGNvbW1vbiBwcm92aWRlcnMgZm9yIHRoZSBjdXJyZW50IHRlc3RcbiAqIHN1aXRlIG9uIHRlaCBjdXJyZW50IHBsYXRmb3JtLiBJZiB5b3UgYWJzb2x1dGVseSBuZWVkIHRvIGNoYW5nZSB0aGUgcHJvdmlkZXJzLFxuICogZmlyc3QgdXNlIGByZXNldEJhc2VUZXN0UHJvdmlkZXJzYC5cbiAqXG4gKiBUZXN0IFByb3ZpZGVycyBmb3IgaW5kaXZpZHVhbCBwbGF0Zm9ybXMgYXJlIGF2YWlsYWJsZSBmcm9tXG4gKiAnYW5ndWxhcjIvcGxhdGZvcm0vdGVzdGluZy88cGxhdGZvcm1fbmFtZT4nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0QmFzZVRlc3RQcm92aWRlcnMocGxhdGZvcm1Qcm92aWRlcnM6IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBsaWNhdGlvblByb3ZpZGVyczogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+KSB7XG4gIHZhciB0ZXN0SW5qZWN0b3IgPSBnZXRUZXN0SW5qZWN0b3IoKTtcbiAgaWYgKHRlc3RJbmplY3Rvci5wbGF0Zm9ybVByb3ZpZGVycy5sZW5ndGggPiAwIHx8IHRlc3RJbmplY3Rvci5hcHBsaWNhdGlvblByb3ZpZGVycy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oJ0Nhbm5vdCBzZXQgYmFzZSBwcm92aWRlcnMgYmVjYXVzZSBpdCBoYXMgYWxyZWFkeSBiZWVuIGNhbGxlZCcpO1xuICB9XG4gIHRlc3RJbmplY3Rvci5wbGF0Zm9ybVByb3ZpZGVycyA9IHBsYXRmb3JtUHJvdmlkZXJzO1xuICB0ZXN0SW5qZWN0b3IuYXBwbGljYXRpb25Qcm92aWRlcnMgPSBhcHBsaWNhdGlvblByb3ZpZGVycztcbiAgdmFyIGluamVjdG9yID0gdGVzdEluamVjdG9yLmNyZWF0ZUluamVjdG9yKCk7XG4gIGxldCBpbml0czogRnVuY3Rpb25bXSA9IGluamVjdG9yLmdldChQTEFURk9STV9JTklUSUFMSVpFUiwgbnVsbCk7XG4gIGlmIChpc1ByZXNlbnQoaW5pdHMpKSB7XG4gICAgaW5pdHMuZm9yRWFjaChpbml0ID0+IGluaXQoKSk7XG4gIH1cbiAgdGVzdEluamVjdG9yLnJlc2V0KCk7XG59XG5cbi8qKlxuICogUmVzZXQgdGhlIHByb3ZpZGVycyBmb3IgdGhlIHRlc3QgaW5qZWN0b3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNldEJhc2VUZXN0UHJvdmlkZXJzKCkge1xuICB2YXIgdGVzdEluamVjdG9yID0gZ2V0VGVzdEluamVjdG9yKCk7XG4gIHRlc3RJbmplY3Rvci5wbGF0Zm9ybVByb3ZpZGVycyA9IFtdO1xuICB0ZXN0SW5qZWN0b3IuYXBwbGljYXRpb25Qcm92aWRlcnMgPSBbXTtcbiAgdGVzdEluamVjdG9yLnJlc2V0KCk7XG59XG5cbi8qKlxuICogQWxsb3dzIGluamVjdGluZyBkZXBlbmRlbmNpZXMgaW4gYGJlZm9yZUVhY2goKWAgYW5kIGBpdCgpYC5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYFxuICogYmVmb3JlRWFjaChpbmplY3QoW0RlcGVuZGVuY3ksIEFDbGFzc10sIChkZXAsIG9iamVjdCkgPT4ge1xuICogICAvLyBzb21lIGNvZGUgdGhhdCB1c2VzIGBkZXBgIGFuZCBgb2JqZWN0YFxuICogICAvLyAuLi5cbiAqIH0pKTtcbiAqXG4gKiBpdCgnLi4uJywgaW5qZWN0KFtBQ2xhc3NdLCAob2JqZWN0KSA9PiB7XG4gKiAgIG9iamVjdC5kb1NvbWV0aGluZygpO1xuICogICBleHBlY3QoLi4uKTtcbiAqIH0pXG4gKiBgYGBcbiAqXG4gKiBOb3RlczpcbiAqIC0gaW5qZWN0IGlzIGN1cnJlbnRseSBhIGZ1bmN0aW9uIGJlY2F1c2Ugb2Ygc29tZSBUcmFjZXVyIGxpbWl0YXRpb24gdGhlIHN5bnRheCBzaG91bGRcbiAqIGV2ZW50dWFsbHlcbiAqICAgYmVjb21lcyBgaXQoJy4uLicsIEBJbmplY3QgKG9iamVjdDogQUNsYXNzLCBhc3luYzogQXN5bmNUZXN0Q29tcGxldGVyKSA9PiB7IC4uLiB9KTtgXG4gKlxuICogQHBhcmFtIHtBcnJheX0gdG9rZW5zXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3QodG9rZW5zOiBhbnlbXSwgZm46IEZ1bmN0aW9uKTogRnVuY3Rpb24ge1xuICBsZXQgdGVzdEluamVjdG9yID0gZ2V0VGVzdEluamVjdG9yKCk7XG4gIGlmICh0b2tlbnMuaW5kZXhPZihBc3luY1Rlc3RDb21wbGV0ZXIpID49IDApIHtcbiAgICAvLyBSZXR1cm4gYW4gYXN5bmMgdGVzdCBtZXRob2QgdGhhdCByZXR1cm5zIGEgUHJvbWlzZSBpZiBBc3luY1Rlc3RDb21wbGV0ZXIgaXMgb25lIG9mIHRoZVxuICAgIC8vIGluamVjdGVkIHRva2Vucy5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgbGV0IGNvbXBsZXRlcjogQXN5bmNUZXN0Q29tcGxldGVyID0gdGVzdEluamVjdG9yLmdldChBc3luY1Rlc3RDb21wbGV0ZXIpO1xuICAgICAgdGVzdEluamVjdG9yLmV4ZWN1dGUodG9rZW5zLCBmbik7XG4gICAgICByZXR1cm4gY29tcGxldGVyLnByb21pc2U7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIFJldHVybiBhIHN5bmNocm9ub3VzIHRlc3QgbWV0aG9kIHdpdGggdGhlIGluamVjdGVkIHRva2Vucy5cbiAgICByZXR1cm4gKCkgPT4geyByZXR1cm4gZ2V0VGVzdEluamVjdG9yKCkuZXhlY3V0ZSh0b2tlbnMsIGZuKTsgfTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW5qZWN0U2V0dXBXcmFwcGVyIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcHJvdmlkZXJzOiAoKSA9PiBhbnkpIHt9XG5cbiAgcHJpdmF0ZSBfYWRkUHJvdmlkZXJzKCkge1xuICAgIHZhciBhZGRpdGlvbmFsUHJvdmlkZXJzID0gdGhpcy5fcHJvdmlkZXJzKCk7XG4gICAgaWYgKGFkZGl0aW9uYWxQcm92aWRlcnMubGVuZ3RoID4gMCkge1xuICAgICAgZ2V0VGVzdEluamVjdG9yKCkuYWRkUHJvdmlkZXJzKGFkZGl0aW9uYWxQcm92aWRlcnMpO1xuICAgIH1cbiAgfVxuXG4gIGluamVjdCh0b2tlbnM6IGFueVtdLCBmbjogRnVuY3Rpb24pOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHRoaXMuX2FkZFByb3ZpZGVycygpO1xuICAgICAgcmV0dXJuIGluamVjdF9pbXBsKHRva2VucywgZm4pKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBEZXByZWNhdGVkIHt1c2UgYXN5bmMod2l0aFByb3ZpZGVycygpLmluamVjdCgpKX0gKi9cbiAgaW5qZWN0QXN5bmModG9rZW5zOiBhbnlbXSwgZm46IEZ1bmN0aW9uKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLl9hZGRQcm92aWRlcnMoKTtcbiAgICAgIHJldHVybiBpbmplY3RBc3luY19pbXBsKHRva2VucywgZm4pKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3aXRoUHJvdmlkZXJzKHByb3ZpZGVyczogKCkgPT4gYW55KSB7XG4gIHJldHVybiBuZXcgSW5qZWN0U2V0dXBXcmFwcGVyKHByb3ZpZGVycyk7XG59XG5cbi8qKlxuICogQERlcHJlY2F0ZWQge3VzZSBhc3luYyhpbmplY3QoKSl9XG4gKlxuICogQWxsb3dzIGluamVjdGluZyBkZXBlbmRlbmNpZXMgaW4gYGJlZm9yZUVhY2goKWAgYW5kIGBpdCgpYC4gVGhlIHRlc3QgbXVzdCByZXR1cm5cbiAqIGEgcHJvbWlzZSB3aGljaCB3aWxsIHJlc29sdmUgd2hlbiBhbGwgYXN5bmNocm9ub3VzIGFjdGl2aXR5IGlzIGNvbXBsZXRlLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBgXG4gKiBpdCgnLi4uJywgaW5qZWN0QXN5bmMoW0FDbGFzc10sIChvYmplY3QpID0+IHtcbiAqICAgcmV0dXJuIG9iamVjdC5kb1NvbWV0aGluZygpLnRoZW4oKCkgPT4ge1xuICogICAgIGV4cGVjdCguLi4pO1xuICogICB9KTtcbiAqIH0pXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSB0b2tlbnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluamVjdEFzeW5jKHRva2VuczogYW55W10sIGZuOiBGdW5jdGlvbik6IEZ1bmN0aW9uIHtcbiAgcmV0dXJuIGFzeW5jKGluamVjdCh0b2tlbnMsIGZuKSk7XG59XG5cbi8vIFRoaXMgaXMgdG8gZW5zdXJlIGluamVjdChBc3luYykgd2l0aGluIEluamVjdFNldHVwV3JhcHBlciBkb2Vzbid0IGNhbGwgaXRzZWxmXG4vLyB3aGVuIHRyYW5zcGlsZWQgdG8gRGFydC5cbnZhciBpbmplY3RfaW1wbCA9IGluamVjdDtcbnZhciBpbmplY3RBc3luY19pbXBsID0gaW5qZWN0QXN5bmM7XG4iXX0=