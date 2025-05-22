import { SortDirection } from "../Types";

export const applyTextPlaceholders = (string: string, keyValuePair: any): string => {
    if (!string) return "";

    let keys = Object.keys(keyValuePair)
    keys = keys.filter((key) => key !== "situational");
    if (keys.length === 0) return "";
    keys.forEach(key => {
        string = string.replace(`{${key}}`, keyValuePair[key])
    })
    if (keyValuePair?.situational) {
        string = string.replace(/\[(.*?)\]/g, (_, value) => value);
    } else {
        string = string.replace(/\[(.*?)\]/g, (_, value) => '');
    }
    return string;
}

export   function sortItems<T>(
    items: T[],
    key: keyof T,
    direction: SortDirection = 'asc'
): T[] {
    // Create a shallow copy to avoid mutating the original array
    const sortedItems = [...items];

    sortedItems.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];

        // Handle null/undefined values consistently (e.g., push them to the end)
        if (valA == null && valB == null) return 0; // Both null/undefined, treat as equal
        if (valA == null) return 1;                // Only A is null/undefined, put it after B
        if (valB == null) return -1;               // Only B is null/undefined, put it after A

        let result = 0;

        // --- Comparison Logic ---

        // Attempt Date comparison first (check if both values can be parsed as dates)
        const isADate = valA instanceof Date || (typeof valA === 'string' && !isNaN(Date.parse(valA)));
        const isBDate = valB instanceof Date || (typeof valB === 'string' && !isNaN(Date.parse(valB)));

        if (isADate && isBDate) {
            // Ensure we are comparing Date objects' time values
            const dateA = valA instanceof Date ? valA : new Date(valA as string);
            const dateB = valB instanceof Date ? valB : new Date(valB as string);
            result = dateA.getTime() - dateB.getTime();
        }
        // Number comparison
        else if (typeof valA === 'number' && typeof valB === 'number') {
            result = valA - valB;
        }
        // String comparison (use natural sorting)
        else if (typeof valA === 'string' && typeof valB === 'string') {
            // Use localeCompare with numeric: true for natural sort order
            // e.g., "Ticket 2" comes before "Ticket 10"
            result = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
            // sensitivity: 'base' ignores case and accents for sorting unless numeric is true,
            // where it helps differentiate based on case if numbers are equal.
            // You could use 'case' if strict case-sensitivity is required always.
        }
        // Fallback for other types or mixed types (treat as equal or add more specific logic)
        else {
            // Optional: Convert to string and compare as a last resort?
            // result = String(valA).localeCompare(String(valB), undefined, { numeric: true, sensitivity: 'base' });
            // Or simply treat incomparable types as equal in this context
            result = 0;
        }

        // Apply direction
        return direction === 'asc' ? result : -result;
    });

    return sortedItems;
}