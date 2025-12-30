import { BaseCard } from './BaseCard.js';

export class WelcomeCard extends BaseCard {
    constructor() {
        super(1024, 450); // Wider for welcome images
        this.username = "User";
        this.serverName = "Server";
        this.memberCount = "";
        this.avatar = null;
        this.title = "WELCOME";
        this.message = "Welcome to the server!";
        this.background = null;
    }

    setUsername(name) {
        this.username = name;
        return this;
    }

    setServerName(name) {
        this.serverName = name;
        return this;
    }

    setMemberCount(count) {
        this.memberCount = `Member #${count}`;
        return this;
    }

    setAvatar(url) {
        this.avatar = url;
        return this;
    }

    setTitle(title) {
        this.title = title;
        return this;
    }

    setMessage(message) {
        this.message = message;
        return this;
    }

    setBackground(url) {
        this.background = url;
        return this;
    }

    async render() {
        this._initCanvas();
        const { ctx, width, height, theme } = this;

        // 1. Background
        ctx.fillStyle = theme.colors.background;
        ctx.fillRect(0, 0, width, height);

        if (this.background) {
            try {
                await this.drawImage(this.background, 0, 0, width, height);
                ctx.fillStyle = theme.colors.overlay;
                ctx.fillRect(0, 0, width, height);
            } catch (e) {
                console.warn("Failed to load background", e);
            }
        }

        // 2. Center Avatar
        const avatarSize = 250;
        const centerX = width / 2;
        const centerY = (height / 2) - 50;

        // Avatar Glow/Border
        ctx.save();
        ctx.shadowColor = theme.colors.primary;
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(centerX, centerY, avatarSize / 2 + 5, 0, Math.PI * 2);
        ctx.fillStyle = theme.colors.background;
        ctx.fill();
        ctx.restore();

        // Avatar Image
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, avatarSize / 2, 0, Math.PI * 2);
        ctx.clip();
        if (this.avatar) {
            await this.drawImage(this.avatar, centerX - avatarSize / 2, centerY - avatarSize / 2, avatarSize, avatarSize);
        } else {
            ctx.fillStyle = "#aaa";
            ctx.fillRect(centerX - avatarSize / 2, centerY - avatarSize / 2, avatarSize, avatarSize);
        }
        ctx.restore();

        // 3. Text
        ctx.textAlign = "center";

        // "WELCOME" Title
        ctx.font = `bold 60px "${theme.font}"`;
        ctx.fillStyle = theme.colors.primary;
        ctx.fillText(this.title, centerX, centerY + avatarSize / 2 + 70);

        // Username
        ctx.font = `bold 40px "${theme.font}"`;
        ctx.fillStyle = theme.colors.text;
        ctx.fillText(this.username, centerX, centerY + avatarSize / 2 + 120);

        // Member Count or Message
        ctx.font = `30px "${theme.font}"`;
        ctx.fillStyle = theme.colors.subtext;
        ctx.fillText(this.memberCount || this.message, centerX, centerY + avatarSize / 2 + 160);

        return this.canvas.toBuffer('image/png');
    }
}
