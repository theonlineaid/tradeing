import {useTable} from 'react-table'

function MyTable({columns, data, handleRowClick, rowClasses = '', rowNumber = 100,}) {
  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable({
    columns,
    data,
  })

  return (
    <>
      <table {...getTableProps()} className='tw-w-full dark:tw-bg-dark-300'>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className='tw-bg-gray-200 dark:tw-bg-dark-400'>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className='last:tw-text-right tw-text-gray-600 dark:tw-text-dark-gray dark:tw-font-semibold tw-px-2 tw-py-1'
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.slice(0, rowNumber).map((row) => {
            prepareRow(row)
            return (
              <tr
                {...row.getRowProps()}
                onClick={(e) => handleRowClick.onClick(e, row)}
                onDoubleClick={(e) => handleRowClick.onDoubleClick(e, row)}
                onContextMenu={(e) => handleRowClick.onContextMenu(e, row)}
                className={`${rowClasses} tw-cursor-pointer tw-border-b tw-border-b-white dark:tw-border-b-dark-400 last:tw-border-b-0 tw-select-none`}
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className='last:tw-text-right tw-px-[2%] tw-py-1 tw-text-gray-800 dark:tw-text-gray-300 dark:tw-text-lg tw-font-semibold'
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
{/* 
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>{table.getRowModel().rows.length} Rows</div>
      <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre> */}
    </>
  )
}

export default MyTable
