import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, MouseEventHandler, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
   onNoteCreated: (content: string) => void
}


let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
   const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
   const [content, setContent] = useState('')
   const [isRecording, setIsRecording] = useState(false)

   const handleStartEditor = () => {
      setShouldShowOnboarding(false)
   }
   const handleContentChanged = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(event.target.value)
      if (event.target.value === '') {
         setShouldShowOnboarding(true)
      }
   }

   const handleStartRecording = () => {
      setIsRecording(true)
      setShouldShowOnboarding(false)

      const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
      
      if(!isSpeechRecognitionAPIAvailable) {
         toast.error('Infelizmente seu navegador não suporta a API de gravações!')
         return
      }

      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

      speechRecognition = new SpeechRecognitionAPI()

      speechRecognition.lang = 'pt-BR'
      speechRecognition.continuous = true
      speechRecognition.maxAlternatives = 1
      speechRecognition.interimResults = true

      speechRecognition.onresult = (event) => {
         //Temos duas formas de fazermos resolver

         // const result = event.results[0];
         // const transcription = result[0];
         // setContent(transcription.transcript);
         // if (result.isFinal) {
         //    handleSaveNote();
         // }

         const transcription = Array.from(event.results).reduce((text, result) => {
            return text.concat(result[0].transcript)
         }, '')

         setContent(transcription);
      }

      speechRecognition.onerror = (event) => {
         console.log(event)
      }

      speechRecognition.start();
   }

   const handleStopRecording = () => {
      setIsRecording(false)
      speechRecognition?.stop()
   }

   
   const handleSaveNote = () => {
      // event.preventDefault()
      if(content === '') {
         return
      }
      onNoteCreated(content)
      setShouldShowOnboarding(true)
      setContent('')
      toast.success('Nota gravada com sucesso!')
   }

   return (
      <Dialog.Root>
         <Dialog.Trigger className="rounded-md bg-slate-700 p-5 gap-3 text-left flex flex-col outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
            <span className="text-sm font-medium text-slate-200">Adicionar nota</span>
            <p className="text-sm leading-6 text-slate-400">
               Grave uma nota me audio que será convertida para texto automaticamente.
            </p>
         </Dialog.Trigger>
         <Dialog.Portal>
            <Dialog.Overlay className='inset-0 fixed bg-black/60' />
            <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2  md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 outline-none bg-slate-700 md:h-[60vh] md:max-w-[640px] w-full md:rounded-md flex flex-col'>
               <Dialog.Close className='absolute top-5 right-5 bg-slate-800 text-slate-400 hover:text-slate-100'>
                  <X className='w-6 h-6' />
               </Dialog.Close>
               <form className='flex-1 flex flex-col'>
                  <div className='fçex flex-1 flex-col gap-3 p-5'>
                     <span className="text-sm font-medium text-slate-300">
                        Adicionar nota
                     </span>
                     {shouldShowOnboarding ? (
                        <p className="text-sm leading-6 text-slate-400">
                           Comece <button onClick={() => handleStartRecording()} type='button' className='font-medium text-lime-400 hover:underline'>gravando uma nota </button> em áudio ou se preferir, <button onClick={() => handleStartEditor()} type='button' className='font-medium text-lime-400 hover:underline'>
                              utilize apenas texto</button>
                        </p>
                     ) : (
                        <textarea
                           autoFocus
                           placeholder='Escreva sua nota...'
                           className='w-full 
                                bg-transparent 
                                text-sm 
                                text-slate-400
                                resize-none
                                leading-6
                                flex-1
                                outline-none 
                                placeholder:text-slate-500'
                           onChange={(e) => { handleContentChanged(e) }}
                           value={content}
                        />
                     )}
                  </div>

                  {isRecording ? (
                     <button
                        onClick={() => handleStopRecording()}
                        type='button'
                        className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100'
                     >
                        <div className='size-3 rounded-full bg-red-500 animate-pulse' />
                        Gravando! (clique p/ interromper)
                     </button>
                  ) : (
                     <button
                        type='button'
                        onClick={handleSaveNote}
                        className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'
                     >
                        Salvar nota
                     </button>
                  )}
               </form>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   )
}