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

export function isValidDate(date) {
    const dateFormat = new Date(date);
    //check if date after now return false otherwise return true
    return dateFormat > new Date();
}

export function calculateDifference(datePickerValue) {
    const selectedDate = new Date(datePickerValue);
    const currentDate = new Date();
    let diff = Math.abs(selectedDate - currentDate);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);

    const seconds = Math.floor(diff / 1000);

    const formattedString = `You will post in ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`;

    return formattedString;
}

