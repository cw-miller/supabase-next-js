import { supabase } from '../../utils/supabaseClient';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      const { data: todos, error } = await supabase.from('todos').select('*');
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(todos);

    case 'POST':
      const { title, description, user_id } = req.body;
      const { data, error: insertError } = await supabase
        .from('todos')
        .insert([{ title, description, user_id }])
        .select();
      if (insertError) return res.status(500).json({ error: insertError.message });
      return res.status(201).json(data);

    case 'PUT':
      const { id, completed } = req.body;
      const { data: updatedData, error: updateError } = await supabase
        .from('todos')
        .update({ completed })
        .eq('id', id)
        .select();
      if (updateError) return res.status(500).json({ error: updateError.message });
      return res.status(200).json(updatedData);

    case 'DELETE':
      const { id: deleteId } = req.body;
      const { error: deleteError } = await supabase.from('todos').delete().eq('id', deleteId);
      if (deleteError) return res.status(500).json({ error: deleteError.message });
      return res.status(204).end();

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}