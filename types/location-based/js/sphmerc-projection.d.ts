export class SphMercProjection {
    EARTH: number;
    HALF_EARTH: number;
    project(lon: any, lat: any): number[];
    unproject(projected: any): number[];
    lonToSphMerc(lon: any): number;
    latToSphMerc(lat: any): number;
    sphMercToLon(x: any): number;
    sphMercToLat(y: any): number;
    getID(): string;
}
//# sourceMappingURL=sphmerc-projection.d.ts.map