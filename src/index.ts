import express from 'express';
import {Telegraf} from "telegraf";
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/index';
import * as mongoose from 'mongoose';
import {handleError} from "./utils/handleError";
import User from "./models/user";

dotenv.config();

const app = express();
// const BOT_PORT:string | 3000 = process.env.BOT_PORT || 3000;
const SERVER_PORT:string | 8080 = process.env.SERVER_PORT || 8080;
const token:string | undefined = process.env.TELEGRAM_TOKEN;

app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
))
app.use(express.json());
app.use('/api', router)

const bot = new Telegraf(token ? token: '');

bot.start(async (ctx) => {
    const {id,first_name, last_name, username} = ctx.message.from
    const telegramUser:object = {
        id:id,
        username: username?username:"Unknown",
        first_name: first_name?first_name: "Unknown",
        last_name: last_name?last_name: "Unknown",
        score: 0,
        dailyScore: 0,
        monthlyScore: 0,
        lastUpdated: new Date().toISOString().split('T')[0],
        lastUpdatedMonthly: new Date().toISOString().split('T')[0].slice(0,7),
        availableLines: 100,
    }
    try {
        console.log('id при ініціалізації', id);
        let user = await User.findOne({ id })
        if (!user) {
            user = new User(telegramUser);
            console.log('new user', user);
            await user.save();
            ctx.reply(`${first_name?first_name:""} ${last_name?last_name:""} welcome to the game!`);
        } else {
            ctx.reply(`${first_name} ${last_name} welcome back to the game!`);
        }
        const frontUrl = 'https://rokokos97.github.io/gala-clicker/';
        ctx.reply('Click the button below to start playing.', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Play Now', web_app: { url: frontUrl } }],
                ],
            },
        });
    } catch (error) {
        handleError(error);
    }
});

bot.on('text', (ctx) => {
    ctx.reply('Currently, only the game option is available. Click the "Play Game" button below to start.');
});


bot.launch();

async function start(): Promise<void> {
    try {
        await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING || '');
        console.log('Database connected');
        app.listen(SERVER_PORT, () => {
            console.log(`Server is running on port ${SERVER_PORT}`);
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
start();
