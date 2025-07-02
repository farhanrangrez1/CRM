import CryptoJS from 'crypto-js';

const secretKey = "jhgbdvdbdjvbdjb^%%jhgdvgdjvhdjvhdhdnvfv65g74rf87r4b"; // must match backend

export const decryptToken = (token) => {
    try {
        // Generate the key from the secret key, same as backend
        const key = CryptoJS.SHA256(secretKey);
        
        // Decrypt the token using AES-ECB (No IV required)
        const decrypted = CryptoJS.AES.decrypt(token, key, {
            mode: CryptoJS.mode.ECB, // Using ECB mode
            padding: CryptoJS.pad.Pkcs7,
        });

        // Convert decrypted data to UTF-8 string
        const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
        // console.log("decryptedString", decryptedString);
        return decryptedString;
    } catch (error) {
        console.error("Failed to decrypt token:", error);
        return null;
    }
};
