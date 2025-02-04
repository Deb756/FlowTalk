export const timeAgo = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp); // Convert ISO string to Date object

    const diffInSeconds = Math.floor((now - messageTime) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else {
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
};

// Example Usage:
// console.log(timeAgo("2025-02-02T17:01:47.098418")); // Output: "2 hours ago" (if current time is 19:01)
