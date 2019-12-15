import React from 'react';

interface UploadBoxProps {
  onImageUploaded: (img: HTMLImageElement) => void;
}

class UploadBox extends React.Component<UploadBoxProps> {
  static defaultProps: UploadBoxProps = {
    onImageUploaded: () => {}
  };

  fileInputRef = React.createRef<HTMLInputElement>();

  onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files!;
    if (files.length !== 1) {
      alert('Error: Expected exactly 1 file');
      return;
    }
    if (!files[0].type.startsWith('image/')) {
      alert('Error: Expected an image file');
      return;
    }
    const image = files[0];
    const fileReader = new FileReader();
    fileReader.onload = (e: ProgressEvent) => {
      const img = new Image();
      img.onload = () => {
        this.props.onImageUploaded(img);
      };
      img.src = fileReader.result as string;
    };
    fileReader.readAsDataURL(image);
  };

  uploadClicked = () => {
    // We'll use the button click to trigger a click on the hidden file input field
    this.fileInputRef.current!.click();
  };

  render() {
    const buttonStyle = { marginTop: '10px' };
    return (
      <div>
        <button
          type="button"
          className="nice-button"
          onClick={this.uploadClicked}
          style={buttonStyle}
        >
          Upload
        </button>
        <input
          type="file"
          id="imageUpload"
          style={{ display: 'none' }}
          ref={this.fileInputRef}
          onChange={this.onFileChange}
        />
      </div>
    );
  }
}

export { UploadBox };
