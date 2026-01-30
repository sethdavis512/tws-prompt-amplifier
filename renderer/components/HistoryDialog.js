const { ref, watch, onMounted } = require('vue');

const HistoryDialog = {
    name: 'HistoryDialog',
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        history: {
            type: Array,
            default: () => []
        }
    },
    emits: ['select', 'close'],
    setup(props, { emit }) {
        const dialogRef = ref(null);

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

        function selectItem(index) {
            emit('select', index);
        }

        function truncate(text, maxLength = 80) {
            if (!text) return '';
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        }

        onMounted(() => {
            if (props.isOpen && dialogRef.value) {
                dialogRef.value.showModal();
            }
        });

        return {
            dialogRef,
            handleBackdropClick,
            selectItem,
            truncate
        };
    },
    template: `
        <dialog
            ref="dialogRef"
            class="history-dialog"
            @click="handleBackdropClick"
        >
            <h3
                style="
                    margin: 0 0 16px 0;
                    color: var(--neon-primary);
                    font-family: 'Share Tech Mono', monospace;
                    font-size: 14px;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                "
            >
                Prompt History
            </h3>
            <div class="history-panel">
                <div v-if="history.length === 0" class="history-empty">
                    No history yet
                </div>
                <div
                    v-for="(item, index) in history"
                    :key="index"
                    class="history-item"
                    @click="selectItem(index)"
                >
                    <span class="history-item-text">{{ truncate(item.input) }}</span>
                </div>
            </div>
        </dialog>
    `
};

module.exports = { HistoryDialog };
