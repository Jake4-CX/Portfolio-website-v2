import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, SortingState, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { Images, RefreshCw } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import EditProjectModal from "./editProject";
import DeleteProjectModal from "./deleteProject";

interface AllProjectsComponentProps {
  projects: Project[] | undefined
}

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'projectName',
    header: 'Project Name',
  },
  {
    accessorKey: 'projectDescription',
    header: 'Project Description',
    cell: ({ row }) => (
      <span className="max-w-[300px] line-clamp-3">{row.original.projectDescription}</span>
    )
  },
  {
    accessorKey: 'isFeatured',
    header: 'Featured',
    cell: ({ row }) => (
      <Badge variant={row.original.isFeatured ? "default" : "destructive"}>
        {row.original.isFeatured ? "True" : "False"}
      </Badge>
    )
  },
  {
    header: 'Duration Date', // based on startDate and endDate - (display in format: "4th [3 LETTER MONTH] 21 - 21st [3 LETTER MONTH] 23 (days)") - use Moment
    cell: ({ row }) => (
      <>
        <span className="text-xs">
          {`${moment(row.original.startDate).format("Do MMM YY")} - ${moment(row.original.endDate).format("Do MMM YY")} (${moment(row.original.endDate).diff(row.original.startDate, 'days')} days)`}
        </span>
      </>
    )
  },
  {
    header: 'Images',
    cell: ({ row }) => (
      <div className="flex flex-row items-center justify-center space-x-3">
        <Images className="w-[1.25rem] h-[1.25rem]" />
        <span>{row.original.projectImages?.length}</span>
      </div>
    )
  },
  {
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <EditProjectModal project={row.original} />
        <DeleteProjectModal project={row.original} />
      </div>
    )
  }
]

const AllProjectsComponent: React.FC<AllProjectsComponentProps> = ({ projects }) => {

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
    data: projects || [],
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
          {projects !== undefined || table.getRowModel().rows.length ? (
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
                  No projects found
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

export default AllProjectsComponent;