export class LocationBased {
    constructor(scene: any, camera: any, options?: {});
    _scene: any;
    _camera: any;
    _proj: SphMercProjection;
    _eventHandlers: {};
    _lastCoords: {
        latitude: any;
        longitude: any;
    };
    _gpsMinDistance: number;
    _gpsMinAccuracy: number;
    _maximumAge: number;
    _watchPositionId: number;
    setProjection(proj: any): void;
    setGpsOptions(options?: {}): void;
    startGps(maximumAge?: number): boolean;
    stopGps(): boolean;
    fakeGps(lon: any, lat: any, elev?: any, acc?: number): void;
    lonLatToWorldCoords(lon: any, lat: any): number[];
    add(object: any, lon: any, lat: any, elev: any): void;
    setWorldPosition(object: any, lon: any, lat: any, elev: any): void;
    setElevation(elev: any): void;
    on(eventName: any, eventHandler: any): void;
    _gpsReceived(position: any): void;
    /**
     * Calculate haversine distance between two lat/lon pairs.
     *
     * Taken from original A-Frame components
     */
    _haversineDist(src: any, dest: any): number;
}
import { SphMercProjection } from "./sphmerc-projection.js";
//# sourceMappingURL=location-based.d.ts.map