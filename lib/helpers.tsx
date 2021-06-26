export function getRandomColor() {
    const c = Math.floor(Math.random() * 16777215);
    return "#" + c.toString(16).padStart(6, "0");
}

export function toPx(num: number) {
    return `${num}px`;
}

export function toPercentage(num: number) {
    return `${num * 100}%`;
}
