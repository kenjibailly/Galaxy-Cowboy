# Galaxy Cowboy

A discord bot to create interactive simple polls easily.

![Image of a poll](./assets/readme-image.png)


## Use the bot

To use this bot type `*help` to see the commands availables.
You can also use `*examples` to see several examples of how to use the bot.


## 🕹️Features

🌟 Create polls up to 10 possible answers.

🌟 Create timed polls up to a week.

🌟 See the results of a poll as a percentage.

🌟 Create (timed) date RSVP polls with dates (max 7 days).

🌟 Set a (timed) status.

🌟 All statuses can be posted in an overview, channel can be configured.

🌟 Setup through DM

🌟 Constant updates, follow the support server for updates


## 🔗 Links

[Website link](https://kenjibailly.github.com/galaxy-cowboy-discord-bot/)

[Invite link](https://discord.com/api/oauth2/authorize?client_id=723576740697473084&permissions=1812986945&scope=bot)

[Support server](https://discord.gg/nhBtPCG)


🙏 Enjoy the bot and don't hesitate to ask any questions or send out ideas!

## Host the bot

To host it rename and edit "botconfig-sample.json" in the bot's folder. In this file must appear the token of the bot, the prefix ("*" by default) and database connection info.

```json
{
    "CLEARDB_DATABASE_URL": "mysql://dbusername:dbpassword@dbhostname/dbname?reconnect=true",
    "DATABASE": "Database Name",
    "HOST": "Database Hostname",
    "PASSWORD": "Database Password",
    "prefix": "*",
    "TOKEN": "Discord Bot Token",
    "USER": "Database username",
    "link": "https://discord.com/api/oauth2/authorize?client_id=700457249654571139&permissions=1678113856&scope=bot",
}
```

Then in a command line in the bot's folder use `npm install`.

Attach a mysql database by editing the botconfig.json file.

Now, to start the bot use `node index.js`.

Enjoy the bot.