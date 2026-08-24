const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { Buffer } = require('buffer');
const { exec } = require("child_process");
const fs = require('fs');
const figlet = require('figlet');
const FormData = require("form-data");
const { fromBuffer } = require("file-type");
const fakeUserAgent = require("fake-useragent");
const crypto = require("crypto");
const chalk = require('chalk');
const gradient = require('gradient-string');
const JsConfuser = require("js-confuser");
const path = require("path");
const fetch = require("node-fetch");
const ffmpeg = require("fluent-ffmpeg");
const cloudscraper = require('cloudscraper');
const readlineSync = require('readline-sync');
require('dotenv').config();

const ownerId = process.env.OWNER_ID;
const contextStore = {};
const TOKEN = process.env.TELEGRAM_BOT_API_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });
const gconlyPath = './database/gconly.json';

bot.on("polling_error", (error) => {
    console.error(chalk.red("Polling Error:"), error.message);
});

bot.on("message", (msg) => {
    console.log(chalk.green(`📩 Pesan diterima dari ${msg.chat.username || msg.chat.id}: ${msg.text}`));
});

if (!TOKEN) {
    console.error(chalk.red("❌ Token bot tidak ditemukan. Pastikan TELEGRAM_BOT_API_TOKEN ada di file .env"));
    process.exit(1);
}

const title = figlet.textSync("STORM", { font: "ANSI Shadow" });
console.log(gradient.pastel.multiline(title));

console.log(chalk.bold.white("PREMIUM: ") + chalk.bold.magenta("YES"));
console.log(chalk.bold.white("VERSION: ") + chalk.bold.cyan("1.0"));
console.log(chalk.bold.white("ACCESS: ") + chalk.bold.green("YES"));
console.log(chalk.bold.white("CREDITS: ") + chalk.bold.green("VAZE4U\n"));
console.log(gradient.pastel("THANKS FOR BUYING THIS SCRIPT FROM VAZE4U"));

function getRandomImage() {
    const images = [
        "https://files.catbox.moe/lxzxzq.jpg",
        "https://files.catbox.moe/lxzxzq.jpg"
    ];
    return images[Math.floor(Math.random() * images.length)];
}

async function sendOwnerNotification(message) {
    if (ownerId) {
        bot.sendMessage(ownerId, message);
    } else {
        console.error('ID Owner tidak terdeteksi.');
    }
}

function isOwner(userId) {
    return String(userId) === ownerId;
}

function isReseller(userId) {
    if (!fs.existsSync('./database/Reseller.json')) {
        fs.writeFileSync('./database/Reseller.json', JSON.stringify({ reseller: [] }, null, 2));
    }
    const data = JSON.parse(fs.readFileSync('./database/Reseller.json', 'utf8'));
    return data.reseller.includes(String(userId));
}

function isPartner(userId) {
    if (!fs.existsSync('./database/Partner.json')) {
        fs.writeFileSync('./database/Partner.json', JSON.stringify({ partner: [] }, null, 2));
    }
    const data = JSON.parse(fs.readFileSync('./database/Partner.json', 'utf8'));
    return data.partner.includes(String(userId));
}

function isMods(userId) {
    if (!fs.existsSync('./database/Moderator.json')) {
        fs.writeFileSync('./database/Moderator.json', JSON.stringify({ moderator: [] }, null, 2));
    }
    const data = JSON.parse(fs.readFileSync('./database/Moderator.json', 'utf8'));
    return data.moderator.includes(String(userId));
}

function getGconlyStatus() {
    try {
        const data = fs.readFileSync(gconlyPath, 'utf8');
        const parsed = JSON.parse(data);
        return parsed.gconly === true;
    } catch (e) {
        return false;
    }
}

function setGconlyStatus(status) {
    fs.writeFileSync(gconlyPath, JSON.stringify({ gconly: status }, null, 2));
}

async function getTokenDatabase() {
    const url = `https://api.github.com/repos/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/contents/${process.env.TOKEN_FILE_PATH}`;
    const headers = {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
    };
    try {
        const response = await axios.get(url, { headers });
        const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
        const data = JSON.parse(content);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('❌ Gagal mengambil data nomor:', error.message);
        return [];
    }
}

