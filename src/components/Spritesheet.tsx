import React from 'react';
import { ControlsState, ViewType } from './Controls';
import {
  getSpriteBoundingBoxes,
  BoundingBox,
  getGridBoundingBoxes,
  getImageData,
  getBoundingBoxes
} from '../utils/image';

interface SpritesheetProps {
  img: HTMLImageElement | null;
  canvasWidth: number;
  canvasHeight: number;
  controlsState: ControlsState;
  onSpriteClicked: (spriteIdx: number) => void;
  selectedSprites: Array<number>;
}

interface SpritesheetState {
  boundingBoxes: Array<BoundingBox>;
}

class Spritesheet extends React.Component<SpritesheetProps, SpritesheetState> {
  canvasRef = React.createRef<HTMLCanvasElement>();

  state: SpritesheetState = {
    boundingBoxes: []
  };

  componentDidMount() {
    this.getBoundingBoxes();
    this.updateCanvas();
  }

  componentDidUpdate(prevProps: SpritesheetProps) {
    if (prevProps.controlsState !== this.props.controlsState) {
      this.getBoundingBoxes();
    }
    this.updateCanvas();
  }

  getBoundingBoxes = () => {
    const { img } = this.props;
    const { canvasWidth, canvasHeight } = this.props;

    if (!img) return;
    const imgData = getImageData(img, canvasWidth, canvasHeight);
    const boundingBoxes = getBoundingBoxes(imgData, this.props.controlsState);
    this.setState({
      boundingBoxes
    });
  };

  updateCanvas = () => {
    const canvas = this.canvasRef.current!;
    const { canvasWidth, canvasHeight } = this.props;
    const ctx = canvas.getContext('2d')!;
    const { img } = this.props;
    if (!img) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

    const { boundingBoxes } = this.state;
    this.drawBoundingBoxes(boundingBoxes, ctx);
  };

  drawBoundingBoxes = (boundingBoxes: Array<BoundingBox>, ctx: CanvasRenderingContext2D) => {
    const { selectedSprites, img, canvasWidth, canvasHeight } = this.props;
    const scaleX = canvasWidth / img!.width;
    const scaleY = canvasHeight / img!.height;
    ctx.strokeStyle = 'rgba(255,0,0,0.5)';
    ctx.fillStyle = 'rgba(0,0, 130, 0.3)';
    boundingBoxes.forEach((bb: BoundingBox, idx: number) => {
      if (selectedSprites.includes(idx)) {
        ctx.fillRect(bb.x * scaleX, bb.y * scaleY, bb.width * scaleX, bb.height * scaleY);
      }
      ctx.strokeRect(bb.x * scaleX, bb.y * scaleY, bb.width * scaleX, bb.height * scaleY);
    });
  };

  onCanvasClick = (e: React.MouseEvent) => {
    const { controlsState, img, canvasWidth, canvasHeight } = this.props;
    const scaleX = canvasWidth / img!.width;
    const scaleY = canvasHeight / img!.height;
    if (!img) return;
    const canvas = e.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scaleX;
    const y = (e.clientY - rect.top) / scaleY;
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
    const { img, canvasWidth, canvasHeight } = this.props;
    return (
      <div className="canvas-container">
        <canvas
          ref={this.canvasRef}
          className="sprite-canvas"
          width={canvasWidth}
          height={canvasHeight}
          onClick={this.onCanvasClick}
        ></canvas>
      </div>
    );
  }
}

export { Spritesheet };
