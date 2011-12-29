(function( $ ) {
  $.fn.promptumenu = function(options) {
  
    // Here goes
	
	var settings = $.extend({
		'columns': 3,
		'rows': 4,
		'direction': 'horizontal',
		'width': 'auto',
		'height': 'auto',
		'duration': 500
	}, options);
	
	return this.each(function(){
		var $this = $(this);
		var properties;
		var cursor = {
			x:0,
			y:1,
			page:1
		};
		var cells = {
			'width': 0,
			'height': 0,
			'pages': 1,
			'current_page': 1
		};
		
		var methods = {
			//navigating to a specific page
			go_to: function(index){
				if(settings.direction == 'vertical'){
					
					$this.animate({
						'top': (index - 1) * properties.height * (-1)
					}, settings.duration);
					
				} else {
					
					$this.animate({
						'left': (index - 1) * properties.width * (-1)
					}, settings.duration);
					
				}
				$this.parent('.promptumenu_window').find('.promptumenu_nav a.active').removeClass('active');
				$this.parent('.promptumenu_window').find('.promptumenu_nav a:nth-child(' + (index) + ')').addClass('active');
				cells.current_page = index;
			},
			next_page: function(){
				methods.go_to(cells.current_page + 1);
			},
			prev_page: function(){
				methods.go_to(cells.current_page - 1);
			}
		};
		
		if($this.data('promptumenu')){
			//This element already has promptumenu set up
			console.error('You are calling promptumenu for an element more than twice. Please have a look.')
		} else {
			//this element hasn't been initialized yet, so we set it up
			$this.data('promptumenu', true);
			
			//take in mind the original css properties of the element, so we can preserve it's position.
			properties = {
				'width': (settings.width == 'auto') ? $this.width() : settings.width,
				'height': (settings.height == 'auto') ? $this.height() : settings.height,
				'margin': $this.css('margin'),
				'position': ($this.css('position') == 'absolute') ? 'absolute' : 'relative',
				'top': $this.css('top'),
				'right': $this.css('right'),
				'bottom': $this.css('bottom'),
				'left': $this.css('left'),
				'padding': 0,
				'display': 'block',
				'overflow': 'hidden'
			}
			cells.width = properties.width / settings.columns;
			cells.height = properties.height / settings.rows;
			
			$this.wrap('<div class="promptumenu_window" />')
			$this.parent('.promptumenu_window').css(properties);
			$this.css({
				'display': 'block',
				'position': 'absolute',
				'list-style': 'none',
				'overflow': 'visible',
				'height': 'auto',
				'width': 'auto',
				'top': 0,
				'left': 0
			});
			
			//and set up each child element
			$this.children('li').css({
				'display': 'block',
				'position': 'absolute',
				'margin': 0
			});
			
			$this.children('li').each(function(){
				var $li = $(this);
				
				//Moving like a typewriter
				cursor.x += 1;
				//if we reach the end of columns, add a new line and reset typewriter
				if(cursor.x > settings.columns){
					cursor.x = 1;
					cursor.y += 1;
				}
				//if we reach the end of the page, turn the page
				if(cursor.y > settings.rows){
					cursor.x = 1;
					cursor.y = 1;
					cursor.page += 1;
				}
				
				if(settings.direction == 'vertical'){
				  
					//Lay the pages in a vertical order
					$li.css({
						'top': Math.round((cursor.y * cells.height - cells.height/2) - ($li.outerHeight()/2) + (cursor.page - 1) * properties.height),
						'left': Math.round((cursor.x * cells.width - cells.width/2) - ($li.outerWidth()/2))
					});
				  
				} else {
				  
					//Lay the pages in a horizontal order
					$li.css({
						'top': Math.round((cursor.y * cells.height - cells.height/2) - ($li.outerHeight() / 2)),
						'left': Math.round((cursor.x * cells.width - cells.width/2) - ($li.outerWidth()/2) + (cursor.page - 1) * properties.width)
					});
				  
				}
				
			});
			
			cells.pages = cursor.page;
			$this.data('promptumenu_page_count', cells.pages);
			
			//and append the navigation buttons for each page
			if(cells.pages > 1){
				var page_links = '<a class="active">Page 1</a>';
				for(i = 2; i <= cells.pages; i++){
					page_links = page_links + '<a>Page ' + i + '</a>';
				}
				
				$this.parent('div.promptumenu_window').append('<div class="promptumenu_nav">' + page_links + '</div>');
				
				//bind the nav buttons to navigate to the specific page
				$this.parent('div.promptumenu_window').find('.promptumenu_nav a').bind('click', function(){
					methods.go_to($(this).index() + 1);
				});
			}
			
			//Binding all the drag movements
			
		}
	});

  };
})( jQuery );