const AmplifyButton = {
    name: 'AmplifyButton',
    props: {
        isProcessing: {
            type: Boolean,
            default: false
        }
    },
    emits: ['click'],
    template: `
        <button
            class="amplify-btn"
            :disabled="isProcessing"
            @click="$emit('click')"
        >
            <template v-if="isProcessing">
                <span class="loading">
                    <span class="loading-spinner"></span>
                    Processing...
                </span>
            </template>
            <template v-else>
                <i
                    data-lucide="zap"
                    style="
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        vertical-align: middle;
                    "
                ></i>
                Amplify Prompt
            </template>
        </button>
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

module.exports = { AmplifyButton };
