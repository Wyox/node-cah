module.exports.getInterfaces = function(){
	var rc = [];
	var os = require('os');
	var ifaces = os.networkInterfaces();

	Object.keys(ifaces).forEach(function (ifname) {
	  var alias = 0;

	  ifaces[ifname].forEach(function (iface) {
		if (alias >= 1) {
		  rc.push(iface.address);

		} else {
		  rc.push(iface.address);
		}
		++alias;
	  });
	});

	return rc;
};