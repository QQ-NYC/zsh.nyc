import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
// 3D Visualization Engine for Terminal UI
export class Vector3D {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(other) {
        return new Vector3D(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    subtract(other) {
        return new Vector3D(this.x - other.x, this.y - other.y, this.z - other.z);
    }
    multiply(scalar) {
        return new Vector3D(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }
    cross(other) {
        return new Vector3D(this.y * other.z - this.z * other.y, this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    normalize() {
        const mag = this.magnitude();
        if (mag === 0)
            return new Vector3D(0, 0, 0);
        return new Vector3D(this.x / mag, this.y / mag, this.z / mag);
    }
    rotateX(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector3D(this.x, this.y * cos - this.z * sin, this.y * sin + this.z * cos);
    }
    rotateY(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector3D(this.x * cos + this.z * sin, this.y, -this.x * sin + this.z * cos);
    }
    rotateZ(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector3D(this.x * cos - this.y * sin, this.x * sin + this.y * cos, this.z);
    }
}
export class Matrix4x4 {
    constructor() {
        this.data = new Array(16).fill(0);
        this.identity();
    }
    identity() {
        this.data = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
        return this;
    }
    multiply(other) {
        const result = new Matrix4x4();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let sum = 0;
                for (let k = 0; k < 4; k++) {
                    sum += this.data[i * 4 + k] * other.data[k * 4 + j];
                }
                result.data[i * 4 + j] = sum;
            }
        }
        return result;
    }
    translate(x, y, z) {
        const translation = new Matrix4x4();
        translation.data[12] = x;
        translation.data[13] = y;
        translation.data[14] = z;
        return this.multiply(translation);
    }
    rotateX(angle) {
        const rotation = new Matrix4x4();
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        rotation.data[5] = cos;
        rotation.data[6] = -sin;
        rotation.data[9] = sin;
        rotation.data[10] = cos;
        return this.multiply(rotation);
    }
    rotateY(angle) {
        const rotation = new Matrix4x4();
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        rotation.data[0] = cos;
        rotation.data[2] = sin;
        rotation.data[8] = -sin;
        rotation.data[10] = cos;
        return this.multiply(rotation);
    }
    rotateZ(angle) {
        const rotation = new Matrix4x4();
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        rotation.data[0] = cos;
        rotation.data[1] = -sin;
        rotation.data[4] = sin;
        rotation.data[5] = cos;
        return this.multiply(rotation);
    }
    scale(x, y, z) {
        const scaling = new Matrix4x4();
        scaling.data[0] = x;
        scaling.data[5] = y;
        scaling.data[10] = z;
        return this.multiply(scaling);
    }
    transformPoint(point) {
        const x = point.x * this.data[0] + point.y * this.data[4] + point.z * this.data[8] + this.data[12];
        const y = point.x * this.data[1] + point.y * this.data[5] + point.z * this.data[9] + this.data[13];
        const z = point.x * this.data[2] + point.y * this.data[6] + point.z * this.data[10] + this.data[14];
        const w = point.x * this.data[3] + point.y * this.data[7] + point.z * this.data[11] + this.data[15];
        return new Vector3D(x / w, y / w, z / w);
    }
}
export class Mesh3D {
    constructor(vertices = [], faces = []) {
        this.vertices = [];
        this.faces = []; // Array of vertex indices
        this.transform = new Matrix4x4();
        this.vertices = vertices;
        this.faces = faces;
    }
    addVertex(vertex) {
        this.vertices.push(vertex);
    }
    addFace(face) {
        this.faces.push(face);
    }
    applyTransform() {
        this.vertices = this.vertices.map(vertex => this.transform.transformPoint(vertex));
        this.transform.identity();
    }
    getTransformedVertices() {
        return this.vertices.map(vertex => this.transform.transformPoint(vertex));
    }
}
export class Camera3D {
    constructor() {
        this.position = new Vector3D(0, 0, 0);
        this.target = new Vector3D(0, 0, 0);
        this.up = new Vector3D(0, 1, 0);
        this.fov = Math.PI / 4; // 45 degrees
        this.aspectRatio = 1;
        this.near = 0.1;
        this.far = 1000;
    }
    getViewMatrix() {
        const forward = this.target.subtract(this.position).normalize();
        const right = forward.cross(this.up).normalize();
        const up = right.cross(forward);
        const viewMatrix = new Matrix4x4();
        viewMatrix.data = [
            right.x, up.x, -forward.x, 0,
            right.y, up.y, -forward.y, 0,
            right.z, up.z, -forward.z, 0,
            -right.dot(this.position), -up.dot(this.position), forward.dot(this.position), 1
        ];
        return viewMatrix;
    }
    getProjectionMatrix() {
        const projection = new Matrix4x4();
        const f = 1 / Math.tan(this.fov / 2);
        const range = 1 / (this.near - this.far);
        projection.data = [
            f / this.aspectRatio, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (this.near + this.far) * range, -1,
            0, 0, this.near * this.far * range * 2, 0
        ];
        return projection;
    }
}
export class Renderer3D {
    constructor(width = 80, height = 24) {
        this.width = width;
        this.height = height;
        this.buffer = Array(height).fill(null).map(() => Array(width).fill(' '));
    }
    clear() {
        this.buffer = Array(this.height).fill(null).map(() => Array(this.width).fill(' '));
    }
    project3DTo2D(point, camera) {
        // Apply view and projection matrices
        const viewMatrix = camera.getViewMatrix();
        const projectionMatrix = camera.getProjectionMatrix();
        let transformed = viewMatrix.transformPoint(point);
        transformed = projectionMatrix.transformPoint(transformed);
        // Check if point is within view frustum
        if (transformed.z < 0 || transformed.z > 1)
            return null;
        // Convert to screen coordinates
        const screenX = Math.round((transformed.x + 1) * this.width / 2);
        const screenY = Math.round((1 - transformed.y) * this.height / 2);
        // Check bounds
        if (screenX < 0 || screenX >= this.width || screenY < 0 || screenY >= this.height) {
            return null;
        }
        return { x: screenX, y: screenY };
    }
    drawPoint(x, y, char = '•') {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.buffer[y][x] = char;
        }
    }
    drawLine(x1, y1, x2, y2, char = '─') {
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = x1 < x2 ? 1 : -1;
        const sy = y1 < y2 ? 1 : -1;
        let err = dx - dy;
        let x = x1;
        let y = y1;
        while (true) {
            this.drawPoint(x, y, char);
            if (x === x2 && y === y2)
                break;
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }
    }
    renderMesh(mesh, camera, char = '█') {
        const transformedVertices = mesh.getTransformedVertices();
        // Draw faces
        mesh.faces.forEach(face => {
            if (face.length < 3)
                return;
            const projectedPoints = [];
            for (const vertexIndex of face) {
                const vertex = transformedVertices[vertexIndex];
                const projected = this.project3DTo2D(vertex, camera);
                if (projected) {
                    projectedPoints.push(projected);
                }
            }
            // Draw edges of the face
            for (let i = 0; i < projectedPoints.length; i++) {
                const current = projectedPoints[i];
                const next = projectedPoints[(i + 1) % projectedPoints.length];
                this.drawLine(current.x, current.y, next.x, next.y, char);
            }
        });
    }
    render() {
        return this.buffer.map(row => row.join('')).join('\n');
    }
}
export class Scene3D {
    constructor() {
        this.meshes = [];
        this.camera = new Camera3D();
        this.lights = [];
    }
    addMesh(mesh) {
        this.meshes.push(mesh);
    }
    removeMesh(mesh) {
        const index = this.meshes.indexOf(mesh);
        if (index > -1) {
            this.meshes.splice(index, 1);
        }
    }
    render(renderer) {
        renderer.clear();
        this.meshes.forEach(mesh => {
            renderer.renderMesh(mesh, this.camera);
        });
        return renderer.render();
    }
}
// Utility functions for creating common 3D shapes
export class MeshFactory {
    static createCube(size = 1) {
        const halfSize = size / 2;
        const vertices = [
            new Vector3D(-halfSize, -halfSize, -halfSize), // 0
            new Vector3D(halfSize, -halfSize, -halfSize), // 1
            new Vector3D(halfSize, halfSize, -halfSize), // 2
            new Vector3D(-halfSize, halfSize, -halfSize), // 3
            new Vector3D(-halfSize, -halfSize, halfSize), // 4
            new Vector3D(halfSize, -halfSize, halfSize), // 5
            new Vector3D(halfSize, halfSize, halfSize), // 6
            new Vector3D(-halfSize, halfSize, halfSize) // 7
        ];
        const faces = [
            [0, 1, 2, 3], // front
            [5, 4, 7, 6], // back
            [4, 0, 3, 7], // left
            [1, 5, 6, 2], // right
            [3, 2, 6, 7], // top
            [4, 5, 1, 0] // bottom
        ];
        return new Mesh3D(vertices, faces);
    }
    static createSphere(radius = 1, segments = 8) {
        const vertices = [];
        const faces = [];
        // Generate vertices
        for (let i = 0; i <= segments; i++) {
            const theta = (i * Math.PI) / segments;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);
            for (let j = 0; j <= segments; j++) {
                const phi = (j * 2 * Math.PI) / segments;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);
                const x = radius * sinTheta * cosPhi;
                const y = radius * cosTheta;
                const z = radius * sinTheta * sinPhi;
                vertices.push(new Vector3D(x, y, z));
            }
        }
        // Generate faces
        for (let i = 0; i < segments; i++) {
            for (let j = 0; j < segments; j++) {
                const first = i * (segments + 1) + j;
                const second = first + segments + 1;
                faces.push([first, second, first + 1]);
                faces.push([second, second + 1, first + 1]);
            }
        }
        return new Mesh3D(vertices, faces);
    }
    static createCylinder(radius = 1, height = 2, segments = 8) {
        const vertices = [];
        const faces = [];
        const halfHeight = height / 2;
        // Generate vertices for top and bottom circles
        for (let i = 0; i <= segments; i++) {
            const angle = (i * 2 * Math.PI) / segments;
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);
            // Bottom circle
            vertices.push(new Vector3D(x, -halfHeight, z));
            // Top circle
            vertices.push(new Vector3D(x, halfHeight, z));
        }
        // Generate side faces
        for (let i = 0; i < segments; i++) {
            const bottom1 = i * 2;
            const top1 = bottom1 + 1;
            const bottom2 = (i + 1) * 2;
            const top2 = bottom2 + 1;
            faces.push([bottom1, bottom2, top2, top1]);
        }
        return new Mesh3D(vertices, faces);
    }
}
// React Component for 3D Visualization
export const ThreeDVisualizer = ({ scene, width = 80, height = 24, autoRotate = false }) => {
    const [frame, setFrame] = useState(0);
    const [renderer] = useState(() => new Renderer3D(width, height));
    useEffect(() => {
        if (!autoRotate)
            return;
        const interval = setInterval(() => {
            setFrame(prev => prev + 1);
        }, 100);
        return () => clearInterval(interval);
    }, [autoRotate]);
    // Apply rotation for animation
    if (autoRotate) {
        scene.meshes.forEach(mesh => {
            mesh.transform = mesh.transform.rotateY(frame * 0.02);
        });
    }
    const renderedScene = scene.render(renderer);
    return (_jsxs(Box, { flexDirection: "column", children: [_jsx(Text, { bold: true, color: "blue", children: "3D Visualization" }), _jsx(Box, { borderStyle: "single", padding: 1, children: _jsx(Text, { children: renderedScene }) }), _jsxs(Text, { dimColor: true, children: ["Frame: ", frame, " | Meshes: ", scene.meshes.length] })] }));
};
//# sourceMappingURL=three-d-engine.js.map