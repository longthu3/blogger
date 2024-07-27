export function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        return interval === 1 ? "1 năm trước" : `${interval} năm trước`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return interval === 1 ? "1 tháng trước" : `${interval} tháng trước`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return interval === 1 ? "1 ngày trước" : `${interval} ngày trước`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return interval === 1 ? "1 giờ trước" : `${interval} giờ trước`;
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval === 1 ? "1 phút trước" : `${interval} phút trước`;
    }
    return seconds <= 1 ? "bây giờ" : `${seconds} giây trước`;
}

export function getDMY(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