async function updateTokenDatabase(database) {
    const url = `https://api.github.com/repos/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/contents/${process.env.TOKEN_FILE_PATH}`;
    const headers = { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` };

    try {
        let sha = null;

        try {
            const res = await axios.get(url, { headers });
            sha = res.data.sha;
        } catch (err) {
            if (err.response?.status === 404) {

                console.log("File tidak ditemukan, membuat file baru.");
            } else {
                throw err;
            }
        }

        const content = Buffer.from(JSON.stringify(database, null, 2)).toString('base64');

        await axios.put(url, {
            message: 'Update token',
            content,
            sha
        }, { headers });

        console.log(chalk.red(`✅ Database berhasil diperbarui dengan token:`, database));
    } catch (error) {
        console.error('❌ Gagal update database:', error.message);
    }
}

bot.onText(/\/listtoken/, async (msg) => {
    const userId = msg.from.id;

    if (!isOwner(userId)) {
        return bot.sendMessage(msg.chat.id, '❌ Hanya Owner yang dapat melihat daftar token!');
    }

    try {
        const database = await getTokenDatabase();
        if (!Array.isArray(database) || database.length === 0) {
            return bot.sendMessage(msg.chat.id, '📋 Daftar token kosong.');
        }

        const list = database.map((id, index) => `• ${index + 1}. \`${id}\``).join('\n');
        bot.sendMessage(msg.chat.id, `📋 Daftar Token:\n${list}`);
    } catch (error) {
        console.error('❌ Gagal mengambil daftar token:', error.message);
        bot.sendMessage(msg.chat.id, '❌ Gagal mengambil daftar token.');
    }
});

require('dotenv').config();;

