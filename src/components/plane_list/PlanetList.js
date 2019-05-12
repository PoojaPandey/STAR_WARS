import React from 'react';
import '../plane_list/PlanetList.css';
import * as Constant from '../../utils/Constant';

/**
 *
 * @param {*} props Function to find percentage of
 * population passed as props.
 */
function getPopulationPercent(props) {
  console.log('population', props.population);
  const percent = (props.population / props.max) * Constant.CONST_HUNDRED;
  console.log('percent', percent);
  return `${percent.toFixed(Constant.DECIMAL_PLACES)}`;
}

/**
 *
 * @param {*} props Function to det populations.
 */
function setPopulationDefault(props) {
  console.log('list', props.list);
  var newData = props.list.map((el) =>
    el.population === Constant.TEXT_UNKOWN ? Constant.TEXT_ZERO : el.population
  );
  return newData;
}

/**
 *
 * @param {*} props Function to return list of Planet.
 */
function PlanetList(props) {
  console.log('PlanetList');
  const { planetList, showPlanetInfo } = props;
  const populationList = setPopulationDefault({ list: planetList });
  const max = populationList.reduce(
    (prev, current) => (parseInt(prev) > parseInt(current) ? prev : current),
    1
  );
  return (
    <div className="container h-100">
      {planetList.map((planet, index) => (
        <div className="PlanetList " key={planet.name} onClick={() => showPlanetInfo(planet)}>
          <h4 className="TextPadding">
            {planet.name}
            <span className="badge badge-danger float-right ">{getRelativePercent(index)}</span>
          </h4>
          <div className="progress">
            <div
              className="progress-bar progress-bar-striped bg-danger"
              role="progressbar"
              style={{
                width: getRelativePercent(index)
              }}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>
      ))}
    </div>
  );

  /**
   *
   * @param {*} index Function to find relative percentage
   * to each other.
   */
  function getRelativePercent(index) {
    return `${getPopulationPercent({
      population: parseInt(populationList[index]),
      max: parseInt(max)
    })}%`;
  }
}

export default PlanetList;
