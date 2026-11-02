import { useEffect, useState } from "react";
import { api } from "./api.js";

const STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

export default function ItemList({ token }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [error, setError] = useState("");

  const loadItems = () =>
    api.listItems(token).then(setItems).catch((err) => setError(err.message));

  useEffect(() => {
    loadItems();
  }, [token]);

  const run = async (action) => {
    setError("");
    try {
      await action();
      await loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    run(async () => {
      await api.createItem(token, newItem);
      setNewItem({ title: "", description: "" });
    });
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ title: item.title, description: item.description });
  };

  const saveEdit = (id) =>
    run(async () => {
      await api.updateItem(token, id, editForm);
      setEditingId(null);
    });

  const changeStatus = (id, status) => run(() => api.updateItem(token, id, { status }));

  const handleDelete = (id) => {
    if (window.confirm("Delete this item?")) run(() => api.deleteItem(token, id));
  };

  return (
    <div>
      <form className="card" onSubmit={handleCreate}>
        <h2>New workflow item</h2>
        <input
          placeholder="Title"
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
        />
        <button type="submit">Add item</button>
      </form>

      {error && <p className="error">{error}</p>}

      <h2>My workflow items ({items.length})</h2>
      {items.length === 0 && <p>No items yet. Create one above.</p>}

      {items.map((item) => (
        <div key={item.id} className={`card item ${item.status.toLowerCase()}`}>
          {editingId === item.id ? (
            <>
              <input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
              <button onClick={() => saveEdit(item.id)}>Save</button>
              <button className="secondary" onClick={() => setEditingId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <select value={item.status} onChange={(e) => changeStatus(item.id, e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <button className="secondary" onClick={() => startEdit(item)}>Edit</button>
              <button className="danger" onClick={() => handleDelete(item.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
