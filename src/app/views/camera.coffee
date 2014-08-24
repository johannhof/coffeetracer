CameraDiv = React.createClass
  render : ->
    `(
      <div className="propertyDiv" id="cameraDiv">
        <h2><i className="fa fa-camera-retro"></i> Camera</h2>
        <select id="selectCamera">
          <option value="PerspectiveCamera">Perspective Camera</option>
          <option value="OrthographicCamera">Orthographic Camera</option>
        </select>
        <br />e =
        <input type="text" id="camera_e_x" value="5" size="2" />
        <input type="text" id="camera_e_y" value="5" size="2" />
        <input type="text" id="camera_e_z" value="5" size="2" />
        <br />g =
        <input type="text" id="camera_g_x" value="-1" size="2" />
        <input type="text" id="camera_g_y" value="-1" size="2" />
        <input type="text" id="camera_g_z" value="-1" size="2" />
        <br />t =
        <input type="text" id="camera_t_x" value="0" size="2" />
        <input type="text" id="camera_t_y" value="1" size="2" />
        <input type="text" id="camera_t_z" value="0" size="2" />

        <div id="cameraSpec">
          <label for="camera_alpha">alpha = PI /</label>
          <input type="text" id="camera_alpha" value="4" size="2" />
        </div>
      </div>
    )`

