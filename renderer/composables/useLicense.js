const { ref } = require('vue');

const POLAR_ORG_ID = 'c148dccf-e2cb-4041-9b73-e0f3e4410b56';

function useLicense() {
    const isLicenseValid = ref(false);
    const licenseStatus = ref('Enter your license key to unlock features.');
    const licenseStatusColor = ref('var(--text-gray)');
    const isValidating = ref(false);

    async function validateLicense(licenseKey) {
        if (!licenseKey || !licenseKey.trim()) {
            isLicenseValid.value = false;
            licenseStatus.value = 'Enter your license key to unlock features.';
            licenseStatusColor.value = 'var(--text-gray)';
            return { valid: false };
        }

        isValidating.value = true;
        licenseStatus.value = 'Validating license...';
        licenseStatusColor.value = 'var(--text-gray)';

        try {
            const response = await fetch(
                'https://api.polar.sh/v1/customer-portal/license-keys/validate',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        key: licenseKey,
                        organization_id: POLAR_ORG_ID,
                        server: 'sandbox'
                    })
                }
            );

            if (!response.ok) {
                if (response.status === 404) {
                    isLicenseValid.value = false;
                    licenseStatus.value = 'Invalid license key.';
                    licenseStatusColor.value = 'var(--signal-red)';
                    return { valid: false, error: 'Invalid license key' };
                }
                throw new Error(`Validation failed: ${response.status}`);
            }

            const data = await response.json();

            const isValid =
                data.status === 'granted' &&
                (!data.expires_at || new Date(data.expires_at) > new Date());

            isLicenseValid.value = isValid;

            if (isValid) {
                const expiryText = data.expires_at
                    ? ` Expires: ${new Date(data.expires_at).toLocaleDateString()}`
                    : ' (Lifetime)';
                licenseStatus.value = `✓ Valid license.${expiryText}`;
                licenseStatusColor.value = 'var(--neon-primary)';
            } else {
                licenseStatus.value = 'License expired or invalid.';
                licenseStatusColor.value = 'var(--signal-red)';
            }

            return {
                valid: isValid,
                status: data.status,
                expiresAt: data.expires_at,
                usage: data.usage,
                limitUsage: data.limit_usage
            };
        } catch (error) {
            console.error('License validation error:', error);
            isLicenseValid.value = false;
            licenseStatus.value = error.message || 'Validation failed.';
            licenseStatusColor.value = 'var(--signal-red)';
            return { valid: false, error: error.message };
        } finally {
            isValidating.value = false;
        }
    }

    return {
        isLicenseValid,
        licenseStatus,
        licenseStatusColor,
        isValidating,
        validateLicense
    };
}

module.exports = { useLicense };
