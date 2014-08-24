Canvas = React.createClass
  render : ->
    `(
      <div id="canvasDiv">
        <div id="loadDiv">
          <div className="centerMe">
            <i className="icon-cogs icon-4x"></i>
            <br />
            <br />Rendering. Please wait...
            <br />
            <br />
            <button id="cancelButton" className="btn btn-large btn-danger">Cancel</button>
          </div>
        </div>
        <canvas id="mainCanvas" width="500" height="500"></canvas>
        <br />
        <div className="input-prepend">
          <label className="add-on" for="widthInput"><i className="fa fa-arrows-h"></i>
          </label>
          <input className="span1" type="text" id="widthInput" placeholder="Width" value="500" size="4" />
        </div>
        <div className="input-prepend">
          <label className="add-on" for="heightInput"><i className="fa fa-arrows-v"></i>
          </label>
          <input className="span1" type="text" id="heightInput" placeholder="Height" size="4" value="500" />
        </div>
        <button id="resizeCanvasButton" className="btn">Resize</button>
        <br />

        <div className="input-prepend">
          <label className="add-on" for="webworkers">HTML5 Webworkers?</label>
          <input type="checkbox" id="webworkers" checked />
        </div>
        <input id="numberOfWorkers" type="number" step="1" min="1" max="10" value="5" /> <br />
        <button className="btn btn-large btn-success" id="goButton"><i className="fa fa-cogs"></i> Render Image</button>
        <div id="timeDiv"></div>
      </div>
    )`
