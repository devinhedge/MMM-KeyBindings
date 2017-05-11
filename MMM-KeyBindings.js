/* global Module */

/* Magic Mirror
 * Module: MMM-KeyBindings
 *
 * By shbatm
 * MIT Licensed.
 */

Module.register("MMM-KeyBindings", {
	defaults: {
		enabledKeyStates: ['KEY_DOWN'], // Options are 'KEY_UP', 'KEY_DOWN', 'KEY_HOLD'
		handleKeys: [], // List of keys to handle internally in this module; blank == any
		powerKey: "KEY_HOMEPAGE",
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		console.log(this.name + " has started...");

		this.sendSocketNotification("MMM-KeyBindings-SOCKET_START", this.name);
		
		// Nothing else to do...
	},

	handleKeyPressEvents: function(payload) {
		// Either do something here or kick it to the node_helper for NodeJS functions
		console.log(payload.KeyName + " was pressed and sent to node_helper.");
		switch(payload.KeyName) {
			case this.config.powerKey: 
				payload.KeyName = "!POWER_KEY";
				this.sendSocketNotification("PROCESS_KEYPRESS", payload);
				break;
			default:
				this.sendSocketNotification("PROCESS_KEYPRESS", payload);
		}
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		// console.log("Working notification system. Notification:", notification, "payload: ", payload);
		if (notification === "KEYPRESS") {
			if (this.config.enabledKeyStates.indexOf(payload.KeyState) > -1) {
				// Broadcast Key to all Modules
				this.sendNotification("KEYPRESS", payload);

				// See if we should be doing something ourselves
				if (this.config.handleKeys.length == 0 || this.config.handleKeys.indexOf(payload.keyName) > -1) {
					this.handleKeyPressEvents(payload);
				}
			}
		}
	},

});
