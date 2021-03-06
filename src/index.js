import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import imagesList from "./components/imagesData.json";
import ImageSlide from "./components/ImageSlide.component";
import Navigation from "./components/Navigation.component";
import PagingDot from "./components/PagingDot.component";
import Header from "./components/Header.component";
import styles from "./styles.css";

export default class Carousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentImageIndex: 0,
      imageOffset: 0,
      intervalId: null
    };

    this.showNextImage = this.showNextImage.bind(this);
    this.showPrevImage = this.showPrevImage.bind(this);
    this.imageWidth = this.imageWidth.bind(this);
    this.showSelectedImg = this.showSelectedImg.bind(this);
    this.onHoverOver = this.onHoverOver.bind(this);
    this.onHoverOut = this.onHoverOut.bind(this);
  }

  // sets interval for auto advance every 10s after the component gets mounted
  componentDidMount() {
    const intervalId = setInterval(this.showNextImage, 10000);
    this.setState({
      intervalId
    });
  }

  // clears the interval on unmounting the component
  componentWillUnmount() {
    return clearInterval(this.state.intervalId);
  }

  // stops the auto advance on mover hover by terminating the interval
  onHoverOver() {
    return clearInterval(this.state.intervalId);
  }

  // auto advances every 10s on moving the mouse out of the image slider
  onHoverOut() {
    const intervalId = setInterval(this.showNextImage, 10000);
    this.setState({
      intervalId
    });
  }

  // shows previous image in the slider
  showPrevImage() {
    const { currentImageIndex, imageOffset } = this.state;
    if (currentImageIndex === 0) {
      return;
    }

    const nextIndex = currentImageIndex - 1;
    const newImageOffset = imageOffset + this.imageWidth();
    this.setState({
      currentImageIndex: nextIndex,
      imageOffset: newImageOffset
    });
  }

  // shows next image in the slider
  showNextImage() {
    const { currentImageIndex, imageOffset } = this.state;
    const nextIndex =
      currentImageIndex === imagesList.length - 1 ? 0 : currentImageIndex + 1;
    const newImageOffset =
      currentImageIndex === imagesList.length - 1
        ? 0
        : imageOffset - this.imageWidth();

    this.setState({
      currentImageIndex: nextIndex,
      imageOffset: newImageOffset
    });
  }

  // shows the image associated to the current image index
  showSelectedImg(i) {
    const { currentImageIndex } = this.state;
    if (currentImageIndex === i) {
      return;
    }

    // leveraged the inline block styling of CSS to make all images of carousel appear next to each other and use CSS tranform feature to move the div of images left upon clicking next and right upon clicking previous. Image offet defines the number of pixel div has to move.
    const imageOffset = -i * this.imageWidth();

    this.setState({
      currentImageIndex: i,
      imageOffset
    });
  }

  // Identifies width of each image displayed
  imageWidth() {
    return document.querySelector(".image-slide").clientWidth;
  }

  render() {
    const { currentImageIndex } = this.state;

    if (process.env.NODE_ENV !== "production") {
      var axe = require("react-axe");
      axe(React, ReactDOM, 1000);
    }

    return (
      <div className={styles.carousel} aria-label="carousel" role="main">
        <Header />
        <div className={styles.slideContainer}>
          <Navigation
            direction="prev"
            onArrowClick={this.showPrevImage}
            symbol="&#9664;"
          />
          <div
            className="slider-wrapper"
            style={{
              transform: `translateX(${this.state.imageOffset}px)`,
              transition: "transform ease-out 0.45s",
              height: "100%"
            }}
          >
            {imagesList.map((image, i) => (
              <ImageSlide
                key={image.name}
                image={image}
                onHoverOver={this.onHoverOver}
                onHoverOut={this.onHoverOut}
              />
            ))}
          </div>
          <Navigation
            direction="next"
            onArrowClick={this.showNextImage}
            symbol="&#9654;"
          />
        </div>
        <div className={styles.pagingDots}>
          {imagesList.map((image, i) => (
            <PagingDot
              key={`dot-${i}`}
              active={i === currentImageIndex}
              index={i}
              onDotClick={this.showSelectedImg}
            />
          ))}
        </div>
      </div>
    );
  }
}
