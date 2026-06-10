INSERT INTO users (email, password_hash, name, role, status)
VALUES
('admin@test.com', '$2y$10$BMNGcZxuNFkCuAjgDaSwR.OvzyJCTmqAXLOf5NbhiRShZ5LLcHHS2', '관리자', 'ADMIN', 'ACTIVE'),
('user@test.com', '$2y$10$BMNGcZxuNFkCuAjgDaSwR.OvzyJCTmqAXLOf5NbhiRShZ5LLcHHS2', '일반사용자', 'USER', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name), role=VALUES(role), status=VALUES(status);

INSERT INTO contracts (customer_name, item_name, quantity, warehouse_name, contract_status, request_note)
VALUES
('대한물류', '유압 밸브', 50, 'A창고', 'REQUESTED', '입고 전 외관 검사 필요'),
('한빛산업', '베어링 세트', 120, 'B창고', 'CONFIRMED', '습기 주의');

INSERT INTO inbounds (contract_id, item_name, quantity, inbound_status, inbound_date)
VALUES
(1, '유압 밸브', 30, 'WAITING', CURDATE()),
(2, '베어링 세트', 80, 'COMPLETED', CURDATE());

INSERT INTO inventories (item_name, warehouse_name, quantity, safety_stock)
VALUES
('유압 밸브', 'A창고', 30, 10),
('베어링 세트', 'B창고', 80, 20);

INSERT INTO outbounds (item_name, quantity, outbound_status, receiver_name, outbound_date)
VALUES
('유압 밸브', 5, 'WAITING', '부산공장', CURDATE()),
('베어링 세트', 10, 'COMPLETED', '대전센터', CURDATE());

INSERT INTO notices (title, content)
VALUES
('WMS 점검 안내', '금일 18시에 시스템 점검이 예정되어 있습니다.'),
('입고 검수 강화 안내', '모든 입고 물품은 외관 검수를 진행합니다.');

INSERT INTO inquiries (title, content, status)
VALUES
('입고 일정 문의', '유압 밸브 입고 일정을 확인하고 싶습니다.', 'OPEN'),
('출고 요청 문의', '베어링 세트 출고 가능 여부를 확인해 주세요.', 'ANSWERED');
