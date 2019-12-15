import React from 'react';

interface DownloadButtonState {}
interface DownloadButtonProps {
  onDownloadClick: () => void;
}

class DownloadButton extends React.Component<DownloadButtonProps, DownloadButtonState> {
  render() {
    return (
      <div>
        <button type="button" className="nice-button" onClick={this.props.onDownloadClick}>
          Download Sprite(s)
        </button>
      </div>
    );
  }
}

export { DownloadButton };
