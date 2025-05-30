import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows }: { rows: number }) {
  return (
    <div className="w-full mt-2">
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr>
            {/* Adjust the width classes as needed */}
            <th className="px-4 py-4 text-left w-1/5">
              <Skeleton className="h-4 w-full" />
            </th>
            <th className="px-4 py-4 text-left w-1/5">
              <Skeleton className="h-4 w-full" />
            </th>
            <th className="px-4 py-4 text-left w-1/5">
              <Skeleton className="h-4 w-full" />
            </th>
            <th className="px-4 py-4 text-left w-1/5">
              <Skeleton className="h-4 w-full" />
            </th>
            <th className="px-4 py-4 text-right w-1/5">
              <Skeleton className="h-4 w-2/5 ml-auto" />
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, index) => (
            <tr key={index}>
              <td className="px-4 py-2">
                <Skeleton className="h-6 rounded-lg w-5/5" />
              </td>
              <td className="px-4 py-2">
                <Skeleton className="h-6 rounded-lg w-4/5" />
              </td>
              <td className="px-4 py-2">
                <Skeleton className="h-6 rounded-lg w-3/4" />
              </td>
              <td className="px-4 py-2">
                <Skeleton className="h-6 rounded-lg w-3/4" />
              </td>
              <td className="px-4 py-2">
                <Skeleton className="h-6 rounded-lg w-2/5 ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableSkeleton;
