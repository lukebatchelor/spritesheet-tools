import React from 'react';
import { ControlsState, ViewType } from './Controls';
import {
  getSpriteBoundingBoxes,
  BoundingBox,
  getGridBoundingBoxes,
  getImageData,
  getBoundingBoxes
} from '../utils/image';

const defaultCanvasSize = { height: 200, width: 400 };

interface SpritesheetProps {
  img: HTMLImageElement | null;
  controlsState: ControlsState;
  onSpriteClicked: (spriteIdx: number) => void;
  selectedSprites: Array<number>;
}

class Spritesheet extends React.Component<SpritesheetProps> {
  canvasRef = React.createRef<HTMLCanvasElement>();

  componentDidMount() {
    this.updateCanvas();
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  updateCanvas = () => {
    const canvas = this.canvasRef.current!;
    const { width, height } = canvas;
    const ctx = canvas.getContext('2d')!;
    const { img } = this.props;
    if (!img) return;
    const imgData = getImageData(img, width, height);

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0);

    const boundingBoxes = getBoundingBoxes(imgData, this.props.controlsState);
    this.drawBoundingBoxes(boundingBoxes, ctx);
  };

  drawBoundingBoxes = (boundingBoxes: Array<BoundingBox>, ctx: CanvasRenderingContext2D) => {
    const { selectedSprites } = this.props;
    ctx.strokeStyle = 'rgba(255,0,0,0.5)';
    ctx.fillStyle = 'rgba(0,0, 130, 0.3)';
    boundingBoxes.forEach((bb: BoundingBox, idx: number) => {
      if (selectedSprites.includes(idx)) {
        ctx.fillRect(bb.x, bb.y, bb.width, bb.height);
      }
      ctx.strokeRect(bb.x, bb.y, bb.width, bb.height);
    });
  };

  onCanvasClick = (e: React.MouseEvent) => {
    const { img, controlsState } = this.props;
    if (!img) return;
    const canvas = e.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const imgData = getImageData(img, rect.width, rect.height);
    const boundingBoxes = getBoundingBoxes(imgData, controlsState);
    const boundingBoxIdx = boundingBoxes.findIndex(bb => {
      if (x < bb.x || y < bb.y || x > bb.x + bb.width || y > bb.y + bb.height) return false;
      return true;
    });

    if (boundingBoxIdx !== -1) {
      this.props.onSpriteClicked(boundingBoxIdx);
    }
  };

  render() {
    const { img } = this.props;
    const { height, width } = img || defaultCanvasSize;
    return (
      <div className="canvas-container">
        <canvas
          ref={this.canvasRef}
          className="sprite-canvas"
          height={height}
          width={width}
          onClick={this.onCanvasClick}
        ></canvas>
      </div>
    );
  }
}

export { Spritesheet };
