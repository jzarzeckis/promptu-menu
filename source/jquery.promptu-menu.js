/*
 * promptuMenu - jQuery Plugin
 * https://github.com/natrixnatrix89/promptu-menu
 *
 * Copyright (c) 2012 Janis Zarzeckis (http://natrixnatrix89.net)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function( $ ) {
  $.fn.promptumenu = function(options) {
  
    // Here goes
	
	var settings = $.extend({
		'columns': 3,
		'rows': 4,
		'direction': 'horizontal',
		'width': 'auto',
		'height': 'auto',
		'duration': 500,
		'pages': true,
		'inertia': 200
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
			go_to: function(index, easing){
				if (easing === undefined){
					easing = 'swing';
				}
				if(settings.direction == 'vertical'){
					
					$this.animate({
						'top': (index - 1) * properties.height * (-1)
					}, settings.duration, easing);
					
				} else {
					
					$this.animate({
						'left': (index - 1) * properties.width * (-1)
					}, settings.duration, easing);
					
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
				'left': 0,
				'margin': 0,
				'padding': 0
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
			if(cells.pages > 1 && settings.pages == true){
				var page_links = '<a class="active">Page 1</a>';
				for(i = 2; i <= cells.pages; i++){
					page_links = page_links + '<a>Page ' + i + '</a>';
				}
				
				$this.parent('div.promptumenu_window').append('<div class="promptumenu_nav">' + page_links + '</div>');
				
				//bind the nav buttons to navigate to the specific page
				$this.parent('div.promptumenu_window').find('.promptumenu_nav a').bind('click.promptumenu', function(){
					methods.go_to($(this).index() + 1);
				});
			}
			
			//Make the list size appropriate, so that it could be dragged
			//(or else users will be able to drag only by clicking the icons, but clicking
			// on background will not activate dragging)
			if(settings.direction == 'vertical'){
				$this.css({
					'width': properties.width,
					'height': properties.height * cells.pages
				});
			} else {
				$this.css({
					'width': properties.width * cells.pages,
					'height': properties.height
				});
			}
			
			//Binding all the drag movements
			$this.bind('mousedown.promptumenu', function(mdown){
				mdown.preventDefault();
				
				$this.stop(true, false);
				
				var init_pos = $this.position();
				var click = {
					'x': mdown.pageX,
					'y': mdown.pageY
				};
				var delta = {
					'x': 0,
					'y': 0
				};
				var mmove_event = new Array();
				
				//bind the mousemove to moving the list
				$(document).bind('mousemove.promptumenu', function(mmove){
					mmove.preventDefault();
					var date = new Date();
					var this_event = {
						'time': date.getTime(),
						'x': mmove.pageX,
						'y': mmove.pageY
					};
					
					//I want to get the average of the last 6 mousemove events before mouseup
					while(mmove_event.length > 4){
						mmove_event.shift();
					}
					
					if(settings.direction == 'vertical'){
						delta.y = mmove.pageY - click.y;
						$this.css('top', init_pos.top + delta.y);
					} else {
						delta.x = mmove.pageX - click.x;
						$this.css('left', init_pos.left + delta.x);
					}
					mmove_event.push(this_event);
				});
				
				//bind the mouseup to unbinding and animating to the appropriate page
				$(document).bind('mouseup.promptumenu', function(mup){
					mup.preventDefault();
					$(document).unbind('.promptumenu');
					
					var date = new Date();
					
					var delta_start = mmove_event[0];
					var delta_end = {
						'time': date.getTime(),
						'x': mup.pageX,
						'y': mup.pageY
					};
					var event_delta = {
						'time': (delta_end.time - delta_start.time),
						'x': (delta_end.x - delta_start.x),
						'y': (delta_end.y - delta_start.y)
					}
					var speed = {
						'x': event_delta.x/event_delta.time,
						'y': event_delta.y/event_delta.time
					}
					//console.log(mmove_event);
					//console.log('The time delta is: ' + (delta_end.time - delta_start.time));
					//console.log('The y_speed was: ' + (event_delta.y/event_delta.time));
					
					//And now we can animate the list with the appropriate distance and speed
					if(settings.direction == 'vertical'){
						
						var pos = init_pos.top + delta.y + speed.y * settings.inertia;
						//check if the user hasn't dragged over the end..
						if(pos < ((-1) * properties.height * (cells.pages - 1))){
							pos = (-1) * properties.height * (cells.pages - 1);
						} else if(pos > 0){
							pos = 0;
						}
						
						//if the pages are being displayed, we want to snap to the specific page
						if(settings.pages){
							var snap_to_page = Math.round((- pos) / properties.height)
							methods.go_to(snap_to_page + 1, 'inertia');
						} else {
							$this.animate({
								'top': pos
							}, Math.abs(speed.y * settings.inertia), 'inertia');
						}
						
						
					} else {
						
						var pos = init_pos.left + delta.x + speed.x * settings.inertia;
						//check if the user hasn't dragged over the end..
						if(pos < ((-1) * properties.width * (cells.pages - 1))){
							pos = (-1) * properties.width * (cells.pages - 1);
						} else if(pos > 0){
							pos = 0;
						}
						
						//if the pages are being displayed, we want to snap to the specific page
						if(settings.pages){
							var snap_to_page = Math.round((- pos) / properties.width)
							methods.go_to(snap_to_page + 1, 'inertia');
						} else {
							$this.animate({
								'left': pos
							}, Math.abs(speed.x * settings.inertia), 'inertia');
						}
						
					}
				});
				
			});
			
			
			try {
				//And here we do basically the same again to bind swiping on mobile devices like iPhone, iPad, android, etc
				var tinit_pos, tclick, tdelta;
				var tmove_event = new Array();
				
				var touchmove = function(tmove){
					
					tmove.preventDefault();
					var date = new Date();
					var this_event = {
						'time': date.getTime(),
						'x': tmove.touches[0].pageX,
						'y': tmove.touches[0].pageY
					};
					
					
					//I want to get the average of the last 6 mousemove events before mouseup
					while(tmove_event.length > 4){
						tmove_event.shift();
					}
					
					if(settings.direction == 'vertical'){
						tdelta.y = tmove.touches[0].pageY - tclick.y;
						$this.css('top', tinit_pos.top + tdelta.y);
					} else {
						tdelta.x = tmove.touches[0].pageX - tclick.x;
						$this.css('left', tinit_pos.left + tdelta.x);
					}
					tmove_event.push(this_event);
					
				};
				
				var touchend = function(tend){
					
					tend.preventDefault();
					document.removeEventListener('touchmove', touchmove, false);
					document.removeEventListener('touchend', touchend, false);
					
					alert('touchend');
					
					var date = new Date();
					
					var delta_start = tmove_event[0];
					var delta_end = {
						'time': date.getTime(),
						'x': tend.touches[0].pageX,
						'y': tend.touches[0].pageY
					};
					var event_delta = {
						'time': (delta_end.time - delta_start.time),
						'x': (delta_end.x - delta_start.x),
						'y': (delta_end.y - delta_start.y)
					}
					var speed = {
						'x': event_delta.x/event_delta.time,
						'y': event_delta.y/event_delta.time
					}
					
					//And now we can animate the list with the appropriate distance and speed
					if(settings.direction == 'vertical'){
						
						var pos = tinit_pos.top + tdelta.y + speed.y * settings.inertia;
						//check if the user hasn't dragged over the end..
						if(pos < ((-1) * properties.height * (cells.pages - 1))){
							pos = (-1) * properties.height * (cells.pages - 1);
						} else if(pos > 0){
							pos = 0;
						}
						
						//if the pages are being displayed, we want to snap to the specific page
						if(settings.pages){
							var snap_to_page = Math.round((- pos) / properties.height)
							methods.go_to(snap_to_page + 1, 'inertia');
						} else {
							$this.animate({
								'top': pos
							}, Math.abs(speed.y * settings.inertia), 'inertia');
						}
						
						
					} else {
						
						var pos = tinit_pos.left + tdelta.x + speed.x * settings.inertia;
						//check if the user hasn't dragged over the end..
						if(pos < ((-1) * properties.width * (cells.pages - 1))){
							pos = (-1) * properties.width * (cells.pages - 1);
						} else if(pos > 0){
							pos = 0;
						}
						
						//if the pages are being displayed, we want to snap to the specific page
						if(settings.pages){
							var snap_to_page = Math.round((- pos) / properties.width)
							methods.go_to(snap_to_page + 1, 'inertia');
						} else {
							$this.animate({
								'left': pos
							}, Math.abs(speed.x * settings.inertia), 'inertia');
						}
						
					}
					
				}
				
				
				//touch start event
				$this[0].addEventListener('touchstart', function(tstart){
					//disable the mouse events
					$this.unbind('.promptumenu');
					
					tstart.preventDefault();
					
					$this.stop(true, false);
					
					tinit_pos = $this.position();
					tclick = {
						'x': tstart.touches[0].pageX,
						'y': tstart.touches[0].pageY
					};
					tdelta = {
						'x': 0,
						'y': 0
					};
					tmove_event = new Array();
					
					//and we can now bind the touch move event
					document.addEventListener('touchmove', touchmove, false);
					
					//and the touch end event
					document.addEventListener('touchend', touchend, false);
				}, false);
			} catch(error) {
				//apparently this browser won't support swiping
				alert(error);
			}
		}
	});

  };
})( jQuery );
//Easing for inertia when dragging
jQuery.extend(jQuery.easing, {
	inertia: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	}
});