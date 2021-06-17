"use strict";

//* Selecting Elements
const addBtn = document.querySelector(".fa-plus-circle");
const noteModalParent = document.querySelector(".note-modal-container");
const noteAddModal = document.querySelector(".edit-note-modal");
const addCloseBtn = document.querySelector(".edit-close");
const addSaveBtn = document.querySelector(".edit-save");
const noteTitle = document.querySelector(".note-input-title");
const noteDescription = document.querySelector(".note-input-description");
const noteListParent = document.querySelector(".note-list-wrapper");
const noteReadModal = document.querySelector(".read-note-modal");
const noteReadDescription = document.querySelector(".read-modal-text");
const noteReadTitle = document.querySelector(".read-modal-title");
const deleteNoteBtn = document.querySelector(".fa-trash-alt");
const editNoteBtn = document.querySelector(".fa-edit");
const addUpdateBtn = document.querySelector(".edit-update");
const noteReadCloseBtn = document.querySelector(".note-read-close");

//* Functions
let notesArr, index, noteIndex, noteEl, isAddNote;

const init = function () {
  notesArr = getNoteFromLocalstorage() ?? [];
  isAddNote = true;
  index =
    getNoteFromLocalstorage()?.length > 0
      ? getNoteFromLocalstorage()[getNoteFromLocalstorage().length - 1].index +
        1
      : 0;
};

const toggleAddNoteFormModal = function () {
  noteModalParent.classList.toggle("d-none");
  noteAddModal.classList.toggle("d-none");
};

const toggleReadNoteFormModal = function () {
  noteModalParent.classList.toggle("d-none");
  noteReadModal.classList.toggle("d-none");
};

const validateNote = function () {
  if (noteTitle.value && noteDescription.value) {
    return false;
  } else {
    return true;
  }
};

const clearNoteInput = function () {
  noteTitle.value = noteDescription.value = "";
};

const addNote = function (title, description) {
  if (!validateNote()) {
    //* push new Element to the note array
    notesArr.push({
      index,
      data: {
        title: title,
        description: description,
        timestamps: new Intl.DateTimeFormat(navigator.language).format(
          new Date()
        ),
      },
    });

    //* Add To LocalStorage
    addNoteToLocalStorage(notesArr);

    //* Clear Note Input
    clearNoteInput();

    //* Update the UI
    displayNoteList();

    //* Close Modal
    toggleAddNoteFormModal();

    //* increment index
    index++;
  } else {
    //* if the note is not valid alert the user
    alert("Title and description cannot be empty");
  }
};

const readNote = function (el) {
  toggleReadNoteFormModal();
  noteReadTitle.textContent = el.querySelector(".note-title").textContent;
  noteReadDescription.textContent = el.querySelector(".note-text").textContent;

  noteEl = el;
};

const deleteNote = function (index) {
  //* remove element from the notes array
  let noteIndex = notesArr.findIndex(function (value) {
    return value.index === Number(index);
  });
  notesArr.splice(noteIndex, 1);

  //   //* remove element from the localstorage
  deleteNoteFromLocalstorage(notesArr);

  //* close modal popup
  toggleReadNoteFormModal();

  //* render the UI
  displayNoteList();
};

const editNote = function (el, index) {
  //* populate note input value
  noteTitle.value = el.querySelector(".note-title").textContent;
  noteDescription.value = el.querySelector(".note-text").textContent;

  //* show edit modal popup
  toggleReadNoteFormModal();
  toggleAddNoteFormModal();

  //* show the update btn
  addSaveBtn.classList.add("d-none");
  addUpdateBtn.classList.remove("d-none");
};

const updateNote = function (index) {
  //* update note in the localstorage
  let noteIndex = notesArr.findIndex(function (value) {
    return value.index === Number(index);
  });

  //* Update the note in the note array
  notesArr[noteIndex].data = {
    title: noteTitle.value,
    description: noteDescription.value,
  };

  //* Update note in the localstorage
  updateNoteInLocalstorage(notesArr);

  //* Update Ui
  displayNoteList();

  //* close modal popup
  toggleAddNoteFormModal();

  //* clear input value
  clearNoteInput();

  //* hide the update btn and show the save btn
  addSaveBtn.classList.remove("d-none");
  addUpdateBtn.classList.add("d-none");
};

const createNoteListHtml = function ({
  index,
  data: { title, description, timestamps = "3/16/2021" },
}) {
  const html = `
    <div class="note note-${index}">
        <p class="note-title">${title}</p>
        <div class="note-label">
            <p>
            <span class="note-date"><span class="timestamp-clock">🕐</span><span>${timestamps}</span></span>
            <span class="note-text">${description}</span>
            </p>
        </div>
    </div>
    `;
  return html;
};

const displayNoteList = function () {
  noteListParent.innerHTML = "";
  notesArr.forEach(function (note) {
    noteListParent.insertAdjacentHTML("afterbegin", createNoteListHtml(note));
  });

  //* Add event listener to all the note
  noteListParent.querySelectorAll(".note").forEach(function (el) {
    el.addEventListener("click", function () {
      let index;
      index = el.classList[el.classList.length - 1].split("-");
      index = index[index.length - 1];
      noteIndex = index;
      readNote(this);
    });
  });
};

//* Localstorage
const addNoteToLocalStorage = function (note) {
  const stringifyNote = JSON.stringify(note);
  return localStorage.setItem("note", stringifyNote);
};

const deleteNoteFromLocalstorage = function (note) {
  addNoteToLocalStorage(note);
};

const getNoteFromLocalstorage = function () {
  return JSON.parse(localStorage.getItem("note"));
};

const updateNoteInLocalstorage = function (note) {
  addNoteToLocalStorage(note);
};

//* Function calls
init();
displayNoteList();

//* Event Handler
addBtn.addEventListener("click", function () {
  isAddNote = true;
  toggleAddNoteFormModal();
});

addCloseBtn.addEventListener("click", function () {
  clearNoteInput();
  toggleAddNoteFormModal();

  addSaveBtn.classList.remove("d-none");
  addUpdateBtn.classList.add("d-none");
});

noteReadCloseBtn.addEventListener("click", function () {
  toggleReadNoteFormModal();
  noteIndex = "";
  noteEl = "";
});

addSaveBtn.addEventListener("click", function () {
  addNote(noteTitle.value, noteDescription.value);
});

//* delete the specified note
deleteNoteBtn.addEventListener("click", function () {
  deleteNote(noteIndex);
});

//* edit the specified note
editNoteBtn.addEventListener("click", function () {
  editNote(noteEl);
});

//* update note
addUpdateBtn.addEventListener("click", function () {
  updateNote(noteIndex);
});
