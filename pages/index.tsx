import React, { useState, FC } from 'react';
import { prisma } from '../lib/prisma';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';


type FormType = {
  title: string;
  content: string;
  id: string;
}

type NotesType = {
  notes: {
    id: string;
    title: string;
    content: string;
  }[]
}

const Home: FC<NotesType> = ({notes}) => {
  const [ form, setForm ] = useState<FormType>({} as FormType);
  const router = useRouter();

  async function create(data: FormType) {
    try {
      let res = await fetch('/api/create', {
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json',
        },
        method: 'POST'
      });
      if (data.id) deleteNote(data.id);
        setForm({ title: '', content: '', id: '' });
        refreshData();
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = (data: FormType) => {
    try {
      create(data);
    } catch (error) {
      console.log(error);
    }
  }

  const refreshData = () => {
    router.replace(router.asPath);
  }

  async function deleteNote(id: string) {
    try {
      await fetch(`/api/note/${id}`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: 'DELETE'
      });
      refreshData();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1 className='notes my-2'>Notes</h1>
      <form onSubmit={e => {
        e.preventDefault();
        handleSubmit(form);
        }} className='form'>
        <input type="text" 
          placeholder='Title'
          value={form.title}
          onChange={({ target }) => setForm({ ...form, title: target.value })}
          className='input'
        />
        <textarea
          placeholder='Content'
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}
          className='input'
        />
        <button type='submit' className='blueButton'>Add Note</button>

      </form>

      <div className='notes'>
        <ul className='flex justify-center items-center flex-col'>
        {notes.map((note: { id: string; title: string; content: string; }) => {
          return (
            <li key={note.id} className='p-2 my-4'>
              <div className='flex max-w-[500px]'>
                <div className='flex-1 mx-6'>
                  <h3 className='font-bold'>
                    {note.title}
                  </h3>
                  <p className='text-sm'>{note.content}</p>
                </div>
                <button onClick={() => setForm({ title: note.title, content: note.content, id: note.id })} className='bg-blue-500 px-2 text-black text-md rounded mx-2'>Update</button>
                <button onClick={() => deleteNote(note.id)} className='bg-red-500 px-2 text-black text-md rounded mx-2'>Delete</button>
              </div>
            </li>
          )
        })}
        </ul>
      </div>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    select: {
      title: true,
      id: true,
      content: true
    }
  });

  return {
    props: {
      notes
    }
  };
}
