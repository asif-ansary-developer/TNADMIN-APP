import { __decorate, __extends } from "tslib";
import { Injectable } from '@angular/core';
import { AwesomeCordovaNativePlugin, cordova } from '@awesome-cordova-plugins/core';
import * as i0 from "@angular/core";
var LocationAccuracy = /** @class */ (function (_super) {
    __extends(LocationAccuracy, _super);
    function LocationAccuracy() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Convenience constant
         *
         * @type {number}
         */
        _this.REQUEST_PRIORITY_NO_POWER = 0;
        /**
         * Convenience constant
         *
         * @type {number}
         */
        _this.REQUEST_PRIORITY_LOW_POWER = 1;
        /**
         * Convenience constant
         *
         * @type {number}
         */
        _this.REQUEST_PRIORITY_BALANCED_POWER_ACCURACY = 2;
        /**
         * Convenience constant
         *
         * @type {number}
         */
        _this.REQUEST_PRIORITY_HIGH_ACCURACY = 3;
        /**
         * Convenience constant
         *
         * @type {number}
         */
        _this.SUCCESS_SETTINGS_SATISFIED = 0;
        /**
         * Convenience constant
         *
         * @type {number}
         */
        _this.SUCCESS_USER_AGREED = 1;
        /**
         * Convenience constant
         *
         * @type {number}
         */
        _this.ERROR_ALREADY_REQUESTING = -1;
        /**
         * Convenience constant
         *
         * @type {number}
         */
        _this.ERROR_INVALID_ACTION = 0;
        /**
         * Convenience constant
         *
         * @type {number}
         */
        _this.ERROR_INVALID_ACCURACY = 1;
        /**
         * Convenience constant
         *
         * @type {number}
         */
        _this.ERROR_EXCEPTION = 1;
        /**
         * Convenience constant
         *
         * @type {number}
         */
        _this.ERROR_CANNOT_CHANGE_ACCURACY = 3;
        /**
         * Convenience constant
         *
         * @type {number}
         */
        _this.ERROR_USER_DISAGREED = 4;
        /**
         * Convenience constant
         *
         * @type {number}
         */
        _this.ERROR_GOOGLE_API_CONNECTION_FAILED = 4;
        return _this;
    }
    LocationAccuracy.prototype.canRequest = function () { return cordova(this, "canRequest", {}, arguments); };
    LocationAccuracy.prototype.isRequesting = function () { return cordova(this, "isRequesting", {}, arguments); };
    LocationAccuracy.prototype.request = function (accuracy) { return cordova(this, "request", { "callbackOrder": "reverse" }, arguments); };
    LocationAccuracy.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: LocationAccuracy, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
    LocationAccuracy.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: LocationAccuracy });
    LocationAccuracy.pluginName = "LocationAccuracy";
    LocationAccuracy.plugin = "cordova-plugin-request-location-accuracy";
    LocationAccuracy.pluginRef = "cordova.plugins.locationAccuracy";
    LocationAccuracy.repo = "https://github.com/dpa99c/cordova-plugin-request-location-accuracy";
    LocationAccuracy.platforms = ["Android", "iOS"];
    LocationAccuracy = __decorate([], LocationAccuracy);
    return LocationAccuracy;
}(AwesomeCordovaNativePlugin));
export { LocationAccuracy };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: LocationAccuracy, decorators: [{
            type: Injectable
        }], propDecorators: { canRequest: [], isRequesting: [], request: [] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvQGF3ZXNvbWUtY29yZG92YS1wbHVnaW5zL3BsdWdpbnMvbG9jYXRpb24tYWNjdXJhY3kvbmd4L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sdUNBQStDLE1BQU0sK0JBQStCLENBQUM7OztJQW9DdEQsb0NBQTBCOzs7UUFDOUQ7Ozs7V0FJRztRQUNILCtCQUF5QixHQUFHLENBQUMsQ0FBQztRQUM5Qjs7OztXQUlHO1FBQ0gsZ0NBQTBCLEdBQUcsQ0FBQyxDQUFDO1FBQy9COzs7O1dBSUc7UUFDSCw4Q0FBd0MsR0FBRyxDQUFDLENBQUM7UUFDN0M7Ozs7V0FJRztRQUNILG9DQUE4QixHQUFHLENBQUMsQ0FBQztRQUNuQzs7OztXQUlHO1FBQ0gsZ0NBQTBCLEdBQUcsQ0FBQyxDQUFDO1FBQy9COzs7O1dBSUc7UUFDSCx5QkFBbUIsR0FBRyxDQUFDLENBQUM7UUFDeEI7Ozs7V0FJRztRQUNILDhCQUF3QixHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzlCOzs7O1dBSUc7UUFDSCwwQkFBb0IsR0FBRyxDQUFDLENBQUM7UUFDekI7Ozs7V0FJRztRQUNILDRCQUFzQixHQUFHLENBQUMsQ0FBQztRQUMzQjs7OztXQUlHO1FBQ0gscUJBQWUsR0FBRyxDQUFDLENBQUM7UUFDcEI7Ozs7V0FJRztRQUNILGtDQUE0QixHQUFHLENBQUMsQ0FBQztRQUNqQzs7OztXQUlHO1FBQ0gsMEJBQW9CLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCOzs7O1dBSUc7UUFDSCx3Q0FBa0MsR0FBRyxDQUFDLENBQUM7OztJQVF2QyxxQ0FBVTtJQVVWLHVDQUFZO0lBV1osa0NBQU8sYUFBQyxRQUFnQjtrSEEzR2IsZ0JBQWdCO3NIQUFoQixnQkFBZ0I7Ozs7OztJQUFoQixnQkFBZ0Isa0JBQWhCLGdCQUFnQjsyQkFyQzdCO0VBcUNzQywwQkFBMEI7U0FBbkQsZ0JBQWdCOzRGQUFoQixnQkFBZ0I7a0JBRDVCLFVBQVU7OEJBdUZULFVBQVUsTUFVVixZQUFZLE1BV1osT0FBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvcmRvdmEsIEF3ZXNvbWVDb3Jkb3ZhTmF0aXZlUGx1Z2luLCBQbHVnaW4gfSBmcm9tICdAYXdlc29tZS1jb3Jkb3ZhLXBsdWdpbnMvY29yZSc7XG5cbi8qKlxuICogQG5hbWUgTG9jYXRpb24gQWNjdXJhY3lcbiAqIEBkZXNjcmlwdGlvblxuICogVGhpcyBDb3Jkb3ZhL1Bob25lZ2FwIHBsdWdpbiBmb3IgQW5kcm9pZCBhbmQgaU9TIHRvIHJlcXVlc3QgZW5hYmxpbmcvY2hhbmdpbmcgb2YgTG9jYXRpb24gU2VydmljZXMgYnkgdHJpZ2dlcmluZyBhIG5hdGl2ZSBkaWFsb2cgZnJvbSB3aXRoaW4gdGhlIGFwcCwgYXZvaWRpbmcgdGhlIG5lZWQgZm9yIHRoZSB1c2VyIHRvIGxlYXZlIHlvdXIgYXBwIHRvIGNoYW5nZSBsb2NhdGlvbiBzZXR0aW5ncyBtYW51YWxseS5cbiAqIEB1c2FnZVxuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0IHsgTG9jYXRpb25BY2N1cmFjeSB9IGZyb20gJ0Bhd2Vzb21lLWNvcmRvdmEtcGx1Z2lucy9sb2NhdGlvbi1hY2N1cmFjeS9uZ3gnO1xuICpcbiAqIGNvbnN0cnVjdG9yKHByaXZhdGUgbG9jYXRpb25BY2N1cmFjeTogTG9jYXRpb25BY2N1cmFjeSkgeyB9XG4gKlxuICogLi4uXG4gKlxuICogdGhpcy5sb2NhdGlvbkFjY3VyYWN5LmNhblJlcXVlc3QoKS50aGVuKChjYW5SZXF1ZXN0OiBib29sZWFuKSA9PiB7XG4gKlxuICogICBpZihjYW5SZXF1ZXN0KSB7XG4gKiAgICAgLy8gdGhlIGFjY3VyYWN5IG9wdGlvbiB3aWxsIGJlIGlnbm9yZWQgYnkgaU9TXG4gKiAgICAgdGhpcy5sb2NhdGlvbkFjY3VyYWN5LnJlcXVlc3QodGhpcy5sb2NhdGlvbkFjY3VyYWN5LlJFUVVFU1RfUFJJT1JJVFlfSElHSF9BQ0NVUkFDWSkudGhlbihcbiAqICAgICAgICgpID0+IGNvbnNvbGUubG9nKCdSZXF1ZXN0IHN1Y2Nlc3NmdWwnKSxcbiAqICAgICAgIGVycm9yID0+IGNvbnNvbGUubG9nKCdFcnJvciByZXF1ZXN0aW5nIGxvY2F0aW9uIHBlcm1pc3Npb25zJywgZXJyb3IpXG4gKiAgICAgKTtcbiAqICAgfVxuICpcbiAqIH0pO1xuICpcbiAqIGBgYFxuICovXG5AUGx1Z2luKHtcbiAgcGx1Z2luTmFtZTogJ0xvY2F0aW9uQWNjdXJhY3knLFxuICBwbHVnaW46ICdjb3Jkb3ZhLXBsdWdpbi1yZXF1ZXN0LWxvY2F0aW9uLWFjY3VyYWN5JyxcbiAgcGx1Z2luUmVmOiAnY29yZG92YS5wbHVnaW5zLmxvY2F0aW9uQWNjdXJhY3knLFxuICByZXBvOiAnaHR0cHM6Ly9naXRodWIuY29tL2RwYTk5Yy9jb3Jkb3ZhLXBsdWdpbi1yZXF1ZXN0LWxvY2F0aW9uLWFjY3VyYWN5JyxcbiAgcGxhdGZvcm1zOiBbJ0FuZHJvaWQnLCAnaU9TJ10sXG59KVxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIExvY2F0aW9uQWNjdXJhY3kgZXh0ZW5kcyBBd2Vzb21lQ29yZG92YU5hdGl2ZVBsdWdpbiB7XG4gIC8qKlxuICAgKiBDb252ZW5pZW5jZSBjb25zdGFudFxuICAgKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgUkVRVUVTVF9QUklPUklUWV9OT19QT1dFUiA9IDA7XG4gIC8qKlxuICAgKiBDb252ZW5pZW5jZSBjb25zdGFudFxuICAgKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgUkVRVUVTVF9QUklPUklUWV9MT1dfUE9XRVIgPSAxO1xuICAvKipcbiAgICogQ29udmVuaWVuY2UgY29uc3RhbnRcbiAgICpcbiAgICogQHR5cGUge251bWJlcn1cbiAgICovXG4gIFJFUVVFU1RfUFJJT1JJVFlfQkFMQU5DRURfUE9XRVJfQUNDVVJBQ1kgPSAyO1xuICAvKipcbiAgICogQ29udmVuaWVuY2UgY29uc3RhbnRcbiAgICpcbiAgICogQHR5cGUge251bWJlcn1cbiAgICovXG4gIFJFUVVFU1RfUFJJT1JJVFlfSElHSF9BQ0NVUkFDWSA9IDM7XG4gIC8qKlxuICAgKiBDb252ZW5pZW5jZSBjb25zdGFudFxuICAgKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgU1VDQ0VTU19TRVRUSU5HU19TQVRJU0ZJRUQgPSAwO1xuICAvKipcbiAgICogQ29udmVuaWVuY2UgY29uc3RhbnRcbiAgICpcbiAgICogQHR5cGUge251bWJlcn1cbiAgICovXG4gIFNVQ0NFU1NfVVNFUl9BR1JFRUQgPSAxO1xuICAvKipcbiAgICogQ29udmVuaWVuY2UgY29uc3RhbnRcbiAgICpcbiAgICogQHR5cGUge251bWJlcn1cbiAgICovXG4gIEVSUk9SX0FMUkVBRFlfUkVRVUVTVElORyA9IC0xO1xuICAvKipcbiAgICogQ29udmVuaWVuY2UgY29uc3RhbnRcbiAgICpcbiAgICogQHR5cGUge251bWJlcn1cbiAgICovXG4gIEVSUk9SX0lOVkFMSURfQUNUSU9OID0gMDtcbiAgLyoqXG4gICAqIENvbnZlbmllbmNlIGNvbnN0YW50XG4gICAqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqL1xuICBFUlJPUl9JTlZBTElEX0FDQ1VSQUNZID0gMTtcbiAgLyoqXG4gICAqIENvbnZlbmllbmNlIGNvbnN0YW50XG4gICAqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqL1xuICBFUlJPUl9FWENFUFRJT04gPSAxO1xuICAvKipcbiAgICogQ29udmVuaWVuY2UgY29uc3RhbnRcbiAgICpcbiAgICogQHR5cGUge251bWJlcn1cbiAgICovXG4gIEVSUk9SX0NBTk5PVF9DSEFOR0VfQUNDVVJBQ1kgPSAzO1xuICAvKipcbiAgICogQ29udmVuaWVuY2UgY29uc3RhbnRcbiAgICpcbiAgICogQHR5cGUge251bWJlcn1cbiAgICovXG4gIEVSUk9SX1VTRVJfRElTQUdSRUVEID0gNDtcbiAgLyoqXG4gICAqIENvbnZlbmllbmNlIGNvbnN0YW50XG4gICAqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqL1xuICBFUlJPUl9HT09HTEVfQVBJX0NPTk5FQ1RJT05fRkFJTEVEID0gNDtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIHlvdSBjYW4gcmVxdWVzdCBhY2N1cmF0ZSBsb2NhdGlvblxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxib29sZWFuPn0gUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvdmxlcyB3aXRoIGEgYm9vbGVhbiB0aGF0IGluZGljYXRlcyBpZiB5b3UgY2FuIHJlcXVlc3QgYWNjdXJhdGUgbG9jYXRpb25cbiAgICovXG4gIEBDb3Jkb3ZhKClcbiAgY2FuUmVxdWVzdCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIGEgcmVxdWVzdCBpcyBjdXJyZW50bHkgaW4gcHJvZ3Jlc3NcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59IFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCBhIGJvb2xlYW4gdGhhdCBpbmRpY2F0ZXMgaWYgYSByZXF1ZXN0IGlzIGN1cnJlbnRseSBpbiBwcm9ncmVzc1xuICAgKi9cbiAgQENvcmRvdmEoKVxuICBpc1JlcXVlc3RpbmcoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3RzIGFjY3VyYXRlIGxvY2F0aW9uXG4gICAqXG4gICAqIEBwYXJhbSBhY2N1cmFjeSB7bnVtYmVyfSBBY2N1cmFjeSwgZnJvbSAwIHRvIDQuIFlvdSBjYW4gdXNlIHRoZSBzdGF0aWMgcHJvcGVydGllcyBvZiB0aGlzIGNsYXNzIHRoYXQgc3RhcnQgd2l0aCBSRVFVRVNUX1BSSU9SSVRZX1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fSBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIG9uIHN1Y2Nlc3MgYW5kIHJlamVjdHMgaWYgYW4gZXJyb3Igb2NjdXJyZWRcbiAgICovXG4gIEBDb3Jkb3ZhKHsgY2FsbGJhY2tPcmRlcjogJ3JldmVyc2UnIH0pXG4gIHJlcXVlc3QoYWNjdXJhY3k6IG51bWJlcik6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuO1xuICB9XG59XG4iXX0=