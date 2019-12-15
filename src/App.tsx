import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Spritesheet } from './components/Spritesheet';
import { UploadBox } from './components/UploadBox';

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
}

class App extends React.Component<{}, AppState> {
  state = {
    curScreen: ScreenName.UPLOAD,
    uploadedImg: null,
    canvasWidth: 0,
    canvasHeight: 0
  };

  componentDidMount() {
    // USE THIS TO SKIP UPLOADING IMAGE DURING TESTING
    if (SKIP_UPLOAD_STEP) {
      const img = new Image();
      img.onload = () => {
        this.setState({
          curScreen: ScreenName.SELECTING,
          uploadedImg: img
        });
      };
      img.src = '/sprites/dbz.png';
    }
  }

  onSpriteUploaded = (uploadedImg: HTMLImageElement) => {
    const { height, width } = uploadedImg;
    this.setState({
      uploadedImg,
      canvasWidth: width,
      canvasHeight: height
    });
  };

  render() {
    const { uploadedImg, curScreen } = this.state;
    return (
      <div className="app">
        <h1 className="title">Spritesheet Tools</h1>
        {curScreen === ScreenName.SELECTING && <Spritesheet img={uploadedImg}></Spritesheet>}

        <UploadBox onImageUploaded={this.onSpriteUploaded}></UploadBox>
      </div>
    );
  }
}

export default App;
