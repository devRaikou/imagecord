# ImageCord

<div align="center">

  **The Professional Discord Image Generation Library**
  
  [![npm version](https://img.shields.io/npm/v/imagecord?style=flat-square)](https://www.npmjs.com/package/imagecord)
  [![License](https://img.shields.io/npm/l/imagecord?style=flat-square)](LICENSE)
  [![Downloads](https://img.shields.io/npm/dt/imagecord?style=flat-square)](https://www.npmjs.com/package/imagecord)

</div>

**ImageCord** is a high-performance, object-oriented image generation library built specifically for Discord bots. It leverages `@napi-rs/canvas` for speed and provides a chainable, intuitive API with built-in theming and Discord.js 14+ integration.

---

## ✨ Features

- **🚀 High Performance**: Built on `@napi-rs/canvas` and uses LRU caching for assets to minimize network requests.
- **🎨 Powerful Theming**: Switch between `dark`, `dark-orange`, `cyber`, and `glass` themes or create your own.
- **🧩 Template System**: Ready-to-use `RankCard`, `WelcomeCard`, and more.
- **📦 Discord.js Ready**: seamless integration—pass interactions or members directly.
- **🛡️ Type-Safe**: JSDoc typed for excellent IntelliSense support.

## 📦 Installation

```bash
npm install imagecord @napi-rs/canvas discord.js
```

## ⚡ Quick Start

### 1. Simple Rank Card

```js
import { RankCard } from 'imagecord';
import { AttachmentBuilder } from 'discord.js';

client.on('messageCreate', async message => {
  if (message.content === '!rank') {
    
    // Create the card
    const card = new RankCard()
      .setFromDiscord(message.member) // Auto-fills username, avatar, etc.
      .setLevel(5)
      .setXP(450, 1000)
      .setRank(1)
      .setStatus("online")
      .setTheme('cyber'); // Use 'cyber' theme

    // Render to buffer
    const buffer = await card.render();

    // Send to Discord
    const attachment = new AttachmentBuilder(buffer, { name: 'rank.png' });
    message.channel.send({ files: [attachment] });
  }
});
```

### 2. Welcome Image

```js
import { WelcomeCard } from 'imagecord';

client.on('guildMemberAdd', async member => {
  const channel = member.guild.channels.cache.get('WELCOME_CHANNEL_ID');
  
  const image = await new WelcomeCard()
    .setAvatar(member.user.displayAvatarURL({ extension: 'png' }))
    .setUsername(member.user.username)
    .setServerName(member.guild.name)
    .setMemberCount(member.guild.memberCount)
    .setTheme('dark-orange')
    .setBackground('./assets/bg.jpg')
    .render();
    
    channel.send({ files: [image] });
});
```

## 🎨 Themes

ImageCord includes a powerful theme engine. To switch themes:

```js
card.setTheme('glass');
```

**Available Presets:**
- `dark` (Default Discord style)
- `dark-orange` (Warm aesthetic)
- `cyber` (Neon/Cyberpunk)
- `glass` (Translucent UI)

**Custom Theme:**
```js
import { themeManager } from 'imagecord';

themeManager.register('my-theme', {
  colors: {
    background: "#000000",
    primary: "#FF0000",
    text: "#FFFFFF",
    // ...
  },
  font: "Arial"
});

card.setTheme('my-theme');
```

## 💡 Performance Notes

- **Caching**: Avatars and backgrounds are automatically cached in memory (LRU).
- **Font Loading**: Fonts are registered once globally.
- **Async Rendering**: All heavy I/O is asynchronous to prevent blocking the event loop.

---

## 👨‍💻 Author

**Raikou**  

---

*Verified for Discord.js v14+ and Node.js 16+*