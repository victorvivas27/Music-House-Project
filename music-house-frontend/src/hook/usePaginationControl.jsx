import { useEffect, useMemo, useState } from "react"

export const usePaginationControl = (totalElements) => {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
  
    // Cálculo total de páginas
    const totalPages = useMemo(() => {
      return Math.ceil((totalElements || 0) / rowsPerPage)
    }, [totalElements, rowsPerPage])
  
    // Corrige automáticamente el page si se pasa
    useEffect(() => {
      if (page >= totalPages && totalPages > 0) {
        setPage(totalPages - 1)
      }
      if (totalPages === 0 && page > 0) {
        setPage(0)
      }
    }, [page, totalPages])
  
    // Siempre usá este en <TablePagination>
    const safePage = useMemo(() => {
      return Math.min(page, Math.max(totalPages - 1, 0))
    }, [page, totalPages])
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage)
    }
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10))
      setPage(0)
    }
  
    return {
      page,
      rowsPerPage,
      setPage,
      setRowsPerPage,
      handleChangePage,
      handleChangeRowsPerPage,
      safePage
    }
  }