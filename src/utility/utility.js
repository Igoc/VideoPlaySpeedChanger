export default class Utility {
    static convertBytesToSize(bytes) {
        if (bytes >= 1073741824) {
            return Math.floor(bytes / 1073741824) + ' GB';
        }

        if (bytes >= 1048576) {
            return Math.floor(bytes / 1048576) + ' MB';
        }

        if (bytes >= 1024) {
            return Math.floor(bytes / 1024) + ' KB';
        }

        return bytes + ' B';
    }
}