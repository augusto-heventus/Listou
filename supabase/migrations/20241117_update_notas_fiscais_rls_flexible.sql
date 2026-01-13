-- Update RLS policies for notas_fiscais table to be more flexible
-- Allow authenticated users to insert their own notas fiscais with proper user context

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own notas fiscais" ON notas_fiscais;
DROP POLICY IF EXISTS "Users can view their own notas fiscais" ON notas_fiscais;
DROP POLICY IF EXISTS "Users can update their own notas fiscais" ON notas_fiscais;
DROP POLICY IF EXISTS "Users can delete their own notas fiscais" ON notas_fiscais;

-- Create more flexible RLS policies
CREATE POLICY "Users can insert their own notas fiscais" ON notas_fiscais
    FOR INSERT TO authenticated
    WITH CHECK (
        usuario_id = auth.uid() OR 
        usuario_id IS NULL
    );

CREATE POLICY "Users can view their own notas fiscais" ON notas_fiscais
    FOR SELECT TO authenticated
    USING (
        usuario_id = auth.uid() OR 
        usuario_id IS NULL
    );

CREATE POLICY "Users can update their own notas fiscais" ON notas_fiscais
    FOR UPDATE TO authenticated
    USING (usuario_id = auth.uid())
    WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "Users can delete their own notas fiscais" ON notas_fiscais
    FOR DELETE TO authenticated
    USING (usuario_id = auth.uid());

-- Also update nota_itens policies
DROP POLICY IF EXISTS "Users can manage their nota items" ON nota_itens;

CREATE POLICY "Users can manage their nota items" ON nota_itens
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM notas_fiscais 
            WHERE notas_fiscais.id = nota_itens.nota_id 
            AND (notas_fiscais.usuario_id = auth.uid() OR notas_fiscais.usuario_id IS NULL)
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM notas_fiscais 
            WHERE notas_fiscais.id = nota_itens.nota_id 
            AND (notas_fiscais.usuario_id = auth.uid() OR notas_fiscais.usuario_id IS NULL)
        )
    );