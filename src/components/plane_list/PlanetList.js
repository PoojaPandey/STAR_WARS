import React, { useState } from 'react';
import '../plane_list/PlanetList.css';
import update from 'immutability-helper';

function getPopulationPercent(props) {
  console.log('population', props.population);

  const percent = (props.population / props.max) * 100;
  console.log('percent', percent);
  return `${percent.toFixed(2)}`;
}

function setPopulationDefault(props) {
  console.log('list', props.list);

  var newData = props.list.map(el =>
    el.population === 'unknown' ? '0' : el.population
  );
  return newData;
}
function PlanetList(props) {
  const { planetList, showPlanetInfo } = props;
  const populationList = setPopulationDefault({ list: planetList });
  const max = populationList.reduce(
    (prev, current) => (parseInt(prev) > parseInt(current) ? prev : current),
    1
  );
  return (
    <div>
      {planetList.map((planet, index) => (
        <div
          className="PlanetList "
          key={planet.name}
          onClick={() => showPlanetInfo(planet)}
        >
          <h4 className="TextPadding">
            {planet.name}
            <span className="badge badge-warning float-right ">
              {getRelativePercent(index)}
            </span>
          </h4>
          <div className="progress">
            <div
              className="progress-bar bg-warning"
              role="progressbar"
              style={{
                width: getRelativePercent(index)
              }}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          {/* </div> */}
        </div>
      ))}
    </div>
  );

  function getRelativePercent(index) {
    return `${getPopulationPercent({
      population: parseInt(populationList[index]),
      max: parseInt(max)
    })}%`;
  }
}

export default PlanetList;
