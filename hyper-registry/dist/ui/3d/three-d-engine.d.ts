import React from 'react';
export declare class Vector3D {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    add(other: Vector3D): Vector3D;
    subtract(other: Vector3D): Vector3D;
    multiply(scalar: number): Vector3D;
    dot(other: Vector3D): number;
    cross(other: Vector3D): Vector3D;
    magnitude(): number;
    normalize(): Vector3D;
    rotateX(angle: number): Vector3D;
    rotateY(angle: number): Vector3D;
    rotateZ(angle: number): Vector3D;
}
export declare class Matrix4x4 {
    data: number[];
    constructor();
    identity(): Matrix4x4;
    multiply(other: Matrix4x4): Matrix4x4;
    translate(x: number, y: number, z: number): Matrix4x4;
    rotateX(angle: number): Matrix4x4;
    rotateY(angle: number): Matrix4x4;
    rotateZ(angle: number): Matrix4x4;
    scale(x: number, y: number, z: number): Matrix4x4;
    transformPoint(point: Vector3D): Vector3D;
}
export declare class Mesh3D {
    vertices: Vector3D[];
    faces: number[][];
    transform: Matrix4x4;
    constructor(vertices?: Vector3D[], faces?: number[][]);
    addVertex(vertex: Vector3D): void;
    addFace(face: number[]): void;
    applyTransform(): void;
    getTransformedVertices(): Vector3D[];
}
export declare class Camera3D {
    position: Vector3D;
    target: Vector3D;
    up: Vector3D;
    fov: number;
    aspectRatio: number;
    near: number;
    far: number;
    getViewMatrix(): Matrix4x4;
    getProjectionMatrix(): Matrix4x4;
}
export declare class Renderer3D {
    private width;
    private height;
    private buffer;
    constructor(width?: number, height?: number);
    clear(): void;
    project3DTo2D(point: Vector3D, camera: Camera3D): {
        x: number;
        y: number;
    } | null;
    drawPoint(x: number, y: number, char?: string): void;
    drawLine(x1: number, y1: number, x2: number, y2: number, char?: string): void;
    renderMesh(mesh: Mesh3D, camera: Camera3D, char?: string): void;
    render(): string;
}
export declare class Scene3D {
    meshes: Mesh3D[];
    camera: Camera3D;
    lights: Vector3D[];
    addMesh(mesh: Mesh3D): void;
    removeMesh(mesh: Mesh3D): void;
    render(renderer: Renderer3D): string;
}
export declare class MeshFactory {
    static createCube(size?: number): Mesh3D;
    static createSphere(radius?: number, segments?: number): Mesh3D;
    static createCylinder(radius?: number, height?: number, segments?: number): Mesh3D;
}
export declare const ThreeDVisualizer: React.FC<{
    scene: Scene3D;
    width?: number;
    height?: number;
    autoRotate?: boolean;
}>;
//# sourceMappingURL=three-d-engine.d.ts.map