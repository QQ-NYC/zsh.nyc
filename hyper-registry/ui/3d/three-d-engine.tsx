import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';

// 3D Visualization Engine for Terminal UI
export class Vector3D {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}

  add(other: Vector3D): Vector3D {
    return new Vector3D(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  subtract(other: Vector3D): Vector3D {
    return new Vector3D(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  multiply(scalar: number): Vector3D {
    return new Vector3D(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  dot(other: Vector3D): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  cross(other: Vector3D): Vector3D {
    return new Vector3D(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize(): Vector3D {
    const mag = this.magnitude();
    if (mag === 0) return new Vector3D(0, 0, 0);
    return new Vector3D(this.x / mag, this.y / mag, this.z / mag);
  }

  rotateX(angle: number): Vector3D {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector3D(
      this.x,
      this.y * cos - this.z * sin,
      this.y * sin + this.z * cos
    );
  }

  rotateY(angle: number): Vector3D {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector3D(
      this.x * cos + this.z * sin,
      this.y,
      -this.x * sin + this.z * cos
    );
  }

  rotateZ(angle: number): Vector3D {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector3D(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos,
      this.z
    );
  }
}

export class Matrix4x4 {
  public data: number[] = new Array(16).fill(0);

  constructor() {
    this.identity();
  }

  identity(): Matrix4x4 {
    this.data = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
    return this;
  }

  multiply(other: Matrix4x4): Matrix4x4 {
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

  translate(x: number, y: number, z: number): Matrix4x4 {
    const translation = new Matrix4x4();
    translation.data[12] = x;
    translation.data[13] = y;
    translation.data[14] = z;
    return this.multiply(translation);
  }

  rotateX(angle: number): Matrix4x4 {
    const rotation = new Matrix4x4();
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    rotation.data[5] = cos;
    rotation.data[6] = -sin;
    rotation.data[9] = sin;
    rotation.data[10] = cos;
    return this.multiply(rotation);
  }

  rotateY(angle: number): Matrix4x4 {
    const rotation = new Matrix4x4();
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    rotation.data[0] = cos;
    rotation.data[2] = sin;
    rotation.data[8] = -sin;
    rotation.data[10] = cos;
    return this.multiply(rotation);
  }

  rotateZ(angle: number): Matrix4x4 {
    const rotation = new Matrix4x4();
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    rotation.data[0] = cos;
    rotation.data[1] = -sin;
    rotation.data[4] = sin;
    rotation.data[5] = cos;
    return this.multiply(rotation);
  }

  scale(x: number, y: number, z: number): Matrix4x4 {
    const scaling = new Matrix4x4();
    scaling.data[0] = x;
    scaling.data[5] = y;
    scaling.data[10] = z;
    return this.multiply(scaling);
  }

  transformPoint(point: Vector3D): Vector3D {
    const x = point.x * this.data[0] + point.y * this.data[4] + point.z * this.data[8] + this.data[12];
    const y = point.x * this.data[1] + point.y * this.data[5] + point.z * this.data[9] + this.data[13];
    const z = point.x * this.data[2] + point.y * this.data[6] + point.z * this.data[10] + this.data[14];
    const w = point.x * this.data[3] + point.y * this.data[7] + point.z * this.data[11] + this.data[15];

    return new Vector3D(x / w, y / w, z / w);
  }
}

export class Mesh3D {
  public vertices: Vector3D[] = [];
  public faces: number[][] = []; // Array of vertex indices
  public transform: Matrix4x4 = new Matrix4x4();

  constructor(vertices: Vector3D[] = [], faces: number[][] = []) {
    this.vertices = vertices;
    this.faces = faces;
  }

  addVertex(vertex: Vector3D): void {
    this.vertices.push(vertex);
  }

  addFace(face: number[]): void {
    this.faces.push(face);
  }

  applyTransform(): void {
    this.vertices = this.vertices.map(vertex => this.transform.transformPoint(vertex));
    this.transform.identity();
  }

  getTransformedVertices(): Vector3D[] {
    return this.vertices.map(vertex => this.transform.transformPoint(vertex));
  }
}

export class Camera3D {
  public position: Vector3D = new Vector3D(0, 0, 0);
  public target: Vector3D = new Vector3D(0, 0, 0);
  public up: Vector3D = new Vector3D(0, 1, 0);
  public fov: number = Math.PI / 4; // 45 degrees
  public aspectRatio: number = 1;
  public near: number = 0.1;
  public far: number = 1000;

  getViewMatrix(): Matrix4x4 {
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

  getProjectionMatrix(): Matrix4x4 {
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
  private width: number;
  private height: number;
  private buffer: string[][];

  constructor(width: number = 80, height: number = 24) {
    this.width = width;
    this.height = height;
    this.buffer = Array(height).fill(null).map(() => Array(width).fill(' '));
  }

  clear(): void {
    this.buffer = Array(this.height).fill(null).map(() => Array(this.width).fill(' '));
  }

  project3DTo2D(point: Vector3D, camera: Camera3D): { x: number; y: number } | null {
    // Apply view and projection matrices
    const viewMatrix = camera.getViewMatrix();
    const projectionMatrix = camera.getProjectionMatrix();

    let transformed = viewMatrix.transformPoint(point);
    transformed = projectionMatrix.transformPoint(transformed);

    // Check if point is within view frustum
    if (transformed.z < 0 || transformed.z > 1) return null;

    // Convert to screen coordinates
    const screenX = Math.round((transformed.x + 1) * this.width / 2);
    const screenY = Math.round((1 - transformed.y) * this.height / 2);

    // Check bounds
    if (screenX < 0 || screenX >= this.width || screenY < 0 || screenY >= this.height) {
      return null;
    }

    return { x: screenX, y: screenY };
  }

  drawPoint(x: number, y: number, char: string = '•'): void {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.buffer[y][x] = char;
    }
  }

  drawLine(x1: number, y1: number, x2: number, y2: number, char: string = '─'): void {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    let x = x1;
    let y = y1;

    while (true) {
      this.drawPoint(x, y, char);

      if (x === x2 && y === y2) break;

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

  renderMesh(mesh: Mesh3D, camera: Camera3D, char: string = '█'): void {
    const transformedVertices = mesh.getTransformedVertices();

    // Draw faces
    mesh.faces.forEach(face => {
      if (face.length < 3) return;

      const projectedPoints: { x: number; y: number }[] = [];

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

  render(): string {
    return this.buffer.map(row => row.join('')).join('\n');
  }
}

export class Scene3D {
  public meshes: Mesh3D[] = [];
  public camera: Camera3D = new Camera3D();
  public lights: Vector3D[] = [];

  addMesh(mesh: Mesh3D): void {
    this.meshes.push(mesh);
  }

  removeMesh(mesh: Mesh3D): void {
    const index = this.meshes.indexOf(mesh);
    if (index > -1) {
      this.meshes.splice(index, 1);
    }
  }

  render(renderer: Renderer3D): string {
    renderer.clear();

    this.meshes.forEach(mesh => {
      renderer.renderMesh(mesh, this.camera);
    });

    return renderer.render();
  }
}

// Utility functions for creating common 3D shapes
export class MeshFactory {
  static createCube(size: number = 1): Mesh3D {
    const halfSize = size / 2;
    const vertices = [
      new Vector3D(-halfSize, -halfSize, -halfSize), // 0
      new Vector3D(halfSize, -halfSize, -halfSize),  // 1
      new Vector3D(halfSize, halfSize, -halfSize),   // 2
      new Vector3D(-halfSize, halfSize, -halfSize),  // 3
      new Vector3D(-halfSize, -halfSize, halfSize),  // 4
      new Vector3D(halfSize, -halfSize, halfSize),   // 5
      new Vector3D(halfSize, halfSize, halfSize),    // 6
      new Vector3D(-halfSize, halfSize, halfSize)    // 7
    ];

    const faces = [
      [0, 1, 2, 3], // front
      [5, 4, 7, 6], // back
      [4, 0, 3, 7], // left
      [1, 5, 6, 2], // right
      [3, 2, 6, 7], // top
      [4, 5, 1, 0]  // bottom
    ];

    return new Mesh3D(vertices, faces);
  }

  static createSphere(radius: number = 1, segments: number = 8): Mesh3D {
    const vertices: Vector3D[] = [];
    const faces: number[][] = [];

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

  static createCylinder(radius: number = 1, height: number = 2, segments: number = 8): Mesh3D {
    const vertices: Vector3D[] = [];
    const faces: number[][] = [];

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
export const ThreeDVisualizer: React.FC<{
  scene: Scene3D;
  width?: number;
  height?: number;
  autoRotate?: boolean;
}> = ({ scene, width = 80, height = 24, autoRotate = false }) => {
  const [frame, setFrame] = useState(0);
  const [renderer] = useState(() => new Renderer3D(width, height));

  useEffect(() => {
    if (!autoRotate) return;

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

  return (
    <Box flexDirection="column">
      <Text bold color="blue">3D Visualization</Text>
      <Box borderStyle="single" padding={1}>
        <Text>{renderedScene}</Text>
      </Box>
      <Text dimColor>Frame: {frame} | Meshes: {scene.meshes.length}</Text>
    </Box>
  );
};