const { ref, computed } = require('vue');

const MAX_HISTORY_ITEMS = 5;

function useHistory() {
    const history = ref(loadHistoryFromStorage());

    function loadHistoryFromStorage() {
        try {
            return JSON.parse(localStorage.getItem('prompt_history') || '[]');
        } catch {
            return [];
        }
    }

    function saveHistoryToStorage() {
        localStorage.setItem(
            'prompt_history',
            JSON.stringify(history.value.slice(0, MAX_HISTORY_ITEMS))
        );
    }

    function addToHistory(input, output) {
        history.value.unshift({
            input,
            output,
            timestamp: Date.now()
        });
        // Keep only the last MAX_HISTORY_ITEMS
        history.value = history.value.slice(0, MAX_HISTORY_ITEMS);
        saveHistoryToStorage();
    }

    function getHistoryItem(index) {
        return history.value[index] || null;
    }

    function clearHistory() {
        history.value = [];
        saveHistoryToStorage();
    }

    const isEmpty = computed(() => history.value.length === 0);

    function truncateText(text, maxLength = 80) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    return {
        history,
        isEmpty,
        addToHistory,
        getHistoryItem,
        clearHistory,
        truncateText
    };
}

module.exports = { useHistory };
