public class N260526_2 {
        public static void main(String[] args) {
            Member member = new Member("홍길동", "hong@example.com", "1234");

            member.printInfo();

            member.changePassword("0000", "abcd");
            member.changePassword("1234", "abcd");
        }
    }

    class Member {
        private String name;
        private String email;
        private String password;

        public Member(String name, String email, String password) {
            if (name == null || name.isBlank()) {
                throw new IllegalArgumentException("이름은 비워 둘 수 없습니다.");
            }

            if (email == null || !email.contains("@")) {
                throw new IllegalArgumentException("올바른 이메일 형식이 아닙니다.");
            }

            if (password == null || password.length() < 4) {
                throw new IllegalArgumentException("비밀번호는 4자 이상이어야 합니다.");
            }

            this.name = name;
            this.email = email;
            this.password = password;
        }

        public void printInfo() {
            System.out.println("이름: " + name);
            System.out.println("이메일: " + email);
        }

        public void changePassword(String oldPassword, String newPassword) {
            if (!password.equals(oldPassword)) {
                System.out.println("기존 비밀번호가 일치하지 않습니다.");
                return;
            }

            if (newPassword == null || newPassword.length() < 4) {
                System.out.println("새 비밀번호는 4자 이상이어야 합니다.");
                return;
            }

            password = newPassword;
            System.out.println("비밀번호가 변경되었습니다.");
        }
    }