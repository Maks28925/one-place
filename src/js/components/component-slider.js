
/* SLIDERS SETTINGS */

function initSlider(slider) {
  slider.slick({
    slidesToShow: 2,
    // slidesToScroll: 1,
    // arrows: false,
    dots: true,
    autoplay: true,
    // centerMode: true,
    infinity: true,
    prevArrow: $('.screens-arrows-item.prev'),
    nextArrow: $('.screens-arrows-item.next'),
    // variableWidth: true,
    
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });
}

let screensSlider = $(".screens-slider");

if (screensSlider.length !== 0) {
	initSlider(screensSlider);
}
