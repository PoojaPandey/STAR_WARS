import React from 'react';

function PlanetList(props) {
  const { planetList, showPlanetInfo } = props;

  return (
    <div>
      <ul>
        {planetList.map(planet => (
          <li key={planet.name} onClick={() => showPlanetInfo(planet)}>
            {/* <div> */}
            <h1>{planet.name}</h1>
            {/* </div> */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlanetList;
