export type CubeIdType = "1" | "2"
export type CubeType = {
    id: CubeIdType;
    color: "violet" | "seal" | "orange";
    position: {
        x: number;
        y: number;
    }
}