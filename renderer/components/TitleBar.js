const TitleBar = {
    name: 'TitleBar',
    emits: ['toggle-settings', 'close'],
    template: `
        <div class="title-bar">
            <span class="title">
                <i data-lucide="zap" style="stroke: var(--neon-primary-dim);"></i>
                Prompt Amplifier
            </span>
            <div>
                <button
                    class="settings-toggle"
                    title="Settings"
                    @click="$emit('toggle-settings')"
                >
                    <i data-lucide="settings"></i>
                </button>
                <button class="close-btn" @click="$emit('close')">
                    <i data-lucide="x"></i>
                </button>
            </div>
        </div>
    `,
    mounted() {
        this.$nextTick(() => {
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });
    }
};

module.exports = { TitleBar };
