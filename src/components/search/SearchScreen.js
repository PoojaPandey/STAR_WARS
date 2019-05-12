import React, { Component } from 'react';
import * as Constant from '../../utils/Constant';
import Webservice from '../../services/Service';
import PlanetList from '../plane_list/PlanetList';
import PlanetInfo from '../planet_info/PlanetInfo';
import '../planet_info/PlanetInfo.css';
import * as LocalStorage from '../../shared/LocalStorage';
import { Navbar } from 'react-bootstrap';
import '../../components/search/SearchScreen.css';
import * as ErrorConstants from '../../utils/ErrorConstants';
import * as Constants from '../../utils/Constant';
import * as Sentry from '@sentry/browser';

/**
 * Search Screen component which enables to
 * serach for specified planet.
 */
class SearchSreen extends Component {
  //** State of components */
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
    searchDisable: false,
    loading: false
  };

  /**
   * Method to check for time interval
   * and restricting the further search
   * for specified interval of time.
   */
  tick() {
    if (this.state.timeCount === 0 && this.state.searchDisable === true) {
      this.setState({ timeCount: 60, searchDisable: false, apiCallCount: 0 });
      alert(ErrorConstants.ERROR_START_SEARCH);
    }
    this.setState({ timeCount: this.state.timeCount - 1 });
  }

  /**
   * Method to start the timer.
   */
  startTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(this.tick.bind(this), Constants.MILI_SEC);
  }

  /**
   * Method to stop timer.
   */
  stopTimer() {
    clearInterval(this.timer);
  }

  /**
   * Lifecycle hook for the component
   * Doing the clear the interval here.
   */
  componentWillMount() {
    clearInterval(this.timer);
    this.scrollListner = window.addEventListener('scroll', (e) => {
      this.handelScroll(e);
      console.log('handelScroll added');
    });
    this.getWholePlanetList();
  }

  /**
   * Method to handle the scroll over the page.
   */
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

  /**
   * Method to get list of whole planet
   * from the API.
   */
  getWholePlanetList() {
    this.setState({
      loading: this.state.page === 1 ? true : false,
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
          scrolling: false,
          loading: false
        });
        console.log('this.state.wholePlanetList', this.state.wholePlanetList);
      }
    });
  }

  /**
   * Method to validate the search made.
   */
  validateForSearch() {
    const { timeCount, apiCallCount } = this.state;
    console.log(LocalStorage.getUser(), Constant.PRIME_USER);
    if (LocalStorage.getUser() === Constant.PRIME_USER) {
      if (timeCount > Constant.ZERO && apiCallCount < Constant.MAX_API_CALL) {
        return true;
      } else {
        this.stopTimer();
        this.setState(
          {
            timeCount: Constant.MAX_API_HIT_COUNT,
            searchDisable: true
          },
          () => this.startTimer()
        );

        alert(ErrorConstants.MESSAGE_LIMIT_EXCEED);
        return false;
      }
    }
    return true;
  }

  /**
   * Method of handle Input change while
   * making search for from API.
   */
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
          this.setState({
            loading: true
          });
          if (this.state.query) {
            const url = Constant.PLANET + this.state.query;
            console.log('url', url);
            Webservice({
              url: url,
              successCall: (data) => {
                this.setState({
                  results: data.results,
                  nextPageUrl: data.next,
                  page: 1,
                  loading: false
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

  /**
   * Method to show information about the
   * planet and settiing state accordingly.
   */
  showPlanetInfo = (info, isHide) => {
    this.setState({
      planetInfo: info,
      showPopup: true
    });
  };

  /**
   * Method to hide planet information
   * when required.
   */
  hidePlanetInfo = () => {
    console.log('hidePlanetInfo');
    this.setState({
      showPopup: false
    });
  };

  /**
   * Handle error at the component level.
   * Making use of Sentry API to sending error
   * log to server with all details.
   * @param {*} error erro occured
   * @param {*} errorInfo detaild infor about the error.
   */
  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
    this.setState({ error });
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId });
    });
  }

  /**
   * Method to handle the logout.
   */
  logoutClicked() {
    if (window.confirm(ErrorConstants.MESSAGE_CONFIRM_LOGOUT)) {
      LocalStorage.setUser('');
      // browserHistory.push("/");
    }
  }

  /**
   * Method to render the UI for
   * Search screen.
   */
  render() {
    const popup = this.state.showPopup ? (
      <PlanetInfo value={this.state.planetInfo} hidePlanetInfo={this.hidePlanetInfo} />
    ) : null;
    return (
      <div className="SearchScreenBody Scroll-lock">
        <nav className="navbar NavBarColor">
          <h1 className="Welcome ">{LocalStorage.getUser()}</h1>
          <form className="form-inline">
            <button
              className="btn btn-outline-danger my-2 my-sm-0  btn-sm"
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
          <PlanetList planetList={this.state.results} showPlanetInfo={this.showPlanetInfo} />
          <br />
          {this.state.loading ? (
            <div className="d-flex justify-content-center ">
              <div className="spinner-border text-danger" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
    // }
  }
}

export default SearchSreen;
