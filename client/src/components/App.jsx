import React, { Component } from 'react';
import axios from 'axios';
import CollapsibleTitle from './CollapsibleTitle';
import Carousel from './Carousel';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currIndex: 0,
      list: [],
      zipcode: '',
      isExpanded: false,
      showPopup: false,
      clickedContent: '',
    };
  }

  componentDidMount() {
    const path = window.location.pathname.split('/');
    const id = path[path.length - 2];
    axios.get(`/api/nearbyHomes/${id}`, {})
      .then((homes) => {
        this.setState({
          list: homes.data,
          zipcode: homes.data[0].zipcode,
        });
      });
  }

  toggleCollapsibleTitle = () => {
    const { isExpanded } = this.state;
    this.setState({
      isExpanded: !isExpanded,
    });
  };

  handleContentCloseClick = () => {
    this.setState({ showPopup: false });
  };

  handleContentClick = param => (e) => {
    this.setState({
      clickedContent: param,
      showPopup: true,
    });
  };

  goToNextSlide = () => {
    this.setState(prevState => ({
      currIndex: prevState.currIndex + 1,
    }));
  };

  goToPrevSlide = () => {
    this.setState(prevState => ({
      currIndex: prevState.currIndex - 1,
    }));
  };

  render() {
    const {
      currIndex, isExpanded, showPopup, list, zipcode, clickedContent,
    } = this.state;

    return (
      <div className="collapsible-title-container">
        <div className="collapsible-title-inner-layout">
          <CollapsibleTitle
            isExpanded={isExpanded}
            zipcode={zipcode}
            toggleCollapsibleTitle={this.toggleCollapsibleTitle}
          />
          {isExpanded ? (
            <div className="collapsible-content">
              <Carousel
                homes={list}
                currIndex={currIndex}
                showPopup={showPopup}
                clickedContent={clickedContent}
                goToNextSlide={this.goToNextSlide}
                goToPrevSlide={this.goToPrevSlide}
                handleContentClick={this.handleContentClick}
                handleContentCloseClick={this.handleContentCloseClick}
              />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}

export default App;
