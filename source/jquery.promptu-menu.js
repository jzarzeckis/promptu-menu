(function( $ ) {
  $.fn.promptuMenu = function(options) {
  
    // Do your awesome plugin stuff here
	
	var settings = $.extend({
		'columns': 3,
		'rows': 4,
		'direction': 'horizontal',
		'width': 'auto',
		'height': 'auto'
	}, options);
	
	return this.each(function(){
		var $this = $(this);
		var properties;
		var cursor = {
			x:0,
			y:0,
			page:1
		};
		
		if($this.data('promptumenu')){
			//This element already has promptumenu set up
			console.error('You are calling promptumenu for an element more than twice. Please have a look.')
		} else {
			//this element hasn't been initialized yet, so we set it up
			$this.data('promptumenu', true);
			
			//take in mind the original css properties of the element, so we can preserve it's position.
			properties = {
				width: (settings.width == 'auto') ? $this.width() : settings.width,
				height: (settings.height == 'auto') ? $this.height() : settings.height,
				margin: $this.css('margin'),
				position: ($this.css('position') == 'absolute') ? 'absolute' : 'relative',
				top: $this.css('top'),
				right: $this.css('right'),
				bottom: $this.css('bottom'),
				left: $this.css('left'),
				padding: 0,
				display: 'block',
				overflow: 'hidden'
			}
			
			
			$this.wrap('<div class="promptumenu_window" />')
			$this.parent('.promptumenu_window').css(properties);
			$this.css({
				'display': 'block',
				'position': 'absolute',
				'list-style': 'none',
				'overflow': 'hidden',
				'height': 'auto',
				'width': 'auto',
				'top': 0,
				'left': 0
			});
			
			//and set up each child element
			$this.children('li').css({
				'display': 'block',
				'position': 'absolute'
			});
		}
	});

  };
})( jQuery );