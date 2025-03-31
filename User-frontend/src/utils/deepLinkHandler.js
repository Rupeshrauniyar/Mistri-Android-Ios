import { App } from '@capacitor/app';
import { useNavigate } from 'react-router-dom';

export const initializeDeepLinks = () => {
    App.addListener('appUrlOpen', async ({ url }) => {
        // Example URL: mistri://reset-password/token/otp/id
        const urlObj = new URL(url);
        const pathSegments = urlObj.pathname.split('/').filter(Boolean);

        if (pathSegments[0] === 'reset-password' && pathSegments.length === 4) {
            const [, , token, otp, id] = pathSegments;
            // Navigate to reset password page with the parameters
            window.location.href = `/reset-password/${token}/${otp}/${id}`;
        }
    });
};

// Function to handle deep link parameters in the ResetPassword component
export const useDeepLinkParams = () => {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const pathSegments = window.location.pathname.split('/').filter(Boolean);

    if (pathSegments[0] === 'reset-password' && pathSegments.length === 4) {
        const [, token, otp, id] = pathSegments;
        return { token, otp, id };
    }

    return null;
}; 