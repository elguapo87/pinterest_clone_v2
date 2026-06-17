"use client"

import { useState } from 'react'
import AuthGuard from './auth/AuthGuard'
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateBoardWrapper = () => {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();

    const handleCreate = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const { data } = await api.post("/boards/create", { title });
            if (data.success) {
                if (data.board) {
                    toast.success(`${data.board.title} board is created`);
                }
                router.push("/create")
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <AuthGuard>
            <form
                onSubmit={handleCreate}
                className="flex md:pt-5 md:pl-10 flex-col items-center md:items-start justify-center"
            >
                <h1 className="text-[20px] font-medium mb-3 ml-3">Create Board</h1>

                <div className="flex items-center border-2 border-[#e9e9e9] rounded-4xl">
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        className="flex-1 text-[15px] border-none outline-none px-3 md:w-60  rounded-4xl"
                        type="text"
                        placeholder="Add a title"
                        id="title"
                    />

                    <button
                        type="submit"
                        className="bg-[#e50829] text-white font-medium border-none outline-none py-3 px-4
                            rounded-4xl  cursor-pointer text-[15px] hover:bg-[#c1011e]"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
            </form>
        </AuthGuard>

    )
}

export default CreateBoardWrapper
