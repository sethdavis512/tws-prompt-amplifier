const { ref } = require('vue');
const OpenAI = require('openai');

function useAmplify() {
    const isProcessing = ref(false);
    const amplifiedText = ref('');
    const error = ref('');

    async function amplifyPrompt(inputPrompt, systemPrompt, apiKey) {
        // Reset state
        error.value = '';

        if (!apiKey) {
            error.value = 'Please enter your OpenAI API key in settings.';
            return { success: false, error: error.value };
        }

        if (!inputPrompt || !inputPrompt.trim()) {
            return { success: false, error: 'Please enter a prompt.' };
        }

        isProcessing.value = true;

        try {
            const openai = new OpenAI({
                apiKey,
                dangerouslyAllowBrowser: true
            });

            const response = await openai.chat.completions.create({
                model: 'gpt-5.2',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: `Please improve this prompt:\n\n${inputPrompt}`
                    }
                ],
                temperature: 0.7,
                max_completion_tokens: 1500
            });

            amplifiedText.value = response.choices[0].message.content;
            return { success: true, output: amplifiedText.value };
        } catch (err) {
            console.error('Amplify error:', err);

            let errorMessage = 'An error occurred. Please try again.';

            if (err.message.includes('API key')) {
                errorMessage = 'Invalid API key. Please check your OpenAI API key in settings.';
            } else if (err.message.includes('rate limit')) {
                errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
            } else if (err.message.includes('network')) {
                errorMessage = 'Network error. Please check your internet connection.';
            }

            error.value = errorMessage;
            return { success: false, error: errorMessage };
        } finally {
            isProcessing.value = false;
        }
    }

    function clearOutput() {
        amplifiedText.value = '';
        error.value = '';
    }

    function setOutput(text) {
        amplifiedText.value = text;
        error.value = '';
    }

    return {
        isProcessing,
        amplifiedText,
        error,
        amplifyPrompt,
        clearOutput,
        setOutput
    };
}

module.exports = { useAmplify };
