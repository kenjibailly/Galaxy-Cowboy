//////////////////////////////////////
// Rich Presence
//////////////////////////////////////
const config = require("../botconfig.json");
var delay = 0;
var speed = 10000;
const activity = (client) => {
	var discordActivity = delay =>
	setTimeout(() => {
		var discordActivityStatus;
		var discordActivityType;
		if (delay > 2) {
			delay = 0;
		}
		switch (delay) {
			case 0:
				discordActivityStatus = "kb-galaxy-cowboy.ga";
				discordActivityType = "WATCHING";
				break;	
			case 1:
				discordActivityStatus = `${config.prefix}help`;
				discordActivityType = "WATCHING";
				break;
			case 2:
				discordActivityStatus = `${config.prefix}examples`;
				discordActivityType = "WATCHING";
				break;
			// case 3:
			// 	discordActivityStatus = "http://kb-galaxy-cowboy.ga";
			// 	discordActivityType = "WATCHING";
			// 	break;
			default:

				break;
		}
		client.user.setActivity(`${discordActivityStatus}`, { type: discordActivityType});
		discordActivity(delay +1);
	}, speed);
	discordActivity(delay);
}

exports.activity = activity;