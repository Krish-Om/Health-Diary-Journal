document.addEventListener('DOMContentLoaded', () => {
    const noteList = document.getElementById('noteList');
    const noteEditor = document.getElementById('noteEditor');
    const noteTitle = document.getElementById('noteTitle');
    const newNoteBtn = document.getElementById('newNoteBtn');

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
                e.preventDefault();
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
        noteEditor.value = notes[index].content || '';
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
            noteEditor.value = '';
        }
        renderNoteList();
        saveNotes();
    }

    function saveNotes() {
        if (currentNoteIndex !== null) {
            notes[currentNoteIndex].title = noteTitle.value || `Note ${currentNoteIndex + 1}`;
            notes[currentNoteIndex].content = noteEditor.value;
        }
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    noteTitle.addEventListener('input', saveNotes);
    noteEditor.addEventListener('input', saveNotes);
    newNoteBtn.addEventListener('click', createNewNote);

    // Load and render the list of notes
    renderNoteList();
});

/*Image Handler*/
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imgElement.style.maxWidth = '100px';
            imgElement.style.maxHeight = '100px';
            imgElement.style.cursor = 'pointer';
            imgElement.style.marginTop = '10px';
            imgElement.onclick = function() {
                if (imgElement.style.maxWidth === '100%') {
                    imgElement.style.maxWidth = '100px';
                    imgElement.style.maxHeight = '100px';
                } else {
                    imgElement.style.maxWidth = '100%';
                    imgElement.style.maxHeight = '100%';
                }
            };
            const noteEditor = document.getElementById('noteEditor');
            noteEditor.appendChild(imgElement);
        };
        reader.readAsDataURL(file);
    }
}


