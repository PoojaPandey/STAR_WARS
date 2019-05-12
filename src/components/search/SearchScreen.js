import React, { Component } from 'react';
import * as Constant from '../../utils/Constant';
import Webservice from '../../services/Service';
import PlanetList from '../plane_list/PlanetList';
import PlanetInfo from '../planet_info/PlanetInfo';
import '../planet_info/PlanetInfo.css';
import * as LocalStorage from '../../shared/LocalStorage';
import { Navbar } from 'react-bootstrap';
import '../../components/search/SearchScreen.css';

class SearchSreen extends Component {
  state = {
    query: '',
    results: [],
    wholePlanetList: [],
    page: 1,
    scrolling: false,
    nextPageUrl: '',
    showPopup: false,
    planetInfo: {},
    timeCount: 60,
    isTimerRunning: false,
    apiCallCount: 0,
    searchDisable: false
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }
  tick() {
    if (this.state.timeCount === 0 && this.state.searchDisable === true) {
      this.setState({ timeCount: 60, searchDisable: false, apiCallCount: 0 });
      alert('You can continue your search');
    }
    this.setState({ timeCount: this.state.timeCount - 1 });
  }
  startTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(this.tick.bind(this), 1000);
  }
  stopTimer() {
    clearInterval(this.timer);
  }

  componentWillMount() {
    this.scrollListner = window.addEventListener('scroll', (e) => {
      this.handelScroll(e);
      console.log('handelScroll added');
    });
    this.getWholePlanetList();
  }

  handelScroll = () => {
    console.log('handelScroll', this.state.nextPageUrl);
    const { scrolling } = this.state;
    if (scrolling) return;
    const lastLi = document.querySelector('div > div:last-child');
    const lastLiOffSet = lastLi.offsetTop + lastLi.clientHeight;
    const pageOffset = window.pageYOffset + window.innerHeight;
    var bottomOffset = 0;
    if (this.state.nextPageUrl === null) return;
    if (pageOffset > lastLiOffSet - bottomOffset) this.getWholePlanetList();
  };

  getWholePlanetList() {
    this.setState({
      scrolling: true,
      page: this.state.page + 1
    });
    const url = Constant.BASE_URL + `planets/?page=${this.state.page}`;
    Webservice({
      url: url,
      successCall: (data) => {
        this.setState({
          wholePlanetList: [...this.state.wholePlanetList, ...data.results],
          results: [...this.state.wholePlanetList, ...data.results],
          nextPageUrl: data.next,
          scrolling: false
        });
        console.log('this.state.wholePlanetList', this.state.wholePlanetList);
      }
    });
  }

  //   getSerachPlanet = url => {
  //     Webservice({
  //       url: url,
  //       successCall: data => {
  //         this.setState({
  //           results: data.results,
  //           nextPageUrl: data.next
  //         });
  //       }
  //     });
  //   };

  validateForSearch() {
    const { timeCount, apiCallCount } = this.state;
    console.log(LocalStorage.getUser(), Constant.PRIME_USER);
    if (LocalStorage.getUser() === Constant.PRIME_USER) {
      if (timeCount > 0 && apiCallCount < 5) {
        return true;
      } else {
        this.stopTimer();
        this.setState(
          {
            timeCount: 10,
            searchDisable: true
          },
          () => this.startTimer()
        );

        alert(`Your Search limit exceeded please wait for ${10} seconds.`);
        return false;
      }
    }
    return true;
  }

  handleInputChange = (e) => {
    if (!this.state.isTimerRunning) {
      this.setState({ isTimerRunning: true });
      this.startTimer();
    }
    this.setState(
      {
        query: e.target.value,
        isTimerRunning: true,
        apiCallCount: this.state.apiCallCount + 1
      },
      () => {
        if (this.validateForSearch()) {
          if (this.state.query) {
            const url = Constant.PLANET + this.state.query;
            Webservice({
              url: url,
              successCall: (data) => {
                this.setState({
                  results: data.results,
                  nextPageUrl: data.next,
                  page: 1
                });
                console.log('handleInputChange');
              }
            });
          } else {
            this.setState({
              results: this.state.wholePlanetList,
              page: 1
            });
          }
        }
      }
    );
  };

  showPlanetInfo = (info, isHide) => {
    this.setState({
      planetInfo: info,
      showPopup: true
    });
  };

  hidePlanetInfo = () => {
    console.log('hidePlanetInfo');
    this.setState({
      showPopup: false
    });
  };

  componentDidCatch(error, info) {
    console.log(error, info);
  }
  logoutClicked() {
    if (window.confirm('Are you sure you want to Logout?')) {
      LocalStorage.setUser('');
      // browserHistory.push("/");
    }
  }

  render() {
    const popup = this.state.showPopup ? (
      <PlanetInfo value={this.state.planetInfo} hidePlanetInfo={this.hidePlanetInfo} />
    ) : null;
    return (
      <div className="SearchScreenBody Scroll-lock">
        <nav className="navbar NavBarColor">
          <h1 className="Welcome ">Wecome {LocalStorage.getUser()}</h1>
          <form className="form-inline">
            <button
              className="btn btn-outline-warning my-2 my-sm-0  btn-sm"
              type="submit"
              onClick={() => this.logoutClicked()}
            >
              Logout
            </button>
          </form>
        </nav>

        {popup}
        <div className="SearchScreenBase">
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            onChange={this.handleInputChange}
            disabled={this.state.searchDisable}
          />
          <PlanetList
            planetList={this.state.results}
            showPlanetInfo={this.showPlanetInfo}
          />
        </div>
      </div>
    );
  }
}
export default SearchSreen;
