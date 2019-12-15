import React from 'react';
import { getSpriteBoundingBoxes } from '../utils/image';

const defaultCanvasSize = { height: 200, width: 400 };

interface SpritesheetProps {
  img: HTMLImageElement | null;
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
    const { height, width } = canvas;
    const { img } = this.props;

    if (!img) return;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, width, height);

    const boundingBoxes = getSpriteBoundingBoxes(imgData, {});
    this.drawBoundingBoxes(boundingBoxes, ctx);
  };

  drawBoundingBoxes = (boundingBoxes: any, ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#ff0000';
    boundingBoxes.forEach((bb: any) => {
      ctx.strokeRect(bb.minX, bb.minY, bb.maxX - bb.minX, bb.maxY - bb.minY);
    });
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
        ></canvas>
      </div>
    );
  }
}

export { Spritesheet };
