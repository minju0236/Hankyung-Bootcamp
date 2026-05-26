public class N260526_1 {

    public static void main(String[] args) {
        Product product = new Product("키보드", 50000);

        product.printProduct();
    }
}

class Product {
    private String name;
    private int price;

    public Product(String name, int price) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("상품명은 비워 둘 수 없습니다.");
        }

        if (price <= 0) {
            throw new IllegalArgumentException("가격은 0보다 커야 합니다.");
        }

        this.name = name;
        this.price = price;
    }

    public void printProduct() {
        System.out.println("상품명: " + name);
        System.out.println("가격: " + price);
    }
}