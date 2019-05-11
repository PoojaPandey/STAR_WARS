import React from 'react';
import './PlanetInfo.css';

const createImageURL = name => {
  try {
    return require('../../assets/images/' + name + '.png');
  } catch (err) {
    return '../../assets/images/' + name + '.png';
  }
};
function PlanetInfo(props) {
  const planet = props.value;
  return (
    <div className="PlanetInfoBase">
      <div className="InnerBase">
        {/* <h1 style={{ color: 'white' }}>{planet.name}</h1> */}
        <button className="Button" onClick={props.hidePlanetInfo}>
          X
        </button>

        <div className="Row">
          <div className="PlanetImage">
            <img
              src={createImageURL(planet.name)}
              alt={planet.name + '.png'}
              className="Image"
            />
            <h1>{planet.name}</h1>
          </div>
          <div className="PlanetDetail">
            {console.log('planet.name', planet.name)}
            <h1 style={{ color: 'white' }}>{planet.name}</h1>
            <h2>{planet.rotation_period}</h2>
            <h1>{planet.orbital_period}</h1>
            <h1>{planet.diameter}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default Warper(PlanetInfo);

export default PlanetInfo;
