export function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        return interval === 1 ? "1 year ago" : `${interval} years ago`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return interval === 1 ? "1 month ago" : `${interval} months ago`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return interval === 1 ? "1 day ago" : `${interval} days ago`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
    }
    return seconds <= 1 ? "just now" : `${seconds} seconds ago`;
}

export function getDMY(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
