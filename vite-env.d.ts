/// <reference types="vite/client" />

type QuantizedMeshHeader = {
    boundingSphereCenterX: number;
    boundingSphereCenterY: number;
    boundingSphereCenterZ: number;
    centerX: number;
    centerY: number;
    centerZ: number;
    horizonOcclusionPointX: number;
    horizonOcclusionPointY: number;
    horizonOcclusionPointZ: number;
    maxHeight: number;
    minHeight: number;
};

type QuantizedMeshExtensions = {
    metadata: {
        geometricerror: number;
        surfacearea: number;
    };
    vertexNormals: Uint8Array;
    waterMask: ArrayBuffer;
};

type QuantizedMeshData = {
    header: QuantizedMeshHeader,
    vertexData: Uint16Array;
    triangleIndices: Uint16Array;
    northIndices: Uint16Array;
    eastIndices: Uint16Array;
    southIndices: Uint16Array;
    westIndices: Uint16Array;
    extensions?: QuantizedMeshExtensions;
};




