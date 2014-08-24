Raytracer = React.createClass
  render : ->
    `(
      <div>
        <Canvas />
        <WorldDiv />
      </div>
    )`

WorldDiv = React.createClass
  getInitialState : ->
    if @props.cam
      {cam : @props.cam}
    else
      {cam : {}}
  render : ->
    `(
      <div>
        <div className="propertyDiv" id="worldDiv">
          <h2><i className="fa fa-globe"></i> World</h2>
          Background:
          <input type="text" className="redInput" size="1" value="0" />
          <input type="text" className="greenInput" size="1" value="0" />
          <input type="text" className="blueInput" size="1" value="0" />
          <br />Index of Refraction:
          <input type="text" className="indexOfRefraction" value="1" size="2" />
        </div>
        <Lights />
        <CameraDiv cam={this.state.cam} />
        <Objects />
      </div>
    )`
