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
        <u>
          <i>
            <h1>Planet Inforamtion</h1>
          </i>
        </u>
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
            {Object.keys(planet).map((item, index) => (
              <h6 key={item}>
                {item}:{planet[item]}
              </h6>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// export default Warper(PlanetInfo);

export default PlanetInfo;
