-- Inserir receitas de teste no banco de dados
-- Bolos
INSERT INTO receitas (id, titulo, tempo_preparo, dificuldade, rendimento, imagem, created_at) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Bolo de Chocolate', 60, 'facil', 8, 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Bolo%20de%20Chocolate%20prato%20de%20comida%20fotografia%20gastronomica%20ilumina%C3%A7%C3%A3o%20natural&image_size=square', NOW()),
('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Bolo de Cenoura', 50, 'facil', 10, 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Bolo%20de%20Cenoura%20prato%20de%20comida%20fotografia%20gastronomica%20ilumina%C3%A7%C3%A3o%20natural&image_size=square', NOW()),
('c3d4e5f6-a7b8-9012-cdef-345678901234', 'Bolo de Fubá', 45, 'facil', 12, 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Bolo%20de%20Fub%C3%A1%20prato%20de%20comida%20fotografia%20gastronomica%20ilumina%C3%A7%C3%A3o%20natural&image_size=square', NOW()),
('d4e5f6a7-b8c9-0123-defa-456789012345', 'Bolo de Milho', 55, 'media', 10, 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Bolo%20de%20Milho%20prato%20de%20comida%20fotografia%20gastronomica%20ilumina%C3%A7%C3%A3o%20natural&image_size=square', NOW()),
('e5f6a7b8-c9d0-1234-efab-567890123456', 'Bolo de Banana', 40, 'facil', 8, 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Bolo%20de%20Banana%20prato%20de%20comida%20fotografia%20gastronomica%20ilumina%C3%A7%C3%A3o%20natural&image_size=square', NOW());

-- Inserir ingredientes para as receitas de teste
INSERT INTO receita_ingredientes (receita_id, descricao, quantidade, unidade, created_at) VALUES
-- Bolo de Chocolate
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Farinha de trigo', 2, 'xícara', NOW()),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Açúcar', 1.5, 'xícara', NOW()),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Cacau em pó', 0.5, 'xícara', NOW()),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Ovos', 3, 'unidade', NOW()),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Leite', 1, 'xícara', NOW()),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Óleo', 0.5, 'xícara', NOW()),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Fermento em pó', 1, 'colher de chá', NOW()),

-- Bolo de Cenoura
('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Cenoura', 3, 'unidade', NOW()),
('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Farinha de trigo', 2, 'xícara', NOW()),
('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Açúcar', 1.5, 'xícara', NOW()),
('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Ovos', 3, 'unidade', NOW()),
('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Óleo', 0.5, 'xícara', NOW()),
('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Fermento em pó', 1, 'colher de chá', NOW()),

-- Bolo de Fubá
('c3d4e5f6-a7b8-9012-cdef-345678901234', 'Fubá', 2, 'xícara', NOW()),
('c3d4e5f6-a7b8-9012-cdef-345678901234', 'Farinha de trigo', 0.5, 'xícara', NOW()),
('c3d4e5f6-a7b8-9012-cdef-345678901234', 'Açúcar', 1.5, 'xícara', NOW()),
('c3d4e5f6-a7b8-9012-cdef-345678901234', 'Ovos', 3, 'unidade', NOW()),
('c3d4e5f6-a7b8-9012-cdef-345678901234', 'Leite', 1, 'xícara', NOW()),
('c3d4e5f6-a7b8-9012-cdef-345678901234', 'Óleo', 0.5, 'xícara', NOW()),
('c3d4e5f6-a7b8-9012-cdef-345678901234', 'Fermento em pó', 1, 'colher de chá', NOW()),

-- Bolo de Milho
('d4e5f6a7-b8c9-0123-defa-456789012345', 'Milho verde', 2, 'xícara', NOW()),
('d4e5f6a7-b8c9-0123-defa-456789012345', 'Farinha de trigo', 1, 'xícara', NOW()),
('d4e5f6a7-b8c9-0123-defa-456789012345', 'Açúcar', 1, 'xícara', NOW()),
('d4e5f6a7-b8c9-0123-defa-456789012345', 'Ovos', 2, 'unidade', NOW()),
('d4e5f6a7-b8c9-0123-defa-456789012345', 'Leite', 0.5, 'xícara', NOW()),
('d4e5f6a7-b8c9-0123-defa-456789012345', 'Óleo', 0.25, 'xícara', NOW()),
('d4e5f6a7-b8c9-0123-defa-456789012345', 'Fermento em pó', 1, 'colher de chá', NOW()),

-- Bolo de Banana
('e5f6a7b8-c9d0-1234-efab-567890123456', 'Banana', 3, 'unidade', NOW()),
('e5f6a7b8-c9d0-1234-efab-567890123456', 'Farinha de trigo', 2, 'xícara', NOW()),
('e5f6a7b8-c9d0-1234-efab-567890123456', 'Açúcar', 1, 'xícara', NOW()),
('e5f6a7b8-c9d0-1234-efab-567890123456', 'Ovos', 2, 'unidade', NOW()),
('e5f6a7b8-c9d0-1234-efab-567890123456', 'Óleo', 0.5, 'xícara', NOW()),
('e5f6a7b8-c9d0-1234-efab-567890123456', 'Fermento em pó', 1, 'colher de chá', NOW());