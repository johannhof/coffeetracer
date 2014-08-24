Lights = React.createClass
  render : ->
    `(
      <div className="propertyDiv" id="lightsDiv">
      <h2>
        <i className="fa fa-lightbulb-o"></i> Lights
      </h2>

      <div className="input-append">
        <select id="selectLight">
          <option value="PointLight">PointLight</option>
          <option value="SpotLight">SpotLight</option>
          <option value="DirectionalLight">Directional Light</option>
        </select>
        <button id="addLightButton" className="btn">Add</button>
      </div>
      <div id="ambientLight">
        <b>Ambient:</b>
        <input type="text" className="redInput" size="1" value="0.3" />
        <input type="text" className="greenInput" size="1" value="0.3" />
        <input type="text" className="blueInput" size="1" value="0.3" />
      </div>
    </div>
    )`

