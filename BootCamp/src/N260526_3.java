public class N260526_3 {
        public static void main(String[] args) {
            Account account = new Account("홍길동", 100000);

            account.deposit(30000); // I
            account.withdraw(50000); // I
            account.withdraw(100000); // I

            System.out.println("현재 잔액: " + account.getBalance()); // O
        }
    }

    class Account {
        private String owner;
        private int balance;

        public Account(String owner, int balance) {
            if (owner == null || owner.isBlank()) {
                throw new IllegalArgumentException("예금주는 비워 둘 수 없습니다."); // F
            }

            if (balance < 0) {
                throw new IllegalArgumentException("초기 잔액은 0 이상이어야 합니다."); // F
            }

            this.owner = owner;
            this.balance = balance;
        }

        public void deposit(int amount) {
            if (amount <= 0) {
                System.out.println("입금액은 0보다 커야 합니다."); // F
                return;
            }

            balance += amount;
            System.out.println(amount + "원이 입금되었습니다."); // S
        }

        public void withdraw(int amount) {
            if (amount <= 0) {
                System.out.println("출금액은 0보다 커야 합니다."); // F
                return;
            }

            if (amount > balance) {
                System.out.println("잔액이 부족합니다."); // F
                return;
            }

            balance -= amount;
            System.out.println(amount + "원이 출금되었습니다."); // S
        }

        public int getBalance() {
            return balance;
        }
    }