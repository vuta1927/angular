interface IRoad {
    id: number;
    color: string;
    metadata: any;
}

export class Road implements IRoad {
    constructor(public id: number, public paths: Coordinate[], public distance: number, public color: string, public metadata: any) {
        this.paths = paths;
        this.distance = distance;
    }
}

interface ICoordinate{
    lat: number;
    lng: number;
}

export class Coordinate implements ICoordinate{
    constructor(public lat: number, public lng: number){}
}