var counter = $('.counter-value');

function animateCounter() {
  counter.each(function () {
    $(this).prop('Counter', 0).animate({
      Counter: $(this).data('value')
    }, {
      duration: 1500,
      easing: 'swing',
      step: function(now) {
        $(this).text(Math.ceil(now))
      }
    })
  })
}

function isScrolledIntoView(elem) {
  var docViewTop = $(window).scrollTop();
  var docViewBottom = docViewTop + $(window).height();

  var elemTop = $(elem).offset().top;
  var elemBottom = elemTop + $(elem).height();

  return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}   


var flag = true;

function checkCounter() {
  if (isScrolledIntoView(counter) && flag) {
    animateCounter();
  }

  window.addEventListener('scroll', () => {
    if (isScrolledIntoView(counter) && flag) {
      animateCounter();
    }
  })
}

if (counter.length) {
  checkCounter()
}