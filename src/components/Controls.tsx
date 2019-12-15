import React from 'react';

export enum ViewType {
  BOUNDING = 'BOUNDING',
  GRID = 'GRID'
}

interface ControlsProps {
  onControlsChange: (controlsState: ControlsState) => void;
}

export interface ControlsState {
  selectedView: ViewType;
  minBoundingPixels: number;
  gridWidth: number;
  gridHeight: number;
}

export const defaultControlsState = {
  selectedView: ViewType.GRID,
  minBoundingPixels: 16,
  gridWidth: 32,
  gridHeight: 32
};

class Controls extends React.Component<ControlsProps, ControlsState> {
  state = defaultControlsState;

  onViewTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value as ViewType;
    this.setState({ selectedView: selected }, () => this.props.onControlsChange(this.state));
  };

  onMinBoundingSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ minBoundingPixels: Number(e.target.value) }, () =>
      this.props.onControlsChange(this.state)
    );
  };
  onGridWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ gridWidth: Number(e.target.value) }, () =>
      this.props.onControlsChange(this.state)
    );
  };
  onGridHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ gridHeight: Number(e.target.value) }, () =>
      this.props.onControlsChange(this.state)
    );
  };

  render() {
    const { selectedView, minBoundingPixels, gridWidth, gridHeight } = this.state;
    const gridViewSelected = selectedView === ViewType.GRID;
    const boundingViewSelected = selectedView === ViewType.BOUNDING;
    return (
      <div className="view-controls">
        <div className="view-group">
          <input
            type="radio"
            value="GRID"
            name="view-type"
            id="grid"
            checked={gridViewSelected}
            onChange={this.onViewTypeChange}
          />
          <label htmlFor="grid">Grid</label>

          <input
            type="radio"
            value="BOUNDING"
            name="view-type"
            id="bounding"
            checked={boundingViewSelected}
            onChange={this.onViewTypeChange}
          />
          <label htmlFor="bounding">Bounding Box</label>
        </div>
        <div className="secondary-controls-group">
          {gridViewSelected && (
            <>
              <label htmlFor="gridWidth" style={{ marginRight: '1em' }}>
                Grid Width
              </label>
              <input
                type="number"
                id="gridWdith"
                min={16}
                onChange={this.onGridWidthChange}
                value={gridWidth}
              />

              <label htmlFor="gridHeight" style={{ margin: '0 1em' }}>
                Grid Height
              </label>
              <input
                type="number"
                id="gridHeight"
                min={16}
                onChange={this.onGridHeightChange}
                value={gridHeight}
              />
            </>
          )}
          {boundingViewSelected && (
            <>
              <label htmlFor="minBoundingSize" style={{ marginRight: '1em' }}>
                Minimum pixels
              </label>
              <input
                type="number"
                id="minBoundingSize"
                onChange={this.onMinBoundingSizeChange}
                value={minBoundingPixels}
                style={{}}
              />
            </>
          )}
        </div>
      </div>
    );
  }
}

export { Controls };
