# Thủy Lợi Bot (old name: Em Gái Thủy Lợi)

## Currently support platform
 - Discord
 - Telegram
 - You can set-up for other platform as your own decision

## Function of the bot
 - Reply to message by keyword
 - Command for browsing information from database
 - Collect RSS, show list of articles and summary 
 - Small talk with bad word filter, Simsimi Bad-score API. Supported by official Simsimi Small Talk API and free API of Simsimi.info

## How to install
 - Clone this repository
 - ` npm install ` for install all Nodejs dependencies 
 - Use a ` .env ` file for your host config var to configuring these constraints
   - DISCORD_TOKEN 
   - HASURA_ADMIN_SECRET 
   - CLIENT_ID
   - SIMSIMI_API_KEY 
   - TOPGG_TOKEN 
 - Set-up your database API to fit the bot's query in GraphQL
 - Run it with ` npm run deploy `
 - Now you can change anything you want to fit your requirements 

