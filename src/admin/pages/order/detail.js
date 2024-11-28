import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";

export function OrderDetailDialog({ isOpen, onClose, orderDetails }) {
  if (!orderDetails) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Details for Order ID: {orderDetails.order.id_od}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Thông tin cơ bản của đơn hàng */}
          <div className="grid grid-cols-2 gap-4">
            <div><strong>Name:</strong> {orderDetails.order.name}</div>
            <div><strong>Email:</strong> {orderDetails.order.email}</div>
            <div><strong>Phone:</strong> {orderDetails.order.phone}</div>
            <div><strong>Address:</strong> {orderDetails.order.address}</div>
            <div><strong>Subtotal:</strong> ${orderDetails.order.subtotal}</div>
            <div><strong>Total Amount:</strong> ${orderDetails.order.totalamount}</div>
            <div><strong>Status:</strong> {orderDetails.order.status}</div>
            <div><strong>Note:</strong> {orderDetails.order.note}</div>
          </div>
          {/* Danh sách sản phẩm */}
          <div>
            <h3 className="text-lg font-semibold">Products</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b py-2 text-center">Product Name</th>
                  <th className="border-b py-2 text-center">Original Price</th>
                  <th className="border-b py-2 text-center">After Discount</th>
                  <th className="border-b py-2 text-center">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.products.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 text-center">{product.namepro}</td>
                    <td className="py-2 text-center">${product.price_ori}</td>
                    <td className="py-2 text-center">${product.price_afvou}</td>
                    <td className="py-2 text-center">{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
