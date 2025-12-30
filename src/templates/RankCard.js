import { BaseCard } from './BaseCard.js';

export class RankCard extends BaseCard {
    constructor() {
        super(934, 282);
        this.username = "User";
        this.displayName = null; // Users can have global display names
        this.avatar = null;
        this.level = 1;
        this.currentXP = 0;
        this.requiredXP = 100;
        this.status = "online";
        this.rank = 1;
        this.background = null;
    }

    /**
     * Auto-fill from a Discord.js Interaction or User/Member object
     * @param {Object} data - Discord.js Interaction, GuildMember, or User
     */
    setFromDiscord(data) {
        const user = data.user || data.author || data;
        const member = data.member || data;

        this.username = user.username;
        this.displayName = member.displayName || user.displayName || user.username;

        // Handle avatar URL - prefer guild avatar if member, then user avatar
        // This is a naive check; in real d.js we'd call displayAvatarURL({ extension: 'png' })
        // We assume the user passes the URL string or the object has a method
        if (typeof user.displayAvatarURL === 'function') {
            this.avatar = user.displayAvatarURL({ extension: 'png', size: 256 });
        } else if (typeof member.displayAvatarURL === 'function') {
            this.avatar = member.displayAvatarURL({ extension: 'png', size: 256 });
        } else if (user.avatarURL) {
            this.avatar = user.avatarURL;
        }

        // Status is harder to get in d.js v14 without presence intent, so we make it optional setter
        return this;
    }

    setUsername(name) {
        this.username = name;
        return this;
    }

    /**
     * @param {string} url - Avatar URL
     */
    setAvatar(url) {
        this.avatar = url;
        return this;
    }

    setLevel(level) {
        if (level < 0) throw new Error("Level cannot be negative");
        this.level = level;
        return this;
    }

    setXP(current, required) {
        if (current < 0) throw new Error("XP cannot be negative");
        if (required <= 0) throw new Error("Required XP must be > 0");
        this.currentXP = current;
        this.requiredXP = required;
        return this;
    }

    setRank(rank) {
        this.rank = rank;
        return this;
    }

    /**
     * Set a background image
     * @param {string} url 
     */
    setBackground(url) {
        this.background = url;
        return this;
    }

    async render() {
        this._initCanvas();
        const { ctx, width, height, theme } = this;

        // 1. Background
        // Fill solid color first
        ctx.fillStyle = theme.colors.background;
        ctx.fillRect(0, 0, width, height);

        // If custom background image
        if (this.background) {
            try {
                // If it's a theme that relies on bg (like glass), we draw it
                // Or just draw it if set
                await this.drawImage(this.background, 0, 0, width, height);

                // Add overlay
                ctx.fillStyle = theme.colors.overlay;
                ctx.fillRect(0, 0, width, height);
            } catch (e) {
                // Fallback to solid color if bg load fails
                console.warn("Failed to load background", e);
            }
        }

        // 2. Card Container (Optional visual flair - e.g. a rounded rect inset)
        // For this design, let's keep it clean flat full width or slight rounded

        // 3. Avatar
        // Drawn at x=40, y=40, size=200 roughly centered vertically
        const avatarSize = 200;
        const avatarX = 40;
        const avatarY = (height - avatarSize) / 2;

        // Draw avatar circle border/glow if desired
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 5, 0, Math.PI * 2);
        ctx.fillStyle = theme.colors.background; // Cutout look
        ctx.fill();

        // Actual Avatar
        if (this.avatar) {
            await this.drawImage(this.avatar, avatarX, avatarY, avatarSize, avatarSize, true);
        } else {
            // Placeholder
            ctx.fillStyle = theme.colors.progressBackground;
            ctx.beginPath();
            ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Status Indicator
        const statusColors = {
            online: "#43b581",
            idle: "#faa61a",
            dnd: "#f04747",
            offline: "#747f8d"
        };
        const statusColor = statusColors[this.status] || statusColors.offline;
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize - 20, avatarY + avatarSize - 20, 20, 0, Math.PI * 2);
        ctx.fillStyle = statusColor;
        ctx.fill();
        ctx.strokeStyle = theme.colors.background;
        ctx.lineWidth = 5;
        ctx.stroke();

        // 4. Text Content
        const contentX = 270;

        // Rank and Level labels (Right aligned)
        ctx.textAlign = "right";
        ctx.fillStyle = theme.colors.text;
        ctx.font = `bold 26px "${theme.font}"`;
        const rightMargin = width - 40;

        // "RANK #1"
        ctx.fillText("RANK", rightMargin - 140, 60);
        ctx.fillStyle = theme.colors.primary;
        ctx.font = `bold 40px "${theme.font}"`;
        ctx.fillText(`#${this.rank}`, rightMargin - 95, 60); // approximate spacing

        // "LEVEL 42"
        ctx.fillStyle = theme.colors.primary;
        ctx.fillText(this.level.toString(), rightMargin, 60);
        const levelWidth = ctx.measureText(this.level.toString()).width;
        ctx.fillStyle = theme.colors.subtext; // "LEVEL" label color
        ctx.font = `bold 26px "${theme.font}"`;
        ctx.fillText("LEVEL", rightMargin - levelWidth - 10, 60);

        // Username
        ctx.textAlign = "left";
        ctx.font = `bold 40px "${theme.font}"`;
        ctx.fillStyle = theme.colors.text;
        ctx.fillText(this.username, contentX, 160);

        // Discriminator or subtext (optional)
        // ctx.font = `24px "${theme.font}"`;
        // ctx.fillStyle = theme.colors.subtext;
        // ctx.fillText("#0000", contentX + ctx.measureText(this.username).width + 5, 160);

        // 5. XP Bar
        const barY = 190;
        const barHeight = 30;
        const barWidth = width - contentX - 40;

        // XP Text
        ctx.font = `20px "${theme.font}"`;
        ctx.fillStyle = theme.colors.text;
        ctx.textAlign = "right";
        ctx.fillText(`${this.currentXP} / ${this.requiredXP} XP`, width - 40, barY - 10);

        // Background Bar
        ctx.fillStyle = theme.colors.progressBackground; // Empty part
        this.drawRoundedRect(contentX, barY, barWidth, barHeight, barHeight / 2);
        ctx.fill();

        // Filled Bar
        const percent = Math.max(0, Math.min(this.currentXP / this.requiredXP, 1));
        if (percent > 0) {
            ctx.fillStyle = theme.colors.primary;
            // We clamp radius to not look weird if bar is very small
            this.drawRoundedRect(contentX, barY, barWidth * percent, barHeight, barHeight / 2);
            ctx.fill();
        }

        return this.canvas.toBuffer('image/png');
    }
}
