let burger = document.querySelector('.header-burger'),
  menu = document.querySelector(".header-menu-wrap"), 
  menuItems = document.querySelectorAll(".header-menu li"),
  headerBcg = document.querySelector(".header-menu-bcg");

[...menuItems, burger, headerBcg].forEach(item => {
  item.addEventListener('click', () => {
    burger.classList.toggle('active');

    if (window.innerWidth < 992) {
      document.querySelector("html").classList.toggle('not-scrolled');      
    }

    if (burger.classList.contains("active")) {
      menu.classList.add('active');

    }
    else {
      menu.classList.remove('show');
    }

    setTimeout(() => {

      if (!burger.classList.contains("active")) {
        menu.classList.remove('active');
      }
      else {
        menu.classList.add('show');       
      }
    }, 100);    
  })
});

$('a').on('click', function(e) {
  let elemToScroll = ($(this).attr('href').length > 1) ? $(`${$(this).attr('href')}`) : $('body');

  if (elemToScroll) {
     $(document.documentElement, document.body).animate({
          scrollTop: elemToScroll.offset().top
      }, 500);    
  }
});