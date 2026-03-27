import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, onValue, push, set, update, remove } from 'firebase/database';
import { auth, rtdb } from '../config/firebase-config';
import { LogOut, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // CRUD Data state
  const [items, setItems] = useState([]);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  
  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Read Data
  useEffect(() => {
    if (!user) return;
    
    // Listen for real-time updates
    const itemsRef = ref(rtdb, 'items');
    const unsubscribe = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object of objects to array
        const dbItems = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        // Filter by user ID and sort by createdAt descending
        const userItems = dbItems
          .filter(item => item.userId === user.uid)
          .sort((a, b) => b.createdAt - a.createdAt);
          
        setItems(userItems);
      } else {
        setItems([]);
      }
    }, (error) => {
      console.error("Error reading data: ", error);
    });

    return () => unsubscribe();
  }, [user]);

  // Create Data
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    try {
      const itemsListRef = ref(rtdb, 'items');
      const newItemRef = push(itemsListRef);
      await set(newItemRef, {
        title: newItemTitle,
        description: newItemDesc,
        createdAt: Date.now(),
        userId: user.uid
      });
      setNewItemTitle('');
      setNewItemDesc('');
    } catch (err) {
      console.error('Error adding document:', err);
    }
  };

  // Setup Edit Mode
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditDesc(item.description);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDesc('');
  };

  // Update Data
  const handleUpdate = async (id) => {
    try {
      const itemRef = ref(rtdb, `items/${id}`);
      await update(itemRef, {
        title: editTitle,
        description: editDesc,
        updatedAt: Date.now()
      });
      setEditingId(null);
    } catch (err) {
      console.error('Error updating document:', err);
    }
  };

  // Delete Data
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const itemRef = ref(rtdb, `items/${id}`);
        await remove(itemRef);
      } catch (err) {
        console.error('Error deleting document:', err);
      }
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div className="login-container"><div style={{color: 'white'}}>Loading...</div></div>;
  }

  return (
    <div className="dashboard">
      <nav className="glass-panel navbar">
        <div className="user-profile">
          <img src={user?.photoURL || 'https://via.placeholder.com/40'} alt="User" />
          <div>
            <h3>{user?.displayName || 'User'}</h3>
            <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{user?.email}</p>
          </div>
        </div>
        <button onClick={handleSignOut} className="btn btn-danger" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <LogOut size={16} /> Sign Out
        </button>
      </nav>

      <main>
        {/* Create Form */}
        <form onSubmit={handleAddItem} className="glass-panel crud-form">
          <input 
            type="text" 
            placeholder="Item title..." 
            className="input-field"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            required
          />
          <input 
            type="text" 
            placeholder="Description (optional)" 
            className="input-field"
            value={newItemDesc}
            onChange={(e) => setNewItemDesc(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Plus size={16} /> Add Item
          </button>
        </form>

        {/* Read List (Cards) */}
        <div className="cards-grid">
          {items.length === 0 ? (
            <div className="glass-panel empty-state">
              <h3>No items found</h3>
              <p>Create your first item using the form above.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="glass-panel data-card">
                {editingId === item.id ? (
                  /* Edit Mode UI */
                  <>
                    <input 
                      type="text" 
                      className="input-field"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <textarea 
                      className="input-field"
                      style={{minHeight: '80px', resize: 'vertical'}}
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                    />
                    <div className="card-actions">
                      <button onClick={() => handleUpdate(item.id)} className="btn btn-primary">
                        <Save size={16} /> Save
                      </button>
                      <button onClick={cancelEdit} className="btn" style={{background: 'rgba(255,255,255,0.1)'}}>
                        <X size={16} /> Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  /* Read Mode UI */
                  <>
                    <div className="card-content">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div className="card-actions">
                      <button onClick={() => startEdit(item)} className="btn" style={{background: 'rgba(255,255,255,0.1)'}}>
                        <Edit2 size={16} /> Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-danger">
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
