interface IRoad {
    id: number;
    color: string;
    description: string;
}

export class Road implements IRoad {
    constructor(public id: number, public slat: number, public slng: number, public elat: number, public elng: number, public distance: number, public color: string, public description: string) {
        this.slat = slat;
        this.slng = slng;
        this.elat = elat;
        this.elng = elng;
        this.distance = distance;
    }
}