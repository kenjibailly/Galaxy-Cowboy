# Galaxy Cowboy

A discord bot to create interactive simple polls easily.

![Image of a poll](./assets/readme-image.png)


## Use the bot

To use this bot type `!poll help` to see the commands availables. Be aware that **only administrators or users with
a role named "Poll Creator" can interact with the bot**. The "Poll Creator" role has to be created manually and does not
need any permisssion.  
You can also use `!poll examples` to see several examples of how to use the bot.

## Features

- Create polls up to 10 possible answers.
- Create timed polls up to a week.
- See the results of a poll as a percentage.
- Only allow certain users to interact with the bot.

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


I'm also hosting an instance of the bot you can invite it with this link: <https://discordapp.com/api/oauth2/authorize?client_id=509451579678654468&permissions=68672&scope=bot>


Support server: <https://discord.gg/nhBtPCG>