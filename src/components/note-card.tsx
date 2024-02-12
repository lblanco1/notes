import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { X } from 'lucide-react'

interface NoteCardProps {
  note: {
    id: string,
    date: Date,
    content: string,
  }
  onDeleteNote: (id: string) => void
}

export function NoteCard({ note, onDeleteNote }: NoteCardProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md text-left flex-col bg-slate-800 p-5 gap-3 overflow-hidden relative outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-300">
        {formatDistanceToNow(note.date, { addSuffix: true, locale: ptBR })}
        </span>
        <p className="text-sm leading-6 text-slate-400">
          {note.content}
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/60' />
        <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 outline-none bg-slate-700 md:h-[60vh] md:max-w-[640px] w-full md:rounded-md flex flex-col'>
          <Dialog.Close className='absolute top-5 right-5 bg-slate-800 text-slate-400 hover:text-slate-100'>
            <X className='w-6 h-6' />
            {/* <button type='button' className='text-slate-300'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button> */}
          </Dialog.Close>
          <div className='fçex flex-1 flex-col gap-3 p-5'>
            <span className="text-sm font-medium text-slate-300">
              {formatDistanceToNow(note.date, { addSuffix: true, locale: ptBR })}
            </span>
            <p className="text-sm leading-6 text-slate-400">
              {note.content}
            </p>
          </div>

          <button
          onClick={() => onDeleteNote(note.id)}
            type='button'
            className='w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group'
          >
            Deseja <span className='text-red-400 group-hover:underline'>apagar essa nota</span>?
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
