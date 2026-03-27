import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import data from './data.json';

function Header() {
  return (
    <header className='App-header'>
      <div className='header'>
        <img src={logo} className="App-logo" alt="logo" />
        Todo List
      </div>
    </header>
  );
}

function Footer({setView, setShowModal}) {
  return(
    <footer className='App-footer'>
      <button className="nav-btn" onClick={() => setView('task')}>task</button>
      <div className="fab-container">
        <button className="fab-mid" onClick={() => setShowModal(true)}>+</button>
      </div>
      <button className="nav-btn" onClick={() => setView('folder')}>folder</button>
    </footer>
  )
}

function Task({tasks, onSelect}) {
  return (
    <div className="list-container">
      <h2>Mes Tâches</h2>
      {tasks.map(tache => (
        <div key={tache.id} className="card task-card" onClick={() => onSelect(tache)}>
          <div className="status">{tache.etat}</div>
          <h3>{tache.title}</h3>
          <p>Échéance : {tache.date_echeance}</p>
        </div>
      ))}
    </div>
  )
}

function Folder({folders, onSelect}) {
  return (
    <div className="list-container">
      <h2>Mes Dossiers</h2>
      <div className="folder-grid">
        {folders.map(dossier => (
          <div key={dossier.id} className="card folder-card" style={{ borderLeft: `5px solid ${dossier.color}` }} onClick={() => onSelect(dossier)}>
            <h3>{dossier.title}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}

function Modal({ onClose, onSubmit }) {
  const [type, setType] = useState('task');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Ajouter un élément</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form className="modal-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Type d'élément</label>
            <select name="type" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="task">Tâche</option>
              <option value="folder">Dossier</option>
            </select>
          </div>

          <div className="form-group">
            <label>Titre</label>
            <input name="title" type="text" placeholder="Titre..." required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" placeholder="Description..."></textarea>
          </div>

          {type === 'task' && (
            <>
              <div className="form-group">
                <label>Date d'échéance</label>
                <input name="date_echeance" type="date" required />
              </div>
              <div className="form-group">
                <label>État</label>
                <select name="etat">
                  <option value="Nouveau">Nouveau</option>
                  <option value="En cours">En cours</option>
                  <option value="Réussi">Réussi</option>
                  <option value="Abandonné">Abandonné</option>
                </select>
              </div>
              <div className="form-group">
                <label>Équipier (nom)</label>
                <input name="equipier" type="text" placeholder="Paul, Bob..." />
              </div>
            </>
          )}

          {type === 'folder' && (
            <>
              <div className="form-group">
                <label>Couleur</label>
                <select name="color">
                  <option value="orange">Orange</option>
                  <option value="pink">Rose</option>
                  <option value="bluesky">Bleu ciel</option>
                  <option value="green">Vert</option>
                </select>
              </div>
              <div className="form-group">
                <label>Icône</label>
                <input name="icon" type="text" placeholder="ex: project, star..." />
              </div>
            </>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit" className="submit-btn">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [view, setView] = useState('task');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('my_tasks');
    return saved ? JSON.parse(saved) : data.taches;
  });

  const [folders, setFolders] = useState(() => {
    const saved = localStorage.getItem('my_folders');
    return saved ? JSON.parse(saved) : data.dossiers;
  });

  const [relations, setRelations] = useState(() => {
    const saved = localStorage.getItem('my_relations');
    return saved ? JSON.parse(saved) : data.relations;
  });

  // Sauvegarde auto dès qu'une donnée change
  useEffect(() => {
    localStorage.setItem('my_tasks', JSON.stringify(tasks));
    localStorage.setItem('my_folders', JSON.stringify(folders));
    localStorage.setItem('my_relations', JSON.stringify(relations));
  }, [tasks, folders, relations]);

  const addNewItem = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const type = formData.get('type');
    const title = formData.get('title');

    if (type === 'task') {
      const newTask = {
        id: Date.now(),
        title: title,
        description: formData.get('description'),
        etat: formData.get('etat'),
        date_creation: new Date().toLocaleDateString(),
        date_echeance: formData.get('date_echeance'),
        equipiers: formData.get('equipier') ? [{name: formData.get('equipier')}] : []
      };
      setTasks([newTask, ...tasks]);
    } else {
      const newFolder = {
        id: Date.now(),
        title: title,
        description: formData.get('description'),
        color: formData.get('color'),
        icon: formData.get('icon'),
        type: ""
      };
      setFolders([newFolder, ...folders]);
    }
    setShowModal(false);
  };

  const getTasksForFolder = (folderId) => {
    const taskIds = relations
      .filter(rel => rel.dossier === folderId)
      .map(rel => rel.tache);
    
    return tasks.filter(t => taskIds.includes(t.id));
  };

  return (
    <div className="App">
      <Header />

      <main className="App-main">
        {view === 'task' ? <Task tasks={tasks} onSelect={setSelectedItem} /> : <Folder folders={folders} onSelect={setSelectedItem} />}
      </main>

      {/* MODALE DE DÉTAILS */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedItem.title}</h3>
              <button className="close-btn" onClick={() => setSelectedItem(null)}>&times;</button>
            </div>

            <div className="modal-body">
              {selectedItem.date_echeance ? (
                <div className="detail-info">
                   <p><strong>État :</strong> {selectedItem.etat}</p>
                   <p><strong>Échéance :</strong> {selectedItem.date_echeance}</p>
                   <p><strong>Description :</strong> {selectedItem.description || "Aucune"}</p>
                </div>
              ) : (
                <div className="folder-details">
                  <p>{selectedItem.description}</p>
                  <h4>Tâches dans ce dossier :</h4>
                  <div className="mini-task-list">
                    {getTasksForFolder(selectedItem.id).length > 0 ? (
                      getTasksForFolder(selectedItem.id).map(t => (
                        <div key={t.id} className="mini-task-item">
                          <span>{t.title}</span>
                          <span className="mini-status">{t.etat}</span>
                        </div>
                      ))
                    ) : (
                      <p className="empty-msg">Aucune tâche liée.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showModal && <Modal onClose={() => setShowModal(false)} onSubmit={addNewItem} />}

      <Footer setView={setView} setShowModal={setShowModal} />
    </div>
  );
}

export default App;