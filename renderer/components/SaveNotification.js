const SaveNotification = {
    name: 'SaveNotification',
    props: {
        message: {
            type: String,
            default: ''
        },
        isError: {
            type: Boolean,
            default: false
        },
        isVisible: {
            type: Boolean,
            default: false
        }
    },
    template: `
        <transition name="notification">
            <div
                v-if="isVisible"
                class="save-notification"
                :class="{ error: isError }"
            >
                {{ message }}
            </div>
        </transition>
    `
};

module.exports = { SaveNotification };
