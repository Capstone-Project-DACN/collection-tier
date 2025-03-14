const groupedData = (batchResult) => {
    const groupedData = batchResult.reduce((acc, data) => {
        const type = data.type || 'Unknown'
        if (!acc[type]) {
            acc[type] = []
        }
        acc[type].push(data)
        return acc
    }, {})

    return groupedData
}

module.exports = {
    groupedData
}
