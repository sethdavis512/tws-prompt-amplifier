const InputSection = {
    name: 'InputSection',
    props: {
        modelValue: {
            type: String,
            default: ''
        }
    },
    emits: ['update:modelValue', 'toggle-history'],
    template: `
        <div class="input-section">
            <label>
                Input
                <button class="history-toggle" @click="$emit('toggle-history')">
                    <i data-lucide="history"></i>
                    <span>History</span>
                </button>
            </label>
            <textarea
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
                placeholder="Enter your prompt here..."
            ></textarea>
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

module.exports = { InputSection };
