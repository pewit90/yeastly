export function toBoolean(value: unknown): boolean {
    return !!value;
}

export function toNumberOrUndefined(value: unknown): number | undefined {
    return value ? Number(value) : undefined;
}

export function toDateOrUndefined(isoDate: unknown): Date | undefined {
    return (isoDate && typeof isoDate === 'string') ? new Date(isoDate) : undefined;
}