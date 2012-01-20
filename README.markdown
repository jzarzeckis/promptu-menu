Promptumenu jQuery plugin
=========================

http://natrixnatrix89.github.com/promptu-menu/

### What does it do?
This plugin is intended to create iPhone or Android like experience by creating a window with a menu.

You must be familiar with the concept of iPhone or Android homescreen. You have the window. And icons of various utilities there. And if the count of icons exceeds the space on the menu, a new page is created. By swiping with a finger you can see the next page, and interact with the icons there.

This plugin does exactly the same. All you have to do is provide an unordered list with your elements you want to use (list of users, products or other kinds of data). And then call promptumenu plugin simply by $('ul.my_list').promptumenu();

What makes this plugin special is the fact I tried to preserve the dynamic experience you get when swiping on an iPhone or Android.. So if user opens the page with a mobile device like Android, iPhone, iPad or iPod, he will be able to swipe with fingers.
Also when using mouse, the plugin takes in mind the momentum with which you are moving the mouse..
So the list moves with inertia after you release the mouse..

### Setting up
You can set it up by adding a link to the promptumenu.min.js file and by adding a link to the promptumenu stylesheet (which you can modify to suit your needs), And then by calling promptumenu on your desired elements. Like this:

	<script type="text/javascript" src="promptumenu/jquery.promptumenu.min.js"></script>
	<link rel="stylesheet" type="text/css" href="promptumenu/promptumenu.css" />
	<script type="text/javascript">
		$(function(){
			$('ul').promptumenu();
		});
	</script>
	</head>

### Dependencies
This plugin only requires the jQuery library

### Parameters
Although it should work even if you pass no parameters to it(in that case it will take the dimensions of your unordered list DOM element.. and build and position all the elements so that they take the size of your unordered list element, promptumenu can accepts parameters to suit your needs:

- Columns. Default: 3. Sets in how many columns the list should be ordered
- Rows. Default: 4. Sets the row count for ordered elements
- Direcion. Default: 'horizontal'. Possible valuse are 'horizontal' and 'vertical'. allows you to set the direction in which swiping would be possible
- Width. Default: 'auto'. Enter the width for the window, in which the menu will appear. If left untouched, plugin will take it from the properties of the element(most likely set in your css)
- Height. Default: 'auto'. Enter the desired height for your window.
- Duration. Default: 500. The duration of animation when moving from page to page in milliseconds.
- Pages. Boolean. Default: true. If set to true, a navigation menu will appear, and when swiping, the list will snap to pages. If set to false - no menu. and the list won't snap to specific positions.. Let's you experience the momentum more.
- Inertia. Default: 200. A Coefficient that sets the momentum of when releasing the list. Decreasing this value will decrease the inertia, so the movement will stop faster. Increasing it will make the movement faster and more fluid.

### Usage example
	$('ul').promptumenu({
		width:500,
		height:500,
		rows: 4,
		columns: 4,
		direction: 'horizontal',
		pages: true
	});

### Copyright
Copyright (c) 2012 Janis Zarzeckis [natrixnatrix89.net](http://natrixnatrix89.net)

This plugin is dual licenced under MIT and GPL Version 2 licences. 

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.