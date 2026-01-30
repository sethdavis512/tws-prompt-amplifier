const ChannelSelector = {
    name: 'ChannelSelector',
    props: {
        channels: {
            type: Array,
            required: true
        },
        currentChannel: {
            type: String,
            required: true
        }
    },
    emits: ['select'],
    template: `
        <div class="input-section">
            <label>Channel</label>
        </div>
        <div class="channel-selector">
            <button
                v-for="channel in channels"
                :key="channel.id"
                class="channel-btn"
                :class="{ selected: currentChannel === channel.id }"
                :data-channel="channel.id"
                @click="$emit('select', channel.id)"
            >
                <i :data-lucide="channel.icon"></i>
                <span>{{ channel.label }}</span>
            </button>
        </div>
    `,
    mounted() {
        this.$nextTick(() => {
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });
    },
    updated() {
        this.$nextTick(() => {
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });
    }
};

module.exports = { ChannelSelector };
