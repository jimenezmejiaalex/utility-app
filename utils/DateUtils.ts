export const getDate = (date: string) => {
    return new Date(date)
        .toISOString()
        .substring(
            0,
            new Date(date)
                .toISOString()
                .indexOf('T') + 6
        )
}