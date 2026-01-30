const { ref, watch, onMounted, onUnmounted } = require('vue');
const { ipcRenderer } = require('electron');

// Components
const { TitleBar } = require('./components/TitleBar');
const { ChannelSelector } = require('./components/ChannelSelector');
const { SettingsDialog } = require('./components/SettingsDialog');
const { HistoryDialog } = require('./components/HistoryDialog');
const { InputSection } = require('./components/InputSection');
const { AmplifyButton } = require('./components/AmplifyButton');
const { OutputSection } = require('./components/OutputSection');
const { SaveNotification } = require('./components/SaveNotification');

// Composables
const { useChannels } = require('./composables/useChannels');
const { useSettings } = require('./composables/useSettings');
const { useLicense } = require('./composables/useLicense');
const { useHistory } = require('./composables/useHistory');
const { useAmplify } = require('./composables/useAmplify');
const { useNotification } = require('./composables/useNotification');

const App = {
    name: 'App',
    components: {
        TitleBar,
        ChannelSelector,
        SettingsDialog,
        HistoryDialog,
        InputSection,
        AmplifyButton,
        OutputSection,
        SaveNotification
    },
    setup() {
        // Dialog states
        const isSettingsOpen = ref(false);
        const isHistoryOpen = ref(false);

        // Input state
        const inputPrompt = ref('');
        const inputRef = ref(null);

        // Composables
        const {
            currentChannel,
            systemPrompt,
            channelList,
            selectChannel
        } = useChannels();

        const { apiKey, licenseKey } = useSettings();

        const {
            isLicenseValid,
            licenseStatus,
            licenseStatusColor,
            validateLicense
        } = useLicense();

        const {
            history,
            addToHistory,
            getHistoryItem
        } = useHistory();

        const {
            isProcessing,
            amplifiedText,
            error,
            amplifyPrompt,
            setOutput
        } = useAmplify();

        const {
            message: notificationMessage,
            isError: notificationIsError,
            isVisible: notificationIsVisible,
            showSuccess,
            showError
        } = useNotification();

        // Validate license on startup and when license key changes
        onMounted(async () => {
            if (licenseKey.value) {
                await validateLicense(licenseKey.value);
            }
        });

        watch(licenseKey, async (newKey) => {
            await validateLicense(newKey);
        });

        // Event handlers
        function handleClose() {
            ipcRenderer.send('hide-window');
        }

        function handleToggleSettings() {
            isSettingsOpen.value = !isSettingsOpen.value;
        }

        function handleToggleHistory() {
            isHistoryOpen.value = !isHistoryOpen.value;
        }

        function handleChannelSelect(channelId) {
            selectChannel(channelId);
        }

        function handleHistorySelect(index) {
            const item = getHistoryItem(index);
            if (item) {
                inputPrompt.value = item.input;
                setOutput(item.output);
                isHistoryOpen.value = false;
            }
        }

        async function handleAmplify() {
            if (!apiKey.value) {
                error.value = 'Please enter your OpenAI API key in settings.';
                return;
            }

            if (!isLicenseValid.value) {
                error.value = 'Valid license required. Please enter your license key in settings.';
                return;
            }

            if (!inputPrompt.value.trim()) {
                // Focus the input
                return;
            }

            const result = await amplifyPrompt(
                inputPrompt.value,
                systemPrompt.value,
                apiKey.value
            );

            if (result.success) {
                addToHistory(inputPrompt.value, result.output);
            }
        }

        function handleSaveSuccess(filePath) {
            showSuccess('Saved to: ' + filePath);
        }

        function handleSaveError(errorMsg) {
            showError('Error: ' + errorMsg);
        }

        // Keyboard shortcuts
        function handleKeydown(event) {
            // Escape to close dialogs or window
            if (event.key === 'Escape') {
                if (isSettingsOpen.value) {
                    isSettingsOpen.value = false;
                    return;
                }
                if (isHistoryOpen.value) {
                    isHistoryOpen.value = false;
                    return;
                }
                ipcRenderer.send('hide-window');
            }

            // Ctrl/Cmd + Enter to amplify
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                handleAmplify();
            }
        }

        // Focus input on window focus
        function handleWindowFocus() {
            if (!isSettingsOpen.value && !isHistoryOpen.value) {
                const textarea = document.querySelector('.input-section textarea');
                if (textarea) {
                    textarea.focus();
                }
            }
        }

        onMounted(() => {
            document.addEventListener('keydown', handleKeydown);
            window.addEventListener('focus', handleWindowFocus);
        });

        onUnmounted(() => {
            document.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('focus', handleWindowFocus);
        });

        return {
            // Dialog states
            isSettingsOpen,
            isHistoryOpen,

            // Input
            inputPrompt,

            // Channel
            currentChannel,
            systemPrompt,
            channelList,

            // Settings
            apiKey,
            licenseKey,

            // License
            licenseStatus,
            licenseStatusColor,

            // History
            history,

            // Amplify
            isProcessing,
            amplifiedText,
            error,

            // Notification
            notificationMessage,
            notificationIsError,
            notificationIsVisible,

            // Handlers
            handleClose,
            handleToggleSettings,
            handleToggleHistory,
            handleChannelSelect,
            handleHistorySelect,
            handleAmplify,
            handleSaveSuccess,
            handleSaveError
        };
    },
    template: `
        <div class="container">
            <TitleBar
                @toggle-settings="handleToggleSettings"
                @close="handleClose"
            />

            <ChannelSelector
                :channels="channelList"
                :current-channel="currentChannel"
                @select="handleChannelSelect"
            />

            <SettingsDialog
                :is-open="isSettingsOpen"
                v-model:api-key="apiKey"
                v-model:license-key="licenseKey"
                v-model:system-prompt="systemPrompt"
                :license-status="licenseStatus"
                :license-status-color="licenseStatusColor"
                @close="isSettingsOpen = false"
            />

            <InputSection
                v-model="inputPrompt"
                @toggle-history="handleToggleHistory"
            />

            <HistoryDialog
                :is-open="isHistoryOpen"
                :history="history"
                @select="handleHistorySelect"
                @close="isHistoryOpen = false"
            />

            <AmplifyButton
                :is-processing="isProcessing"
                @click="handleAmplify"
            />

            <OutputSection
                :output="amplifiedText"
                :error="error"
                :is-processing="isProcessing"
                @save-success="handleSaveSuccess"
                @save-error="handleSaveError"
            />

            <SaveNotification
                :message="notificationMessage"
                :is-error="notificationIsError"
                :is-visible="notificationIsVisible"
            />
        </div>
    `
};

module.exports = { App };
