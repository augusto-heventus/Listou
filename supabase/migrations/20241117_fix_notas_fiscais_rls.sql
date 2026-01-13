-- Fix RLS policies for notas_fiscais table
-- Allow authenticated users to insert their own notas fiscais

-- Grant basic permissions to authenticated role
GRANT ALL PRIVILEGES ON notas_fiscais TO authenticated;
GRANT SELECT ON notas_fiscais TO anon;

-- Create RLS policy for authenticated users to insert their own notas fiscais
CREATE POLICY "Users can insert their own notas fiscais" ON notas_fiscais
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = usuario_id);

-- Create RLS policy for authenticated users to select their own notas fiscais  
CREATE POLICY "Users can view their own notas fiscais" ON notas_fiscais
    FOR SELECT TO authenticated
    USING (auth.uid() = usuario_id);

-- Create RLS policy for authenticated users to update their own notas fiscais
CREATE POLICY "Users can update their own notas fiscais" ON notas_fiscais
    FOR UPDATE TO authenticated
    USING (auth.uid() = usuario_id);

-- Create RLS policy for authenticated users to delete their own notas fiscais
CREATE POLICY "Users can delete their own notas fiscais" ON notas_fiscais
    FOR DELETE TO authenticated
    USING (auth.uid() = usuario_id);

-- Also grant permissions to nota_itens table since it's related
GRANT ALL PRIVILEGES ON nota_itens TO authenticated;
GRANT SELECT ON nota_itens TO anon;

-- Create RLS policies for nota_itens table
CREATE POLICY "Users can manage their nota items" ON nota_itens
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM notas_fiscais 
            WHERE notas_fiscais.id = nota_itens.nota_id 
            AND notas_fiscais.usuario_id = auth.uid()
        )
    );