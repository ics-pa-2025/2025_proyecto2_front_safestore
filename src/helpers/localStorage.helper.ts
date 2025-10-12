export function saveToLocalStorage<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error al guardar ${key} en localStorage`, error);
    }
}

export function getFromLocalStorage<T>(key: string): T | null {
    try {
        const item = localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
        console.error(`Error al obtener ${key} de localStorage`, error);
        return null;
    }
}

export function removeFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
}
