const isValidCustomDate = (dateStr) => {
    if (typeof dateStr !== 'string') return false
  
    // Check format: YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!regex.test(dateStr)) return false
  
    // Check if valid date
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return false
  
    // Ensure the parsed date matches the input (to catch 2025-02-30)
    const [yyyy, mm, dd] = dateStr.split('-').map(Number)
    return (
      date.getUTCFullYear() === yyyy &&
      date.getUTCMonth() + 1 === mm &&
      date.getUTCDate() === dd
    )
}

module.exports = {
    isValidCustomDate
}
  