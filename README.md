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

## Showcases
### Discord 
  + Information browsing

![image](https://user-images.githubusercontent.com/24362894/210902044-15a6051f-41b0-4254-983c-a09a08589f7e.png) ![image](https://user-images.githubusercontent.com/24362894/210902066-24269b50-e428-46e7-898d-b9ddf3c0af98.png)
![image](https://user-images.githubusercontent.com/24362894/210902094-ab27b0b7-d52c-4e90-827e-c56240700b07.png) 

  + RSS fetching

![image](https://user-images.githubusercontent.com/24362894/210902241-a97897b8-52ac-49b2-a77b-a66a4c309b3a.png) ![image](https://user-images.githubusercontent.com/24362894/210902248-2e9bca4f-f4af-43a7-8a53-21c333141520.png)
![image](https://user-images.githubusercontent.com/24362894/210902278-10d51333-5826-4a91-ab5a-80849e02fb25.png) ![image](https://user-images.githubusercontent.com/24362894/210902302-3c652dc1-62ca-4292-8544-8d5cbc9d935f.png)
![image](https://user-images.githubusercontent.com/24362894/210902321-6232bcd0-08a7-4747-98e4-f35f8e8a2094.png)
  
  + Keyword repling
  
![image](https://user-images.githubusercontent.com/24362894/210902543-42952fd1-23de-4412-9b94-6ba0941ff7a9.png)
  
  + Small talking

![image](https://user-images.githubusercontent.com/24362894/210901616-789d39f9-9845-4447-9c37-d0c87496c6ac.png)
![image](https://user-images.githubusercontent.com/24362894/210901600-35bd326f-c214-47fb-a1cc-934aa56cc760.png)

 
 ### Telegram (as same as Discord with some modifications in content arranged)
 
![image](https://user-images.githubusercontent.com/24362894/210901560-aba18066-1772-46bc-b3c6-e6560fc33ab7.png)
![image](https://user-images.githubusercontent.com/24362894/210903377-00f8ed1a-8a2d-4318-b7e5-ffbcc478f8ff.png)
![image](https://user-images.githubusercontent.com/24362894/210903416-97eb2ac1-97f3-435f-bd12-bcc375f97059.png)
![image](https://user-images.githubusercontent.com/24362894/210902359-dbce5f41-0986-4829-828d-9d64b9663430.png)