const startTime = new Date();
function formatUptime() {
    const now = new Date();
    const diff = Math.floor((now - startTime) / 1000);

    const days = Math.floor(diff / (3600 * 24));
    const hours = Math.floor((diff % (3600 * 24)) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

bot.onText(/\/gconly(?:\s(\w+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const arg = match[1]?.toLowerCase();

    if (!isOwner(userId)) {
        return bot.sendMessage(chatId, '❌ Hanya Owner yang dapat mengatur mode gconly!');
    }

    if (!arg) {
        return bot.sendMessage(chatId, '❗ Gunakan perintah:\n/gconly on - Aktifkan gconly\n/gconly off - Matikan gconly');
    }

    const currentStatus = getGconlyStatus();

    if (arg === 'on') {
        if (currentStatus) {
            return bot.sendMessage(chatId, '⚠️ Mode gconly sudah aktif!');
        }
        setGconlyStatus(true);
        return bot.sendMessage(chatId, '✅ Mode gconly telah diaktifkan!');
    } else if (arg === 'off') {
        if (!currentStatus) {
            return bot.sendMessage(chatId, '⚠️ Mode gconly sudah nonaktif!');
        }
        setGconlyStatus(false);
        return bot.sendMessage(chatId, '✅ Mode gconly telah dinonaktifkan!');
    } else {
        return bot.sendMessage(chatId, '❌ Format tidak valid! Gunakan `/gconly on` atau `/gconly off`.');
    }
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const chatType = msg.chat.type;
    const userId = msg.from.id.toString();

    if (getGconlyStatus() && chatType === 'private' && !isOwner(userId)) {
        return bot.sendMessage(chatId, '❌ Bot hanya bisa digunakan di grup.');
    }

    const randomImage = getRandomImage();
    const response = `*Halo* *${msg.from.first_name || "User"}*! 👋

\`\`\`
╭━━━( 𝐈𝐍𝐅𝐎 𝐁𝐎𝐓 )
┃◇ ᴏᴡɴᴇʀ : @${process.env.OWNER_USERNAME}
┃◇ ʙᴏᴛ ɴᴀᴍᴇ : ${process.env.BOT_NAME}
┃◇ ʀᴜɴᴛɪᴍᴇ : ${formatUptime()}
╰━━━━━━━━━━━━━━━━━━⭓

╭━( 𝐌𝐄𝐍𝐔 𝐀𝐃𝐃 )
┃◇ /addtoken <TOKEN> - Menambahkan Token
╰━━━━━━━━━━━━━━━━━━⭓

╭━( 𝐌𝐄𝐍𝐔 𝐀𝐊𝐒𝐄𝐒 )
┃◇ /addres <ID> - Menambahkan Reseller
┃◇ /addpt <ID> - Menambahkan PT
╰━━━━━━━━━━━━━━━━━━⭓

╭━( 𝐌𝐄𝐍𝐔 𝐓𝐎𝐎𝐋𝐒 )
┃◇ /cekid
┃◇ /amprem
╰━━━━━━━━━━━━━━━━━━⭓
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '👑 𝐌𝐞𝐧𝐮 𝐎𝐰𝐧𝐞𝐫', callback_data: 'menuown' }],
                [{ text: '✧ 「 𝐎𝐖𝐍𝐄𝐑 」 ✧', url: `https://t.me/${process.env.OWNER_USERNAME}` }]
            ]
        }
    };

    bot.sendPhoto(chatId, randomImage, {
        caption: response,
        parse_mode: 'Markdown',
        ...options
    }).then((sentMessage) => {
        contextStore[chatId] = { messageId: sentMessage.message_id, image: randomImage };
    });
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id.toString();
    const userName = query.from.first_name || "User";
    const { message_id } = query.message;

    if (query.data === 'menuown') {
        if (!isOwner(userId)) {
            return bot.answerCallbackQuery(query.id, {
                text: '❌ Anda bukan owner!',
                show_alert: true
            });
        }

        const updatedText = `*Halo* *${userName}*! 👋

\`\`\`
╭━━━( 𝐈𝐍𝐅𝐎 𝐁𝐎𝐓 )
┃◇ ᴏᴡɴᴇʀ : @${process.env.OWNER_USERNAME}
┃◇ ʙᴏᴛ ɴᴀᴍᴇ ${process.env.BOT_NAME}
┃◇ ʀᴜɴᴛɪᴍᴇ : ${formatUptime()}
╰━━━━━━━━━━━━━━━━━━⭓

╭━( 𝐌𝐄𝐍𝐔 𝐎𝐖𝐍𝐄𝐑 )
┃◇ /deltoken <TOKEN>
┃◇ /delres <ID>
┃◇ /delpt <ID>
┃◇ /addmods <ID>
┃◇ /delmods <ID>
┃◇ /listres
┃◇ /listpt
┃◇ /listmods
┃◇ /listtoken
┃◇ /clearalltoken
┃◇ /gconly <on/off>
╰━━━━━━━━━━━━━━━━━━⭓
\`\`\``;

        const buttons = [
            [{ text: '🔙 Kembali ke Menu Awal', callback_data: 'back' }]
        ];

        return bot.editMessageCaption(updatedText, {
            chat_id: chatId,
            message_id,
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: buttons }
        }).then(() => {
            bot.answerCallbackQuery(query.id);
        });
    }

    if (query.data === 'back') {
        const updatedText = `*Halo* *${userName}*! 👋

\`\`\`
╭━━━( 𝐈𝐍𝐅𝐎 𝐁𝐎𝐓 )
┃◇ ᴏᴡɴᴇʀ : @${process.env.OWNER_USERNAME}
┃◇ ʙᴏᴛ ɴᴀᴍᴇ : ${process.env.BOT_NAME}
┃◇ ʀᴜɴᴛɪᴍᴇ : ${formatUptime()}
╰━━━━━━━━━━━━━━━━━━⭓

╭━( 𝐌𝐄𝐍𝐔 𝐀𝐃𝐃 )
┃◇ /addtoken <TOKEN> - Menambahkan Token
╰━━━━━━━━━━━━━━━━━━⭓

╭━( 𝐌𝐄𝐍𝐔 𝐀𝐊𝐒𝐄𝐒 )
┃◇ /addres <ID> - Menambahkan Reseller
┃◇ /addpt <ID> - Menambahkan PT
╰━━━━━━━━━━━━━━━━━━⭓

╭━( 𝐌𝐄𝐍𝐔 𝐓𝐎𝐎𝐋𝐒 )
┃◇ /cekid
┃◇ /amprem
╰━━━━━━━━━━━━━━━━━━⭓
\`\`\``;

        const buttons = [
            [{ text: '👑 𝐌𝐞𝐧𝐮 𝐎𝐰𝐧𝐞𝐫', callback_data: 'menuown' }],
            [{ text: '✧ 「 𝐎𝐖𝐍𝐄𝐑 」 ✧', url: `https://t.me/${process.env.OWNER_USERNAME}` }]
        ];

        return bot.editMessageCaption(updatedText, {
            chat_id: chatId,
            message_id,
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: buttons }
        }).then(() => {
            bot.answerCallbackQuery(query.id);
        });
    }
});

