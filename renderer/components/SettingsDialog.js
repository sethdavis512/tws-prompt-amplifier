const { ref, watch, onMounted } = require('vue');

const SettingsDialog = {
    name: 'SettingsDialog',
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        apiKey: {
            type: String,
            default: ''
        },
        licenseKey: {
            type: String,
            default: ''
        },
        systemPrompt: {
            type: String,
            default: ''
        },
        licenseStatus: {
            type: String,
            default: 'Enter your license key to unlock features.'
        },
        licenseStatusColor: {
            type: String,
            default: 'var(--text-gray)'
        }
    },
    emits: ['update:apiKey', 'update:licenseKey', 'update:systemPrompt', 'close'],
    setup(props, { emit }) {
        const dialogRef = ref(null);
        const localApiKey = ref(props.apiKey);
        const localLicenseKey = ref(props.licenseKey);
        const localSystemPrompt = ref(props.systemPrompt);

        // Sync props to local state
        watch(() => props.apiKey, (newVal) => {
            localApiKey.value = newVal;
        });

        watch(() => props.licenseKey, (newVal) => {
            localLicenseKey.value = newVal;
        });

        watch(() => props.systemPrompt, (newVal) => {
            localSystemPrompt.value = newVal;
        });

        // Emit changes
        watch(localApiKey, (newVal) => {
            emit('update:apiKey', newVal);
        });

        watch(localLicenseKey, (newVal) => {
            emit('update:licenseKey', newVal);
        });

        watch(localSystemPrompt, (newVal) => {
            emit('update:systemPrompt', newVal);
        });

        // Handle dialog open/close
        watch(() => props.isOpen, (isOpen) => {
            if (dialogRef.value) {
                if (isOpen) {
                    dialogRef.value.showModal();
                } else {
                    dialogRef.value.close();
                }
            }
        });

        function handleBackdropClick(event) {
            if (event.target === dialogRef.value) {
                emit('close');
            }
        }

        onMounted(() => {
            if (props.isOpen && dialogRef.value) {
                dialogRef.value.showModal();
            }
        });

        return {
            dialogRef,
            localApiKey,
            localLicenseKey,
            localSystemPrompt,
            handleBackdropClick
        };
    },
    template: `
        <dialog
            ref="dialogRef"
            class="settings-dialog"
            @click="handleBackdropClick"
        >
            <h3
                style="
                    margin: 0 0 20px 0;
                    color: var(--neon-primary);
                    font-family: 'Share Tech Mono', monospace;
                    font-size: 14px;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                "
            >
                Settings
            </h3>
            <label for="apiKey">OpenAI API Key</label>
            <input
                type="password"
                id="apiKey"
                placeholder="sk-..."
                autocomplete="off"
                v-model="localApiKey"
            />
            <p class="settings-note">
                Your API key is stored locally and never shared.
            </p>

            <label for="licenseKey" style="margin-top: 12px">License Key</label>
            <input
                type="text"
                id="licenseKey"
                placeholder="Enter license key..."
                autocomplete="off"
                v-model="localLicenseKey"
            />
            <p class="settings-note" :style="{ color: licenseStatusColor }">
                {{ licenseStatus }}
            </p>

            <label for="systemPrompt" style="margin-top: 12px">System Prompt</label>
            <textarea
                id="systemPrompt"
                rows="8"
                class="system-prompt-textarea"
                v-model="localSystemPrompt"
            ></textarea>
            <p class="settings-note">
                Edits reset when you switch channels or restart.
            </p>
        </dialog>
    `
};

module.exports = { SettingsDialog };
