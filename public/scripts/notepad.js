document.addEventListener('DOMContentLoaded', () => {
    const noteList = document.getElementById('noteList');
    const noteEditor = document.getElementById('noteEditor');
    const noteTitle = document.getElementById('noteTitle');
    const newNoteBtn = document.getElementById('newNoteBtn');
    const imageUploadBtn = document.querySelector('.image-upload-btn');
    const imageUploadInput = document.getElementById('imageUpload');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let currentNoteIndex = null;

    function renderNoteList() {
        noteList.innerHTML = '';
        notes.forEach((note, index) => {
            const li = document.createElement('li');
            li.textContent = note.title || `Note ${index + 1}`;
            li.dataset.index = index;
            li.addEventListener('click', () => selectNote(index));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering the selectNote event
                deleteNote(index);
            });

            li.appendChild(deleteBtn);
            noteList.appendChild(li);
        });
    }

    function selectNote(index) {
        currentNoteIndex = index;
        noteTitle.value = notes[index].title || '';
        noteEditor.innerHTML = notes[index].content || '';
        noteTitle.focus();
    }

    function createNewNote() {
        const newNote = { title: '', content: '' };
        notes.push(newNote);
        currentNoteIndex = notes.length - 1;
        renderNoteList();
        selectNote(currentNoteIndex);
        saveNotes();
    }

    function deleteNote(index) {
        notes.splice(index, 1);
        if (currentNoteIndex === index) {
            currentNoteIndex = null;
            noteTitle.value = '';
            noteEditor.innerHTML = '';
        }
        renderNoteList();
        saveNotes();
    }

    function saveNotes() {
        if (currentNoteIndex !== null) {
            notes[currentNoteIndex].title = noteTitle.value || `Note ${currentNoteIndex + 1}`;
            notes[currentNoteIndex].content = noteEditor.innerHTML;
        }
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function getFile(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.addEventListener('click', () => toggleImageSize(img));
                noteEditor.appendChild(img);
                saveNotes();
            };
            reader.readAsDataURL(file);
        }
    }

    function toggleImageSize(img) {
        img.classList.toggle('full-size');
    }

    // Event listeners
    noteTitle.addEventListener('input', saveNotes);
    noteEditor.addEventListener('input', saveNotes);
    newNoteBtn.addEventListener('click', createNewNote);
    imageUploadBtn.addEventListener('click', () => imageUploadInput.click());
    imageUploadInput.addEventListener('change', getFile);

    // Load and render the list of notes
    renderNoteList();
});
