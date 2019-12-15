import React from 'react';
import fileSaver from 'file-saver';
import jszip from 'jszip';
import './App.css';
import { Spritesheet } from './components/Spritesheet';
import { UploadBox } from './components/UploadBox';
import { Controls, ControlsState, defaultControlsState } from './components/Controls';
import { DownloadButton } from './components/DownloadButton';
import { getImageData, getBoundingBoxes } from './utils/image';

const urlParams = new URLSearchParams(window.location.search);
const SKIP_UPLOAD_STEP = urlParams.has('debug');

enum ScreenName {
  UPLOAD = 'UPLOAD',
  SELECTING = 'SELECTING'
}
interface AppState {
  curScreen: ScreenName;
  uploadedImg: HTMLImageElement | null;
  canvasWidth: number;
  canvasHeight: number;
  controlsState: ControlsState;
  selectedSprites: Array<number>;
}

class App extends React.Component<{}, AppState> {
  state: Readonly<AppState> = {
    curScreen: ScreenName.UPLOAD,
    uploadedImg: null,
    canvasWidth: 0,
    canvasHeight: 0,
    controlsState: defaultControlsState,
    selectedSprites: [] as Array<number>
  };

  componentDidMount() {
    // USE THIS TO SKIP UPLOADING IMAGE DURING TESTING
    if (SKIP_UPLOAD_STEP) {
      const img = new Image();
      img.onload = () => {
        this.onSpriteUploaded(img);
      };
      img.src = '/sprites/sprite.png';
    }
  }

  onSpriteUploaded = (uploadedImg: HTMLImageElement) => {
    const { height, width } = uploadedImg;
    this.setState({
      curScreen: ScreenName.SELECTING,
      uploadedImg,
      canvasWidth: width,
      canvasHeight: height
    });
  };

  onControlsChange = (controlsState: ControlsState) => {
    this.setState({ controlsState });
  };

  onSpriteClicked = (spriteIdx: number) => {
    const { selectedSprites } = this.state;

    if (selectedSprites.includes(spriteIdx)) {
      this.setState({
        selectedSprites: [...selectedSprites].filter(s => s !== spriteIdx)
      });
    } else {
      this.setState({
        selectedSprites: [...selectedSprites, spriteIdx]
      });
    }
  };

  onDownloadClick = () => {
    const { selectedSprites, canvasHeight, canvasWidth, uploadedImg, controlsState } = this.state;
    if (!uploadedImg) return;
    if (selectedSprites.length === 0) return;
    const imgData = getImageData(uploadedImg, canvasWidth, canvasHeight);
    const boundingBoxes = getBoundingBoxes(imgData, controlsState);
    const mainCanvas = document.createElement('canvas');
    const tmpCanvas = document.createElement('canvas');
    mainCanvas.width = canvasWidth;
    mainCanvas.height = canvasHeight;
    const mainCtx = mainCanvas.getContext('2d')!;
    const tmpCtx = tmpCanvas.getContext('2d')!;
    mainCtx.drawImage(uploadedImg, 0, 0);

    if (selectedSprites.length === 1) {
      const bb = boundingBoxes[selectedSprites[0]];
      const sprite = mainCtx.getImageData(bb.x, bb.y, bb.width, bb.height);
      tmpCanvas.height = bb.height;
      tmpCanvas.width = bb.width;
      tmpCtx.clearRect(0, 0, bb.width, bb.height);
      tmpCtx.putImageData(sprite, 0, 0);
      tmpCanvas.toBlob(blob => {
        if (!blob) return;
        fileSaver.saveAs(blob, 'sprite-1.png');
      });
    } else {
      const zip = new jszip();
      let completed = 0;
      selectedSprites.forEach((spriteIdx, idx) => {
        const bb = boundingBoxes[spriteIdx];
        const sprite = mainCtx.getImageData(bb.x, bb.y, bb.width, bb.height);
        tmpCanvas.height = bb.height;
        tmpCanvas.width = bb.width;
        tmpCtx.clearRect(0, 0, bb.width, bb.height);
        tmpCtx.putImageData(sprite, 0, 0);
        tmpCanvas.toBlob(blob => {
          if (!blob) return;
          zip.file(`sprite-${idx}.png`, blob);
          completed++;
          if (completed === selectedSprites.length) {
            zip.generateAsync({ type: 'blob' }).then(zipBlob => {
              fileSaver.saveAs(zipBlob, 'sprites.zip');
            });
          }
        });
      });
    }
  };

  render() {
    const { uploadedImg, curScreen, controlsState } = this.state;
    return (
      <div className="app">
        <h1 className="title">Spritesheet Tools</h1>
        {curScreen === ScreenName.SELECTING && (
          <Spritesheet
            img={uploadedImg}
            controlsState={controlsState}
            onSpriteClicked={this.onSpriteClicked}
            selectedSprites={this.state.selectedSprites}
          ></Spritesheet>
        )}
        {curScreen === ScreenName.SELECTING && (
          <Controls onControlsChange={this.onControlsChange}></Controls>
        )}

        {curScreen === ScreenName.UPLOAD && (
          <UploadBox onImageUploaded={this.onSpriteUploaded}></UploadBox>
        )}
        {curScreen === ScreenName.SELECTING && (
          <DownloadButton onDownloadClick={this.onDownloadClick}></DownloadButton>
        )}
      </div>
    );
  }
}

export default App;
