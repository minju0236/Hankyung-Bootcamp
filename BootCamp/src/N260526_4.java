public class N260526_4 {
    public static void main(String[] args) {
        Order order = new Order("노트북", 1500000, 2);

        order.printOrder();
        System.out.println("총 주문 금액: " + order.calculateTotalPrice());
    }
}

class Order {
    private String productName;
    private int price;
    private int quantity;

    public Order(String productName, int price, int quantity) {
        if (productName == null || productName.isBlank()) {
            throw new IllegalArgumentException("상품명은 비워 둘 수 없습니다.");
        }

        if (price <= 0) {
            throw new IllegalArgumentException("가격은 0보다 커야 합니다.");
        }

        if (quantity <= 0) {
            throw new IllegalArgumentException("수량은 0보다 커야 합니다.");
        }

        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
    }

    public int calculateTotalPrice() {
        return price * quantity;
    }

    public void printOrder() {
        System.out.println("상품명: " + productName);
        System.out.println("가격: " + price);
        System.out.println("수량: " + quantity);
    }
}