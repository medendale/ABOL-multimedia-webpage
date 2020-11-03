"use strict";

$(document).ready(function() {

	// better hover on the mobile devices
	if (Modernizr.touch) {
        // run the forEach on each figure element
        [].slice.call(document.querySelectorAll('a, button')).forEach(function(el, i) {
            // check if the user moves a finger
            var fingerMove = false;
            el.addEventListener('touchmove', function(e) {
                e.stopPropagation();
                fingerMove = true;
            });
            // always reset fingerMove to false on touch start
            el.addEventListener('touchstart', function(e) {
                e.stopPropagation();
                fingerMove = false;
            });
        });
    };

	// hamburger menu handling
	var clickEvent = "click";
	if(Modernizr.touch) {
		clickEvent = "touchstart";
	}

	// hamburger menu handler	
	$('.menu-toggle').on(clickEvent, function(e) {
		e.preventDefault();
		$(this).toggleClass('open');
		$('body').toggleClass('is-fixed');
		$('#hamburgermenu-wrapper').toggleClass('expanded');
	});

	// onScroll animations
	function onScrollInit( items, trigger ) {
	  items.each( function() {
	    var osElement = $(this),
	        osAnimationClass = osElement.attr('data-os-animation'),
	        osAnimationDelay = osElement.attr('data-os-animation-delay');
	      
	        osElement.css({
	          '-webkit-animation-delay':  osAnimationDelay,
	          '-moz-animation-delay':     osAnimationDelay,
	          'animation-delay':          osAnimationDelay
	        });

	        var osTrigger = ( trigger ) ? trigger : osElement;
	        
	        osTrigger.waypoint(function() {
	          osElement.addClass('animated').addClass(osAnimationClass);
	          },{
	              triggerOnce: true,
	              offset: '100%'
	        });
	  });
	}
	onScrollInit( $('.os-animation') );

	var gridPortfolio = $('#grid-portfolio');
	var gridItem = $('.grid-portfolio-item');
	gridItem.hide();

	gridPortfolio.imagesLoaded(function() {
		gridItem.fadeIn();

		gridPortfolio.masonry({ 
			columnWidth: '.grid-sizer',
			itemSelector: '.grid-portfolio-item', 
			percentPosition: 'true' 
		});

		// get current hash url for masonry filtering
		function getHashFilter() {
		  var hash = location.hash;
		  var matches = location.hash.match( /filter=([^&]+)/i );
		  var hashFilter = matches && matches[1];
		  return hashFilter && decodeURIComponent( hashFilter );
		}

		// isotope filtering buttons
		$('.filter-button-group').on('click', 'a', function(e) {
			e.preventDefault();
			var filterValue = $(this).attr('data-filter');
			gridPortfolio.isotope({ filter: filterValue });
			location.hash = 'filter=' + encodeURIComponent(filterValue);
		});

		var isIsotopeInit = false;

		// url hash navigation
		  function onHashchange() {
		    var hashFilter = getHashFilter();
		    if ( !hashFilter && isIsotopeInit ) {
		      return;
		    }
		    isIsotopeInit = true;
		    // filter isotope
		    gridPortfolio.isotope({
		      itemSelector: '.grid-portfolio-item',
		      filter: hashFilter
		    });
		  }
		  $(window).on('hashchange', onHashchange);
		  onHashchange();

	});

	// masonry & owl inits after loading all images
	$(window).resize().imagesLoaded().always(function(instance) {

		$('#carousel-tesimonials').owlCarousel({
			autoplay: false,
			autoplaySpeed: 600,
			autoplayTimeout: 6000,
			autoplayHoverPause: true,
			autoHeight: true,
			loop: true,
			items: 1,
			nav: false,
			dots: true,
			dotsContainer: '#carousel-tesimonials-dots',
			mouseDrag: false,
			touchDrag: false,
			animateOut: 'fadeOut',
			animateIn: 'fadeIn',
		});
	});

	// blueimp.Gallery init
    var galleryLinks = $('#grid-portfolio .gallery-item-link');
    $(galleryLinks).on('click', function(event) {
		event.preventDefault();
		var currentLink = $('#grid-portfolio .gallery-item-link').index(this);
		var galleryOptions = {
			index: currentLink,
			event: event,
			fullscreen: true,
			hidePageScrollbars: false,
			disableScroll: true,
			onslide: function (index, slide) {
					var text = $(this.list[index]).find('.item-content').html();
	                var node = this.container.find('.slide-info');
		            node.empty();
		            if (text) {
		                node[0].innerHTML = text;
		            }
		            var total = this.container.find('.slide-total');
		            total[0].innerHTML = this.getNumber();
		            var position = this.container.find('.slide-current');
		            position[0].innerHTML = this.getIndex() + 1;
	        	}	
		};
    	blueimp.Gallery(galleryLinks, galleryOptions);
    });

    // set about blocks to the equal height on large screens
    if (screen.width >= '992') {
    	$('.section-about .info-block .inner-wrapper').equalHeights();
    }

	// set pricing tables to the equal height
	$('.pricing-table .pricing-table-content .list-pricing-features').equalHeights();

	// animate counters
	$('.fact-counter-wrapper .counting-number').counterUp({
		delay: 40,
		time: 4000
	});

	// form handling
    $('.form-contact').submit(function(e) {
    	e.preventDefault();
        $.ajax({
            type: 'POST',
            url: 'mail.php',
            data: $(this).serialize()
        }).done(function() {
            setTimeout(function() {
                alert('Thanks for your message! I will reply you as soon as possible.');
            }, 1500);
        }).fail(function() {
            setTimeout(function() {
                alert('Something went wrong :( Please contact me directly to my email.');
            }, 1500);
        });
    });

});