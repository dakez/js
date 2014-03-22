/* Copyright Dado K. www.github.com/dadok
 *
 * The Ultimate JavaScript Popup Window 
 *
 * Details and latest version at:
 * www.github.com/dadok/popwin
 *
 * This script is distributed under the GNU Lesser General Public License.
 * Read the entire license text here: http://www.gnu.org/licenses/lgpl.html
 *
 */

// $Id: popwin.js,v 1.0 2013/11/24 23:00:00 dadok Exp $

var popwin = {
	handle: null,
	innerHTML: '', // window content
	width: 0,
	height: 0,
	attributes:
	{
		menubar: false,
		toolbar: false,
		location: false,
		personalbar: false,
		directories: false,
		status: false,
		resizable: false,
		scrollbars: false,
		addonbar: false
	},
	centered : true,
	title: '', // set custom window title
	name: 'new_window',
	debug: true, // console.log
	
	init: function()
	{
		this.log('Popup initiated');
	},
	
	open: function()
	{
		if(!window.open)
		{
			this.log('Popup windows not allowed');
			return false;
		}
		
		var screenWidth = window.innerWidth ? window.innerWidth : screen.width;
		var screenHeight = window.innerWidth ? window.innerHeight : screen.height;

		// IE 8 or less
		if (window.attachEvent && !window.addEventListener)
		{
			screenWidth = document.documentElement.clientWidth;
			screenHeight = document.documentElement.clientHeight;
		}

		this.log('Screen size: ' + screenWidth + ' x ' + screenHeight);

		var dualScreenLeft = 0;
		var dualScreenTop = 0;
		var left = [window.screenLeft, screen.left, window.screenX];
		var top = [window.screenTop, screen.top, window.screenY];
		
		for(var i in left)
			if(typeof left[i] != 'undefined') dualScreenLeft = left[i];
		for(var i in top)
			if(typeof top[i] != 'undefined') dualScreenTop = top[i];

		this.log('Dual scr.: left ' + dualScreenLeft + ', top ' + dualScreenTop);
		
		this.width = 640; // default width
		this.height = 400; // default height
		
		for(var i in this.attributes)
			this.attributes[i] = false; // reset attributes
		
		switch(typeof arguments[0])
		{
			default:
				this.log('Unsupported parameter type: ' + typeof arguments[0]);
				return false;
			case 'undefined':
				this.innerHTML = 'about:blank';
				break;
			case 'string':
				if(arguments.length != 3)
				{
					this.log('Max. 3 string parameters');
					return false;
				}
				this.innerHTML = arguments[0];
				this.width = arguments[1];
				this.height = arguments[2];
				break;
			case 'object':
				if(arguments.length != 1)
				{
					this.log('Max. 1 object parameter');
					return false;
				}
				var object = arguments[0];
				for(var i in object)
				{
					if(i == 'open' || i == 'addEvent') continue; // disallow rewrite
					if(typeof this[i] == 'undefined') continue; // only defined
					if(i == 'attributes' && typeof object[i] == 'object')
						for(var j in object[i])
							this.attributes[j] = object[i][j]; // allow all attributes
					else
						this[i] = object[i];
				}
		}
		
		if(this.width < 128) this.width = 128; // minimum width
		if(this.height < 96) this.height = 96; // minimum height

		if(this.width > screenWidth) this.width = screenWidth;
		if(this.height > screenHeight) this.height = screenHeight;

		var left = dualScreenLeft;
		var top = dualScreenTop;
		if(this.centered)
		{
			left += Math.round((screenWidth - this.width) / 2);
			top += Math.round((screenHeight - this.height) / 2.5); // not half
		}

		var parameters = 'width=' + this.width +',height=' + this.height;
		parameters += ',top=' + top + ',left=' + left;

		for(var i in this.attributes)
			parameters += ',' + i + '=' + (this.attributes[i] ? 'yes' : 'no');
		this.log('Parameters ' + parameters);
		
		if(this.handle != null) this.close(); // if opened
		this.handle = window.open(this.innerHTML, this.name, parameters);

		if(!this.handle)
		{
			this.log('Window can\'t be opened');
			return false;
		}
		
		this.addEvent('load', popwin.onLoad);
		this.addEvent('beforeunload', popwin.onClose);
		this.checkWindow();
		
		this.log('Window opened');
		return this.handle;
	},
	
	addEvent: function(event, func)
	{
		if(this.handle.addEventListener)
			this.handle.addEventListener(event, func, false);
		else if(this.handle.attachEvent)
			this.handle.attachEvent('on' + event, func); // IE 8 or less
	},
	
	// loop: checking if window is closed
	checkWindow: function()
	{
		if(popwin.handle && popwin.handle.closed)
		{
			popwin.close();
			return;
		}
		setTimeout(popwin.checkWindow, 1000); // 1 second
	},

	onClose: function()
	{
		popwin.log('Before closing');
	},
	
	onLoad: function()
	{
		if(popwin.title != '')
			popwin.handle.document.title = popwin.title; // if custom title set
		popwin.log('Window loaded');
	},
	
	close: function()
	{
		if(this.handle && !this.handle.closed) this.handle.close();
		this.handle = null;
		this.log('Window closed');
	},
	
	log: function(msg)
	{
		if(popwin.debug && typeof console != 'undefined') // may not exist
			console.log('POPWIN: ' + msg);
	}
};