const formatDay = function (data: Date) {
    const day = data || new Date();
    const year = day.getFullYear().toString().padStart(2, "0");
    const month = (day.getMonth() + 1).toString().padStart(2, "0");
    const date = day.getDate().toString().padStart(2, "0");
    return `${year}${month}${date}`;
};
const formatDay2 = function (data: Date) {
    const day = data || new Date();
    const year = day.getFullYear().toString().padStart(2, "0");
    const month = (day.getMonth() + 1).toString().padStart(2, "0");
    const date = day.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${date}`;
};
const formatTime = function (data: Date) {
    const time = data || new Date();
    const hour = time.getHours().toString().padStart(2, "0");
    const minute = time.getMinutes().toString().padStart(2, "0");
    const second = time.getSeconds().toString().padStart(2, "0");
    return `${hour}:${minute}:${second}`;
};

const formatDayTime = function (data: Date) {
    const day = data || new Date();
    const year = day.getFullYear().toString().padStart(2, "0");
    const month = (day.getMonth() + 1).toString().padStart(2, "0");
    const date = day.getDate().toString().padStart(2, "0");
    const time = data || new Date();
    const hour = time.getHours().toString().padStart(2, "0");
    const minute = time.getMinutes().toString().padStart(2, "0");
    const second = time.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
};
export default {
    formatDay,
    formatDay2,
    formatTime,
    formatDayTime,
};
