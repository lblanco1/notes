import { ChangeEvent, useState } from "react";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Note[]>(() => {
    const storedNotes = localStorage.getItem('notes')
    if (storedNotes) {
      return JSON.parse(storedNotes)
    }
    return []
  })

  const onNoteCreated = (content: string ) => {
    const newNote = {
      id: crypto.randomUUID(),
      content,
      date: new Date(),
    }

    const noteArray = [newNote, ...notes]
    setNotes(noteArray) 
    localStorage.setItem('notes', JSON.stringify(noteArray))
  }

  const onDeleteNote = (id: string) => {
    const notesArray = notes.filter(note => {
      return note.id !== id
    })

    setNotes(notesArray)
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  const handleSearch = (event: ChangeEvent<HTMLInputElement> ) => {
    const query = event.target.value
    setSearch(query)
  }

  const filteredNotes = search !== '' 
    ? notes.filter(note => {
        return note.content.toLowerCase().includes(search.toLowerCase())
      }) : notes

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <form className="w-full">
        <input
          type="text"
          placeholder="Busque suas notas"
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500" 
          onChange={handleSearch}/>

      </form>

      <div className="h-px bg-slate-700" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated}/>
        {filteredNotes.map(note => {
          return (
            <NoteCard key={note.id} note={note} onDeleteNote={onDeleteNote} />
          )
        })}
      </div>
    </div>
  )
}
