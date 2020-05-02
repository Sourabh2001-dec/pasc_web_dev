$(window).scroll(function() {
    if ($(document).scrollTop() > 400) {
      $('.navbar').addClass('new-nav');
    } else {
      $('.navbar').removeClass('new-nav');
    }
  });

  $(function () {
			
    // $.scrollify({
    //     section: 'section',
    // });

    
});

anime({
    targets : '#path5530',
    translateX : '20px',
    scale : [1,1.04],
    direction : 'alternate',
    duration : 1500,
    loop : true,
    easing : 'linear'
})

anime({
    targets : '#aboutcorona img',
    keyframes : [
        {translateY : '10'},
        {translateY : '-10'},
        {translateY : '0'},

    ],
    easing : 'linear',
    loop : true,
    duration : 5000
})

// anime({
//     targets : '#path5594',
//     translateX : '20px',
//     direction : 'alternate',
//     duration : 2000,
//     loop : true
// })