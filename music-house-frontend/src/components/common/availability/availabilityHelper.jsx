import dayjs from 'dayjs'

export const isAvailableDate = (day, availableDates) => {
  return !availableDates?.includes(dayjs(day).format('YYYY-MM-DD')) // 🔹 Deshabilita solo si YA está en availableDates
}
