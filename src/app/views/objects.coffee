Objects = React.createClass
  render : ->
    `(
      <div className="propertyDiv" id="objectsDiv">
        <h2> <i className="fa fa-picture-o"></i> Objects </h2>

        <div className="input-append">
          <select id="selectObject">
            <option value="Node">Node</option>
            <option value="Sphere">Sphere</option>
            <option value="Box">Box</option>
            <option value="Plane">Plane</option>
            <option value="Triangle">Triangle</option>
          </select>
          <button id="addObjectButton" className="btn">Add</button>
        </div>
        <div id="objects"></div>
      </div>
    )`

