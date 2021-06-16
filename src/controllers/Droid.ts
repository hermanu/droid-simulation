interface ICoordinates {
    x: number;
    y: number;
}


interface IScan {
    coordinates: ICoordinates;
    enemies: IEnemies;
    allies?: number;
}

interface IEnemies {
    type: string;
    number: number;
}


enum ProtocolList {
    "closest-enemies", "furthest-enemies", "assist-allies", "avoid-crossfire", "prioritize-mech", "avoid-mech"
}

type IProtocol = {
    [key in ProtocolList]: string;
};
interface IDroid {
    nextPosition(protocol: string[], scan: IScan[]): ICoordinates;
}

class Droid implements IDroid {

    nextPosition(protocols: any, scan: IScan[]): any {
        protocols.reverse()
        protocols.forEach((protocol: string) => {
            const protocolName: string = this.camelize(protocol).replace("-", "")
            //  Can't use >> scan = this[protocolName](scan) idk why yet
            // TODO: class protocol?
            switch (protocol) {
                case "avoid-mech":
                    scan = this.avoidMech(scan)
                    break;
                case "closest-enemies":
                    scan = this.closestEnemies(scan)
                    break;
                case "furthest-enemies":
                    scan = this.furthestEnemies(scan)
                    break;
                case "assist-allies":
                    scan = this.assistAllies(scan)
                    break;
                case "avoid-crossfire":
                    scan = this.avoidCrossFire(scan)
                    break;
                case "prioritize-mech":
                    scan = this.prioritizeMech(scan)
                    break;
                default:
                    break;
            }
        })
        return { x: scan[0].coordinates.x, y: scan[0].coordinates.y }

    }


    avoidMech(scan: IScan[]): IScan[] {
        return scan.filter((value: IScan) => value.enemies.type !== "mech")
    }

    prioritizeMech(scan: IScan[]): IScan[] {
        return scan.filter((value: IScan) => value.enemies.type === "mech")
    }

    closestEnemies(scan: IScan[]): IScan[] {
        const result = scan.reduce((previousValue: IScan, currentValue: IScan,) => {
            const previusDistance = Math.sqrt(Math.pow(previousValue.coordinates.y, 2) + Math.pow(previousValue.coordinates.x, 2))
            const currentDistance = Math.sqrt(Math.pow(currentValue.coordinates.y, 2) + Math.pow(currentValue.coordinates.x, 2))
            return previusDistance < currentDistance ? previousValue : currentValue
        })
        return [result]
    }

    furthestEnemies(scan: IScan[]): IScan[] {
        const result = scan.reduce((previousValue: any, currentValue: any,) => {
            const previusDistance = Math.sqrt(Math.pow(previousValue.coordinates.y, 2) + Math.pow(previousValue.coordinates.x, 2))
            const currentDistance = Math.sqrt(Math.pow(currentValue.coordinates.y, 2) + Math.pow(currentValue.coordinates.x, 2))
            return previusDistance > currentDistance || currentDistance > 100 ? previousValue : currentValue
        })
        return [result]
    }

    assistAllies(scan: IScan[]): IScan[] {
        return scan.filter((currentValue: IScan) => currentValue.allies !== undefined)
    }

    avoidCrossFire(scan: IScan[]): IScan[] {
        return scan.filter((currentValue: IScan) => currentValue.allies === undefined)
    }

    // Borrowed
    camelize = (str: string) => {
        return str.replace(/(?:^\w|\[A-Z\]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }

}

export default Droid



