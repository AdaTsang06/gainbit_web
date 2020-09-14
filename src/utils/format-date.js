function padNum(num, len = 2) {
  const str = String(num);
  let result = '';
  for (let i = 0; i < len - str.length; i += 1) {
    result += '0';
  }
  return result + str;
}

// todo this func should be confiurable in the futher like this: YYYY-MM-DD HH:MM
export default function formatDate(strTime, type) {
  const date = new Date(strTime);
  return type === 1
    ? `${date.getFullYear()}/${padNum(date.getMonth() + 1)}/${padNum(
        date.getDate()
      )} ${padNum(date.getHours())}:${padNum(date.getMinutes())}:${padNum(
        date.getSeconds()
      )}`
    : `${date.getFullYear()}-${padNum(date.getMonth() + 1)}-${padNum(
        date.getDate()
      )} ${padNum(date.getHours())}:${padNum(date.getMinutes())}:${padNum(
        date.getSeconds()
      )}`;
}

export const formatTimestamp = timestamp => {
  const date = new Date(timestamp);
  return `${padNum(date.getHours())}:${padNum(date.getMinutes())}:${padNum(
    date.getSeconds()
  )}`;
};

export const formatCalendar = (strTime, type) => {
  const date = new Date(strTime);
  return type === 1
    ? `${date.getFullYear()}/${padNum(date.getMonth() + 1)}/${padNum(
        date.getDate()
      )}`
    : `${date.getFullYear()}-${padNum(date.getMonth() + 1)}-${padNum(
        date.getDate()
      )}`;
}