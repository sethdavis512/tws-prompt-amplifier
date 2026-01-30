const { ref } = require('vue');
const { ipcRenderer } = require('electron');

const OutputSection = {
    name: 'OutputSection',
    props: {
        output: {
            type: String,
            default: ''
        },
        error: {
            type: String,
            default: ''
        },
        isProcessing: {
            type: Boolean,
            default: false
        }
    },
    emits: ['save-success', 'save-error'],
    setup(props, { emit }) {
        const copyState = ref('idle'); // 'idle' | 'copied'
        const saveState = ref('idle'); // 'idle' | 'saved'

        async function copyToClipboard() {
            if (!props.output) return;

            try {
                await navigator.clipboard.writeText(props.output);
                copyState.value = 'copied';
                setTimeout(() => {
                    copyState.value = 'idle';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }

        async function saveToFile() {
            if (!props.output) return;

            const result = await ipcRenderer.invoke('save-prompt', props.output);

            if (result.success) {
                saveState.value = 'saved';
                emit('save-success', result.filePath);
                setTimeout(() => {
                    saveState.value = 'idle';
                }, 2000);
            } else if (!result.canceled) {
                emit('save-error', result.error);
            }
        }

        return {
            copyState,
            saveState,
            copyToClipboard,
            saveToFile
        };
    },
    computed: {
        isEmpty() {
            return !this.output && !this.error && !this.isProcessing;
        },
        copyButtonText() {
            return this.copyState === 'copied' ? 'Copied' : 'Copy';
        },
        copyIcon() {
            return this.copyState === 'copied' ? 'check' : 'copy';
        },
        saveButtonText() {
            return this.saveState === 'saved' ? 'Saved' : 'Save';
        },
        saveIcon() {
            return this.saveState === 'saved' ? 'check' : 'save';
        }
    },
    template: `
        <div class="output-section">
            <div class="output-header">
                <label>Output</label>
                <div class="output-actions">
                    <button
                        class="save-btn"
                        :class="{ saved: saveState === 'saved' }"
                        @click="saveToFile"
                    >
                        <i :data-lucide="saveIcon"></i>
                        <span>{{ saveButtonText }}</span>
                    </button>
                    <button
                        class="copy-btn"
                        :class="{ copied: copyState === 'copied' }"
                        @click="copyToClipboard"
                    >
                        <i :data-lucide="copyIcon"></i>
                        <span>{{ copyButtonText }}</span>
                    </button>
                </div>
            </div>
            <div class="output-box" :class="{ empty: isEmpty }">
                <template v-if="isProcessing">
                    <span class="loading">
                        <span class="loading-spinner"></span>
                        Amplifying...
                    </span>
                </template>
                <template v-else-if="error">
                    <div class="error">{{ error }}</div>
                </template>
                <template v-else-if="output">
                    {{ output }}
                </template>
                <template v-else>
                    Amplified output will show here...
                </template>
            </div>
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

module.exports = { OutputSection };
