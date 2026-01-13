-- Inserir receitas de teste no banco de dados
-- Nota: usuario_id está como NULL para serem receitas públicas de demonstração

INSERT INTO public.receitas (id, usuario_id, titulo, tempo_preparo, dificuldade, rendimento) VALUES 
('550e8400-e29b-41d4-a716-446655440001', NULL, 'Arroz de Forno Simples', 45, 'facil', 6),
('550e8400-e29b-41d4-a716-446655440002', NULL, 'Feijão Tropeiro Cremoso', 60, 'media', 8),
('550e8400-e29b-41d4-a716-446655440003', NULL, 'Macarrão à Carbonara', 25, 'media', 4),
('550e8400-e29b-41d4-a716-446655440004', NULL, 'Bolo de Cenoura Simples', 50, 'facil', 12),
('550e8400-e29b-41d4-a716-446655440005', NULL, 'Salpicão de Frango', 30, 'facil', 6);

-- Inserir ingredientes para cada receita
INSERT INTO public.receita_ingredientes (receita_id, descricao, quantidade, unidade) VALUES 
-- Ingredientes do Arroz de Forno Simples
('550e8400-e29b-41d4-a716-446655440001', 'Arroz cozido', 3, 'xícaras'),
('550e8400-e29b-41d4-a716-446655440001', 'Queijo mussarela', 200, 'g'),
('550e8400-e29b-41d4-a716-446655440001', 'Presunto', 150, 'g'),
('550e8400-e29b-41d4-a716-446655440001', 'Tomate', 2, 'unidades'),
('550e8400-e29b-41d4-a716-446655440001', 'Ovo', 3, 'unidades'),

-- Ingredientes do Feijão Tropeiro
('550e8400-e29b-41d4-a716-446655440002', 'Feijão carioca cozido', 2, 'xícaras'),
('550e8400-e29b-41d4-a716-446655440002', 'Linguiça calabresa', 200, 'g'),
('550e8400-e29b-41d4-a716-446655440002', 'Bacon', 150, 'g'),
('550e8400-e29b-41d4-a716-446655440002', 'Farinha de mandioca', 1, 'xícara'),
('550e8400-e29b-41d4-a716-446655440002', 'Couve', 1, 'maço'),

-- Ingredientes do Macarrão Carbonara
('550e8400-e29b-41d4-a716-446655440003', 'Macarrão espaguete', 500, 'g'),
('550e8400-e29b-41d4-a716-446655440003', 'Bacon', 200, 'g'),
('550e8400-e29b-41d4-a716-446655440003', 'Ovo', 4, 'unidades'),
('550e8400-e29b-41d4-a716-446655440003', 'Queijo parmesão', 100, 'g'),
('550e8400-e29b-41d4-a716-446655440003', 'Creme de leite', 200, 'ml'),

-- Ingredientes do Bolo de Cenoura
('550e8400-e29b-41d4-a716-446655440004', 'Cenoura', 3, 'unidades'),
('550e8400-e29b-41d4-a716-446655440004', 'Farinha de trigo', 2, 'xícaras'),
('550e8400-e29b-41d4-a716-446655440004', 'Açúcar', 1.5, 'xícaras'),
('550e8400-e29b-41d4-a716-446655440004', 'Óleo', 1, 'xícara'),
('550e8400-e29b-41d4-a716-446655440004', 'Ovo', 4, 'unidades'),

-- Ingredientes do Salpicão de Frango
('550e8400-e29b-41d4-a716-446655440005', 'Peito de frango cozido', 300, 'g'),
('550e8400-e29b-41d4-a716-446655440005', 'Maçã', 2, 'unidades'),
('550e8400-e29b-41d4-a716-446655440005', 'Uva passa', 100, 'g'),
('550e8400-e29b-41d4-a716-446655440005', 'Batata palha', 200, 'g'),
('550e8400-e29b-41d4-a716-446655440005', 'Milho verde', 1, 'lata');