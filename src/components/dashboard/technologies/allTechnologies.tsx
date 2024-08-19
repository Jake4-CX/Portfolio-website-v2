import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, SortingState, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import EditTechnologyModal from "./editTechnology";
import { Badge } from "@/components/ui/badge";
import DeleteTechnologyModal from "./deleteTechnology";

interface TechnologiesTableComponentProps {
  technologies: Technology[] | undefined
}

export const columns: ColumnDef<Technology>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'technologyName',
    header: 'Technology Name',
  },
  {
    accessorKey: 'technologyImage',
    header: 'Technology Image',
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <img src={row.original.technologyImage ?? ""} alt={row.original.technologyName} className="w-8 h-8 rounded-full" />
      </div>
    )
  },
  {
    accessorKey: 'technologyType',
    header: 'Technology Type',
    cell: ({ row }) => (
      <Badge variant={"default"} className="capitalize">{row.original.technologyType.toLowerCase()}</Badge>
    )
  },
  {
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <EditTechnologyModal technology={row.original} />
        <DeleteTechnologyModal technology={row.original} />
      </div>
    )
  }
]

const AllTechnologiesComponent: React.FC<TechnologiesTableComponentProps> = ({ technologies }) => {

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'id',
      desc: false
    }
  ])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  })

  const table = useReactTable({
    data: technologies || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination
    }
  })

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {technologies !== undefined || table.getRowModel().rows.length ? (
            table.getRowModel().rows.length !== 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No technologies found
                </TableCell>
              </TableRow>
            )
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                <RefreshCw className="animate-spin w-6 h-6" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  )
}

export default AllTechnologiesComponent;