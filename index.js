//*  Base Create By Kyy  *//
//*  Credits By Kyy       *//
//* LU SEBAR?GW DOAIN YAPIT MANDUL MISKIN 7 TURUNAN *//


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
╰━━━━━━━━━━━━━━━━━━⭓
\`\`\``;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '👑 𝐌𝐞𝐧𝐮 𝐎𝐰𝐧𝐞𝐫', callback_data: 'menuown' }],
                [{ text: '✧ 「 𝐎𝐖𝐍𝐄𝐑 」 ✧', url: `https://t.me/xwynoez${process.env.OWNER_USERNAME}` }]
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
╰━━━━━━━━━━━━━━━━━━⭓
\`\`\``;

        const buttons = [
            [{ text: '👑 𝐌𝐞𝐧𝐮 𝐎𝐰𝐧𝐞𝐫', callback_data: 'menuown' }],
            [{ text: '✧ 「 𝐎𝐖𝐍𝐄𝐑 」 ✧', url: `https://t.me/StormUltimate${process.env.OWNER_USERNAME}` }]
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

    const isYourOwner = await isOwner(senderId);
    const isYourMod = isMods(senderId);

    if (!isYourOwner && !isYourMod) {
        return bot.sendMessage(chatId, '❌ Anda Tidak Memiliki Akses!');
    }

    if (getGconlyStatus() && chatType === 'private' && isYourMod && !isYourOwner) {
        return bot.sendMessage(chatId, '❌ Bot hanya bisa digunakan di grup.');
    }

    if (!userId) {
        return bot.sendMessage(chatId, '❗ Contoh penggunaan: /addpt <ID>');
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

    if (!data.partner.includes(userId)) {
        data.partner.push(userId);
        fs.writeFileSync('./database/Partner.json', JSON.stringify(data, null, 2));
        bot.sendMessage(chatId, `✅ User ID ${userId} berhasil ditambahkan sebagai PT Token.`);
        sendOwnerNotification(`✅ User ID ${userId} ditambahkan ke daftar PT Token oleh ${username}.`);
    } else {
        bot.sendMessage(chatId, `⚠️ User ID ${userId} sudah terdaftar sebagai PT.`);
    }
});

bot.onText(/\/delpt(?:\s(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
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
