const { ref } = require('vue');

function useNotification() {
    const message = ref('');
    const isError = ref(false);
    const isVisible = ref(false);

    let timeoutId = null;

    function show(text, error = false, duration = 3000) {
        // Clear any existing timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        message.value = text;
        isError.value = error;
        isVisible.value = true;

        timeoutId = setTimeout(() => {
            hide();
        }, duration);
    }

    function hide() {
        isVisible.value = false;
        message.value = '';
        isError.value = false;
    }

    function showSuccess(text, duration = 3000) {
        show(text, false, duration);
    }

    function showError(text, duration = 3000) {
        show(text, true, duration);
    }

    return {
        message,
        isError,
        isVisible,
        show,
        hide,
        showSuccess,
        showError
    };
}

module.exports = { useNotification };
