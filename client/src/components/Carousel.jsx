import React from 'react';
import LeftArrow from './LeftArrow';
import RightArrow from './RightArrow';
import Home from './Home';
import Popup from './Popup';

const Carousel = ({
  homes,
  currIndex,
  showPopup,
  goToNextSlide,
  goToPrevSlide,
  handleContentClick,
  clickedContent,
  handleContentCloseClick,
}) => {
  const isOddLen = homes.length % 2 === 1;

  return showPopup ? (
    <Popup
      handleContentClick={handleContentClick}
      clickedContent={clickedContent}
      handleContentCloseClick={handleContentCloseClick}
    />
  ) : (
    <>
      <h4 className="nearby-homes">NEARBY HOMES</h4>
      <div className="nearby-homes-container">
        <div className="nearby-homes-carousel">
          <LeftArrow currIndex={currIndex} goToPrevSlide={goToPrevSlide} />
          <div className="nearby-homes-list">
            {homes.map((home, i) => {
              const isLastCell = i === homes.length - 1;
              if (i === currIndex || i === currIndex + 1) {
                if (isOddLen && isLastCell) {
                  return <div />;
                }
                return (
                  <Home
                    home={home}
                    key={home.home_id}
                    showPopup={showPopup}
                    clickedContent={clickedContent}
                    handleContentClick={handleContentClick}
                    handleContentCloseClick={handleContentCloseClick}
                  />
                );
              }
            })}
          </div>
          <RightArrow
            currIndex={currIndex}
            goToNextSlide={goToNextSlide}
            listLength={homes.length}
            isOddLen={isOddLen}
          />
        </div>
      </div>
    </>
  );
};

export default Carousel;