bot.onText(/^\/cekid(?:\s+@?(\S+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const chatType = msg.chat.type;
    const userId = msg.from.id;

    if (getGconlyStatus() && chatType === 'private' && !isOwner(userId)) {
        return bot.sendMessage(chatId, '❌ Bot hanya bisa digunakan di grup.');
    }

    let targetId;
    let targetUsername;

    if (msg.reply_to_message) {
        targetId = msg.reply_to_message.from.id;
        targetUsername = msg.reply_to_message.from.username || 'Tidak ada username';
    } else if (match[1]) {
        const username = match[1].replace('@', '');

        try {
            const member = await bot.getChatMember(chatId, username);
            targetId = member.user.id;
            targetUsername = member.user.username || 'Tidak ada username';
        } catch (err) {
            return bot.sendMessage(chatId, '❌ Pengguna tidak ditemukan atau bukan bagian dari grup ini.');
        }

    } else {
        targetId = msg.from.id;
        targetUsername = msg.from.username || 'Tidak ada username';
    }

    bot.sendMessage(chatId, `🆔 *ID Pengguna:*\n- ID: \`${targetId}\`\n- Username: @${targetUsername}`, { parse_mode: 'Markdown' });
});

bot.onText(/\/clearalltoken/, async (msg) => {
    const userId = msg.from.id;

    if (!isOwner(userId)) {
        return bot.sendMessage(msg.chat.id, '❌ Hanya Owner yang dapat menghapus semua token!');
    }

    try {
        let database = await getTokenDatabase();

        if (!Array.isArray(database) || database.length === 0) {
            return bot.sendMessage(msg.chat.id, '📋 Daftar token sudah kosong.');
        }

        database = [];
        await updateTokenDatabase(database);

        bot.sendMessage(msg.chat.id, '✅ Semua token berhasil dihapus dari database.');
    } catch (error) {
        console.error('❌ Gagal menghapus semua token:', error.message);
        bot.sendMessage(msg.chat.id, '❌ Gagal menghapus semua token.');
    }
});

bot.onText(/\/addtoken(?:\s(.+))?/, async (msg, match) => {
    const userId = msg.from.id;
    const chatId = msg.chat.id;
    const chatType = msg.chat.type;
    const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;

    const owner = await isOwner(userId);

    if (getGconlyStatus() && chatType === 'private' && !owner) {
        return bot.sendMessage(chatId, '❌ Bot hanya bisa digunakan di grup.');
    }

    const reseller = await isReseller(userId);
    const partner = await isPartner(userId);
    const mods = await isMods(userId);
    if (!owner && !reseller && !partner && !mods) {
        return bot.sendMessage(chatId, '❌ Anda Tidak Memiliki Akses!');
    }

    const token = match[1] ? match[1].trim() : null;
    if (!token) {
        return bot.sendMessage(chatId, '❗ Example: /addtoken <token>');
    }

    try {
        let database = await getTokenDatabase();
        if (!Array.isArray(database)) database = [];

        if (database.includes(token)) {
            return bot.sendMessage(chatId, `⚠️ Token sudah ada dalam database.`);
        }

        database.push(token);
        await updateTokenDatabase(database);

        bot.sendMessage(chatId, `✅ Token Berhasil Ditambahkan.`);
        sendOwnerNotification(`✅ Token ${token} Berhasil Ditambahkan Ke Database Oleh ${username}.`);
    } catch (error) {
        console.error('❌ Gagal menambahkan token:', error.message);
        bot.sendMessage(chatId, '❌ Gagal menambahkan token.');
    }
});

bot.onText(/\/deltoken(?:\s(.+))?/, async (msg, match) => {
    const userId = msg.from.id;
    const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;

    if (!(await isOwner(userId))) {
        return bot.sendMessage(msg.chat.id, '❌ Anda bukan Owner!');
    }

    const token = match[1] ? match[1].trim() : null;
    if (!token) {
        return bot.sendMessage(msg.chat.id, '❗ Example: /deltoken <token>');
    }

    try {
        let database = await getTokenDatabase();
        if (!Array.isArray(database)) database = [];

        if (!database.includes(token)) {
            return bot.sendMessage(msg.chat.id, `❌ Token tidak ada dalam database.`);
        }

        database = database.filter(tk => tk !== token);
        await updateTokenDatabase(database);

        bot.sendMessage(msg.chat.id, `✅ Token berhasil dihapus.`);
        sendOwnerNotification(`❌ Token ${token} berhasil dihapus dari database oleh ${username}.`);
    } catch (error) {
        console.error('❌ Gagal menghapus token:', error.message);
        bot.sendMessage(msg.chat.id, '❌ Gagal menghapus token.');
    }
});

bot.onText(/\/addres(?:\s(.+))?/, async (msg, match) => {
    const userIdInput = match[1] ? match[1].trim() : null;
    const senderId = msg.from.id;
    const chatId = msg.chat.id;
    const chatType = msg.chat.type;
    const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;

    const isSenderOwner = await isOwner(senderId);
    const isSenderPartner = await isPartner(senderId);
    const isSenderMods = await isMods(senderId);

    if (getGconlyStatus() && chatType === 'private' && !isSenderOwner) {
        return bot.sendMessage(chatId, '❌ Bot hanya bisa digunakan di grup.');
    }

    if (!isSenderOwner && !isSenderPartner && !isSenderMods) {
        return bot.sendMessage(chatId, '❌ Anda Tidak Memiliki Akses!');
    }

    if (!userIdInput) {
        return bot.sendMessage(chatId, '❗ Example: /addres <id>');
    }

    try {
        let data;
        try {
            data = JSON.parse(fs.readFileSync('./database/Reseller.json', 'utf8'));
            if (!Array.isArray(data.reseller)) {
                data.reseller = [];
            }
        } catch (error) {
            data = { reseller: [] };
        }

        if (!data.reseller.includes(userIdInput)) {
            data.reseller.push(userIdInput);
            fs.writeFileSync('./database/Reseller.json', JSON.stringify(data, null, 2));
            bot.sendMessage(chatId, `✅ User ID ${userIdInput} berhasil ditambahkan sebagai reseller Token.`);
            sendOwnerNotification(`✅ User ID ${userIdInput} berhasil ditambahkan ke daftar reseller Token oleh ${username}.`);
        } else {
            bot.sendMessage(chatId, `⚠️ User ID ${userIdInput} sudah terdaftar sebagai reseller Token.`);
        }
    } catch (error) {
        console.error('❌ Gagal menambahkan reseller:', error.message);
        bot.sendMessage(chatId, '❌ Terjadi kesalahan saat menambahkan reseller.');
    }
});

bot.onText(/\/delres(?:\s(.+))?/, (msg, match) => {
    const userId = match[1] ? match[1].trim() : null;
    const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;

    if (!isOwner(msg.from.id)) {
        return bot.sendMessage(msg.chat.id, '❌ Anda bukan Owner!');
    }

    if (!userId) {
        return bot.sendMessage(msg.chat.id, '❗ Example: /delres <id>');
    }

    const data = JSON.parse(fs.readFileSync('./database/Reseller.json', 'utf8'));
    if (data.reseller.includes(userId)) {
        data.reseller = data.reseller.filter(id => id !== userId);
        fs.writeFileSync('./database/Reseller.json', JSON.stringify(data, null, 2));
        bot.sendMessage(msg.chat.id, `✅ User ID ${userId} berhasil dihapus dari daftar Reseller.`);
        sendOwnerNotification(`❌ User ID ${userId} berhasil dihapus dari daftar Reseller oleh ${username}`);
    } else {
        bot.sendMessage(msg.chat.id, `❌ User ID ${userId} tidak ada dalam daftar Reseller.`);
    }
});

bot.onText(/\/listres/, (msg) => {
    if (!isOwner(msg.from.id)) {
        return bot.sendMessage(msg.chat.id, '❌ Anda bukan owner!');
    }

    try {
        const data = JSON.parse(fs.readFileSync('./database/Reseller.json', 'utf8'));

        if (!Array.isArray(data.reseller) || data.reseller.length === 0) {
            return bot.sendMessage(msg.chat.id, '❗ Daftar reseller kosong.');
        }

        const reseller1 = data.reseller.map((id, index) => `• ${index + 1}. \`${id}\``).join('\n');

        const response = `📋 *Daftar Reseller Token*\n${reseller1}`;
        bot.sendMessage(msg.chat.id, response, { parse_mode: 'Markdown' });
    } catch (error) {
        console.error('❌ Gagal membaca daftar Reseller:', error.message);
        bot.sendMessage(msg.chat.id, '❌ Gagal membaca daftar reseller.');
    }
});

bot.onText(/\/addpt(?:\s(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const chatType = msg.chat.type;
    const senderId = msg.from.id;
    const userId = match[1] ? match[1].trim() : null;
    const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;

    const isMyOwner = await isOwner(senderId);
    if (!isMyOwner) {
        return bot.sendMessage(chatId, '❌ Anda bukan owner!');
    }

    if (!userId) {
        return bot.sendMessage(chatId, '❗ Contoh penggunaan: /delpt <ID>');
    }

    let data;
    try {
        data = JSON.parse(fs.readFileSync('./database/Partner.json', 'utf8'));
        if (!Array.isArray(data.partner)) {
            data.partner = [];
        }
    } catch (error) {
        data = { partner: [] };
    }

    if (data.partner.includes(userId)) {
        data.partner = data.partner.filter(id => id !== userId);
        fs.writeFileSync('./database/Partner.json', JSON.stringify(data, null, 2));
        bot.sendMessage(chatId, `✅ User ID ${userId} berhasil dihapus dari daftar PT Token.`);
        sendOwnerNotification(`❌ User ID ${userId} berhasil dihapus dari daftar PT Token oleh ${username}.`);
    } else {
        bot.sendMessage(chatId, `❌ User ID ${userId} tidak ada dalam daftar PT.`);
    }
});

bot.onText(/\/listpt/, (msg) => {
    if (!isOwner(msg.from.id)) {
        return bot.sendMessage(msg.chat.id, '❌ Anda bukan owner!');
    }

    try {
        const data = JSON.parse(fs.readFileSync('./database/Partner.json', 'utf8'));

        if (!Array.isArray(data.partner) || data.partner.length === 0) {
            return bot.sendMessage(msg.chat.id, '❗ Daftar PT Token kosong.');
        }

        const listpt1 = data.partner.map((id, index) => `• ${index + 1}. \`${id}\``).join('\n');

        const response = `📋 *Daftar PT Token*\n${listpt1}`;
        bot.sendMessage(msg.chat.id, response, { parse_mode: 'Markdown' });
    } catch (error) {
        console.error('❌ Gagal membaca daftar PT Token:', error.message);
        bot.sendMessage(msg.chat.id, '❌ Gagal Membaca Daftar PT Token.');
    }
});

bot.onText(/\/addmods(?:\s(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
    const targetId = match[1] ? match[1].trim() : null;
    const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;

    if (!await isOwner(senderId)) {
        return bot.sendMessage(chatId, '❌ Anda Bukan Owner!');
    }

    if (!targetId) {
        return bot.sendMessage(chatId, '❗ Contoh penggunaan: /addmods <ID>');
    }

    let data;
    try {
        data = JSON.parse(fs.readFileSync('./database/Moderator.json', 'utf8'));
        if (!Array.isArray(data.moderator)) {
            data.moderator = [];
        }
    } catch {
        data = { moderator: [] };
    }

    if (!data.moderator.includes(targetId)) {
        data.moderator.push(targetId);
        fs.writeFileSync('./database/Moderator.json', JSON.stringify(data, null, 2));
        bot.sendMessage(chatId, `✅ User ID ${targetId} berhasil ditambahkan sebagai Moderator.`);
        sendOwnerNotification(`✅ User ID ${targetId} ditambahkan ke Moderator oleh ${username}.`);
    } else {
        bot.sendMessage(chatId, `⚠️ User ID ${targetId} sudah terdaftar sebagai Moderator.`);
    }
});

bot.onText(/\/delmods(?:\s(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
    const targetId = match[1] ? match[1].trim() : null;
    const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;

    if (!await isOwner(senderId)) {
        return bot.sendMessage(chatId, '❌ Anda Bukan Owner!');
    }

    if (!targetId) {
        return bot.sendMessage(chatId, '❗ Contoh penggunaan: /delmods <ID>');
    }

    let data;
    try {
        data = JSON.parse(fs.readFileSync('./database/Moderator.json', 'utf8'));
        if (!Array.isArray(data.moderator)) {
            data.moderator = [];
        }
    } catch {
        data = { moderator: [] };
    }

    if (data.moderator.includes(targetId)) {
        data.moderator = data.moderator.filter(id => id !== targetId);
        fs.writeFileSync('./database/Moderator.json', JSON.stringify(data, null, 2));
        bot.sendMessage(chatId, `✅ User ID ${targetId} berhasil dihapus dari Moderator.`);
        sendOwnerNotification(`❌ User ID ${targetId} dihapus dari Moderator oleh ${username}.`);
    } else {
        bot.sendMessage(chatId, `❌ User ID ${targetId} tidak ditemukan dalam daftar Moderator.`);
    }
});

bot.onText(/\/listmods/, async (msg) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    if (!await isOwner(senderId)) {
        return bot.sendMessage(chatId, '❌ Anda Bukan Owner!');
    }

    try {
        const data = JSON.parse(fs.readFileSync('./database/Moderator.json', 'utf8'));

        if (!Array.isArray(data.moderator) || data.moderator.length === 0) {
            return bot.sendMessage(chatId, '❗ Daftar Moderator kosong.');
        }

        const list = data.moderator.map((id, index) => `• ${index + 1}. \`${id}\``).join('\n');
        const response = `📋 *Daftar Moderator*\n${list}`;
        bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
    } catch (error) {
        console.error('❌ Gagal membaca daftar Moderator:', error.message);
        bot.sendMessage(chatId, '❌ Gagal Membaca Daftar Moderator.');
    }
});

// ==================== MAULANABOT BYPASS RATE LIMIT ====================
/*
  Create: t.me/AwasPhpJir
  RestApis: api.ikyyxd.my.id
  Note: Update & Upgrade MemBypass JS Challenge Of IP Rate Limiting
  
  Join: https://whatsapp.com/channel/0029Vb8hiKd0gcfQDpEDdf2n
*/

const AMPREM_CONFIG = {
    baseUrl: 'https://am.maulanabot.my.id',
    secretKey: 'kontol_jangan_so_tau_ngentod_2636273', 
    dbFile: 'accounts.json'
};

let GLOBAL_COOKIES_AMPREM = {};

const USER_AGENTS_AMPREM = [
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 11; SM-A515F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 13; SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36'
];

function generateFakeIP() {
    return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

async function makeRequest(method, url, payload = null, customHeaders = {}) {
    const options = {
        method: method,
        uri: url,
        json: true,
        resolveWithFullResponse: true,
        simple: false,
        headers: {
            ...customHeaders,
            'Accept': '*/*',
            'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
        }
    };

    if (payload && (method === 'POST' || method === 'PUT')) {
        options.body = payload;
        options.headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await cloudscraper(options);
        
        const setCookieHeader = response.headers['set-cookie'];
        if (setCookieHeader) {
            const cookiesArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
            cookiesArray.forEach(cookieStr => {
                const parts = cookieStr.split(';')[0].split('=');
                if (parts.length === 2) {
                    GLOBAL_COOKIES_AMPREM[parts[0].trim()] = parts[1].trim();
                }
            });
        }
        
        return response;
    } catch (error) {
        console.error(`[!] Cloudscraper Error: ${error.message}`);
        throw error;
    }
}

function getDynamicHeaders(payloadObj) {
    const timestamp = Date.now().toString();
    const payloadStr = JSON.stringify(payloadObj);
    const fakeIP = generateFakeIP();
    const randomUA = USER_AGENTS_AMPREM[Math.floor(Math.random() * USER_AGENTS_AMPREM.length)];
    
    const dataToHash = `${timestamp}:${payloadStr}:${AMPREM_CONFIG.secretKey}`;
    const signature = crypto.createHash('sha256').update(dataToHash).digest('hex');
    const fpHash = Math.abs(Math.floor(Math.random() * 1000000)).toString(16);

    return {
        'User-Agent': randomUA,
        'Origin': AMPREM_CONFIG.baseUrl,
        'Referer': `${AMPREM_CONFIG.baseUrl}/dashboard`,
        'X-App-Timestamp': timestamp,
        'X-App-Signature': signature,
        'X-Device-Fingerprint': `fp_${fpHash}`,
        'X-Forwarded-For': fakeIP,
        'X-Real-IP': fakeIP,
        'True-Client-IP': fakeIP,
        'Cookie': Object.entries(GLOBAL_COOKIES_AMPREM)
            .map(([key, value]) => `${key}=${value}`)
            .join('; ')
    };
}

function loadAccountsAmprem() {
    try {
        if (fs.existsSync(AMPREM_CONFIG.dbFile)) return JSON.parse(fs.readFileSync(AMPREM_CONFIG.dbFile, 'utf8'));
    } catch (e) { console.warn('[!] Gagal membaca database lokal.'); }
    return [];
}

function saveAccountAmprem(username, password) {
    const accounts = loadAccountsAmprem();
    const index = accounts.findIndex(a => a.username === username);
    const newData = { username, password, createdAt: new Date().toISOString() };
    
    if (index !== -1) accounts[index] = newData;
    else accounts.push(newData);
    
    fs.writeFileSync(AMPREM_CONFIG.dbFile, JSON.stringify(accounts, null, 2));
}

function findValidAccountAmprem() {
    const accounts = loadAccountsAmprem();
    return accounts.length > 0 ? accounts[accounts.length - 1] : null;
}

async function createNewOperatorSessionAmprem() {
    const randNum = crypto.randomBytes(3).toString('hex');
    const username = `iky${randNum}@gmail.com`; 
    const password = `ikyyxd_${crypto.randomBytes(2).toString('hex')}!`; 

    console.log(`\n[*] Membuat sesi operator BARU:`);
    console.log(`    Username: ${username}`);
    console.log(`    Password: ${password}\n`);

    GLOBAL_COOKIES_AMPREM = {};

    console.log('[*] Inisialisasi Cloudflare (Bypassing via Cloudscraper)...');
    await makeRequest('GET', AMPREM_CONFIG.baseUrl + '/');
    await new Promise(r => setTimeout(r, 2000));
    
    if (!GLOBAL_COOKIES_AMPREM['cf_clearance']) {
        throw new Error('Gagal menyelesaikan tantangan Cloudflare. IP mungkin terblokir permanen.');
    }
    console.log('[+] Cloudflare bypass berhasil! Cookie cf_clearance didapatkan.');

    await makeRequest('POST', AMPREM_CONFIG.baseUrl + '/api/auth/register', 
        { username, email: username, password }, 
        getDynamicHeaders({ username, email: username, password })
    );
    console.log('[+] Registrasi berhasil!');
    await new Promise(r => setTimeout(r, 1500));

    console.log(`[*] Melakukan login...`);
    const loginRes = await makeRequest('POST', AMPREM_CONFIG.baseUrl + '/api/auth/login', 
        { email: username, password }, 
        getDynamicHeaders({ email: username, password })
    );
    await new Promise(r => setTimeout(r, 1000));
    
    if (!GLOBAL_COOKIES_AMPREM['auth_token'] && loginRes.body?.status !== true) {
        throw new Error('Gagal mendapatkan sesi valid untuk operator baru.');
    }
    
    console.log('[+] Sesi operator baru siap digunakan!\n');
    saveAccountAmprem(username, password);
    return { username, password };
}

async function ensureOperatorLoggedInAmprem() {
    let account = findValidAccountAmprem();
    
    if (account) {
        console.log(`[+] Menggunakan akun operator: ${account.username}`);
        console.log(`[*] Refreshing sesi...`);
        
        try {
            GLOBAL_COOKIES_AMPREM = {};
            await makeRequest('GET', AMPREM_CONFIG.baseUrl + '/');
            await new Promise(r => setTimeout(r, 1500));
            
            await makeRequest('POST', AMPREM_CONFIG.baseUrl + '/api/auth/login', 
                { email: account.username, password: account.password }, 
                getDynamicHeaders({ email: account.username, password: account.password })
            );
            await new Promise(r => setTimeout(r, 500));
            
            if (GLOBAL_COOKIES_AMPREM['auth_token']) {
                console.log('[+] Sesi aktif dan valid.\n');
                return account;
            }
            throw new Error('Sesi expired atau invalid.');
        } catch (err) {
            console.warn('[!] Sesi lama gagal. Rotating ke akun baru...\n');
        }
    }

    return await createNewOperatorSessionAmprem();
}

async function sendOobLinkWithRetryAmprem(targetEmail, maxRetries = 5) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[*] Mengirim link OOB ke TARGET: ${targetEmail} (Percobaan ${attempt})`);
            const payload = { email: targetEmail, website_url: '' };
            
            const res = await makeRequest('POST', AMPREM_CONFIG.baseUrl + '/api/send', payload, getDynamicHeaders(payload));
            
            if (!res.body?.success && !res.body?.status) {
                const msg = res.body?.message || res.body?.msg || '';
                if (msg.toLowerCase().includes('limit') || msg.toLowerCase().includes('batas') || msg.toLowerCase().includes('ip') || res.statusCode === 429) {
                    console.warn(`[!] Terdeteksi LIMIT (IP/Akun). Melakukan rotasi...`);
                    await createNewOperatorSessionAmprem();
                    continue; 
                }
                throw new Error(msg || 'Gagal mengirim link ke target.');
            }
            
            console.log('[+] Link OOB berhasil dikirim ke target! Cek email target sekarang.\n');
            return true; 
            
        } catch (err) {
            if (err.message.includes('limit') || err.message.includes('403')) {
                console.warn(`[!] Request ditolak. Melakukan rotasi akun & IP...`);
                await createNewOperatorSessionAmprem();
                continue;
            }
            throw err; 
        }
    }
    throw new Error('Gagal mengirim link setelah beberapa kali rotasi akun & IP.');
}

async function verifyOobLinkAmprem(targetEmail, link) {
    console.log(`[*] Memverifikasi link OOB untuk target...`);
    const payload = { email: targetEmail, link, website_url: '' };
    
    const res = await makeRequest('POST', AMPREM_CONFIG.baseUrl + '/api/verify', payload, getDynamicHeaders(payload));
    return res.body;
}

// ==================== COMMAND /AMREM ====================
bot.onText(/\/amprem(?:\s(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const targetEmail = match[1] ? match[1].trim() : null;

    if (!isOwner(userId) && !isReseller(userId) && !isPartner(userId)) {
        return bot.sendMessage(chatId, '❌ Anda Tidak Memiliki Akses!');
    }

    if (!targetEmail) {
        return bot.sendMessage(chatId, '❗ Example: /amrem email@example.com');
    }

    await bot.sendMessage(chatId, `🔄 Memproses ${targetEmail}...\n⏳ Mohon tunggu...`);

    try {
        await ensureOperatorLoggedInAmprem();
        const sendResult = await sendOobLinkWithRetryAmprem(targetEmail);

        if (sendResult) {
            await bot.sendMessage(chatId, `✅ Link OOB berhasil dikirim ke ${targetEmail}!\n\n📧 Cek email target untuk link verifikasi.`);
        } else {
            await bot.sendMessage(chatId, `❌ Gagal mengirim link ke ${targetEmail}.`);
        }

    } catch (error) {
        console.error('AMPREM ERROR:', error);
        await bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${error.message}`);
    }
});
