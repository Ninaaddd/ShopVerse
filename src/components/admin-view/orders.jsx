import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const [sortConfig, setSortConfig] = useState({
    key: "orderDate",
    direction: "desc", // Default to newest first
  });
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  // console.log(orderDetails, "orderList");

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sort the order list
  const getSortedOrders = (orders) => {
    if (!orders || orders.length === 0) return [];

    const sortedList = [...orders].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case "orderId":
          aValue = a._id;
          bValue = b._id;
          break;
        case "orderDate":
          aValue = new Date(a.orderDate);
          bValue = new Date(b.orderDate);
          break;
        case "orderStatus":
          aValue = a.orderStatus;
          bValue = b.orderStatus;
          break;
        case "totalAmount":
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sortedList;
  };


  // Render sort icon
  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4 inline" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4 inline" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 inline" />
    );
  };

  const filteredOrders = orderList?.filter((order) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    return (
      order._id.toLowerCase().includes(term) ||
      order.orderStatus.toLowerCase().includes(term)
    );
  });

  const sortedOrders = getSortedOrders(filteredOrders);

  return (
  <Card className="rounded-lg border bg-white shadow-sm">
    <CardHeader className="border-b">
      <CardTitle className="text-2xl font-semibold">All Orders</CardTitle>
    </CardHeader>

    <CardContent className="p-6">
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search by Order ID or Status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-b transition-colors hover:bg-gray-50">
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("orderId")}
            >
              <span className="inline-flex items-center">
                Order ID
                <SortIcon columnKey="orderId"/>
              </span>
            </TableHead>

            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("orderDate")}
            >
              <span className="inline-flex items-center">
                Order Date
                <SortIcon columnKey="orderDate" />
              </span>
            </TableHead>

            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("orderStatus")}
            >
              <span className="inline-flex items-center">
                Order Status
                <SortIcon columnKey="orderStatus" />
              </span>
            </TableHead>

            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("totalAmount")}
            >
              <span className="inline-flex items-center">
                Order Price
                <SortIcon columnKey="totalAmount" />
              </span>
            </TableHead>


            <TableHead>
              <span className="sr-only">Details</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedOrders && sortedOrders.length > 0
            ? sortedOrders.map((orderItem) => (
                <TableRow
                  key={orderItem?._id}
                  className="border-b transition-colors hover:bg-gray-50"
                >
                  <TableCell>{orderItem?._id}</TableCell>

                  <TableCell>
                    {orderItem?.orderDate.split("T")[0]}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`py-1 px-3 text-white ${
                        orderItem?.orderStatus === "confirmed"
                          ? "bg-green-500"
                          : orderItem?.orderStatus === "rejected"
                          ? "bg-red-600"
                          : "bg-black"
                      }`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </TableCell>

                  <TableCell>${orderItem?.totalAmount}</TableCell>

                  <TableCell>
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        setOpenDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button
                        className="bg-black text-white hover:bg-gray-800"
                        onClick={() =>
                          handleFetchOrderDetails(orderItem?._id)
                        }
                      >
                        View Details
                      </Button>

                      <AdminOrderDetailsView
                        orderDetails={orderDetails}
                      />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);
}
export default AdminOrdersView;
