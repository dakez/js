var debug = {
	VERSION: '1.00',

	printObject: function(object)
	{
		console.log(debugObject(object));
	},

	debugObject : function(object)
	{
		var msg = '';
		for(var i in object)
			msg = msg + i + '=' + object[i] + '\n';
		
		return msg;
	}
};