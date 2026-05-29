import { ref } from 'vue'

export const usePaginate = (items = [], pageSize = 10) => {
  const currentPage = ref(1)

  const startIndex = () => (currentPage.value - 1) * pageSize
  const endIndex = () => startIndex() + pageSize

  const pagedItems = () => items.slice(startIndex(), endIndex())

  const nextPage = () => {
    if (endIndex() < items.length) currentPage.value += 1
  }

  const prevPage = () => {
    if (currentPage.value > 1) currentPage.value -= 1
  }

  return {
    currentPage,
    pagedItems,
    nextPage,
    prevPage,
  }
}
