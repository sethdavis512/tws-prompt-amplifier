const { ref, watch } = require('vue');

function useSettings() {
    const apiKey = ref(localStorage.getItem('openai_api_key') || '');
    const licenseKey = ref(localStorage.getItem('license_key') || '');

    // Persist API key changes
    watch(apiKey, (newValue) => {
        localStorage.setItem('openai_api_key', newValue.trim());
    });

    // Persist license key changes
    watch(licenseKey, (newValue) => {
        localStorage.setItem('license_key', newValue.trim());
    });

    return {
        apiKey,
        licenseKey
    };
}

module.exports = { useSettings };
