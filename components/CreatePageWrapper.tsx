import Image from "next/image"

const CreatePageWrapper = () => {
    return (
        <div className="">
            {/* CREATE TOP */}
            <div className="border-y border-[#e9e9e9] py-4 px-0 flex items-center justify-between">
                <h1 className="text-[20px] font-medium">Create Pin</h1>
                <button
                    className="bg-[#e50829] text-white font-medium border-none outline-none py-3 px-4
                        rounded-4xl cursor-pointer text-[15px] hover:bg-[#c1011e]"
                >
                    Publish
                </button>
            </div>
            {/* CREATE BOTTOM */}
            <div
                className="mt-8 flex justify-center gap-16 max-[1104px]:flex-col
                    max-[1104px]:items-center max-[1104px]:mb-16"
            >
                {/* UPLOAD */}
                <div
                    className="bg-[#e9e9e9] cursor-pointer text-[18px] flex items-center justify-center rounded-4xl
                        border-dashed border-[#dddddd] w-93.75 h-143.5 p-4 relative max-[475px]:w-full"

                >
                    <div className="flex flex-col items-center gap-4">
                        <Image
                            src="/upload.svg"
                            alt="Upload Image"
                            width={32}
                            height={32}
                        />
                        <span>Chose a file</span>
                    </div>
                    <div className="absolute bottom-8 text-[13px] text-center text-gray-600">
                        We recommend uing high quality .jpg files less then 20 files less then 200 MB
                    </div>
                </div>
                <form className="flex flex-col gap-8 w-146 max-[768px]:w-full">
                    {/* CREATE FORM iTEM */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="title" className="text-[13px] text-gray-600 ">Title</label>
                        <input
                            className="text-[15px] border-2 border-[#e9e9e9] p-4 rounded-2xl"
                            type="text"
                            placeholder="Add a title"
                            name="title"
                            id="title"
                        />
                    </div>
                    {/* CREATE FORM iTEM */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="description" className="text-[13px] text-gray-600 ">Description</label>
                        <textarea
                            className="text-[15px] border-2 border-[#e9e9e9] p-4 rounded-2xl resize-none"
                            rows={6}
                            placeholder="Add a detailed description"
                            name="description"
                            id="description"
                        />
                    </div>
                    {/* CREATE FORM iTEM */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="link" className="text-[13px] text-gray-600 ">Link</label>
                        <input
                            className="text-[15px] border-2 border-[#e9e9e9] p-4 rounded-2xl"
                            type="text"
                            placeholder="Add a link"
                            name="link"
                            id="link"
                        />
                    </div>
                    {/* CREATE FORM iTEM */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="board" className="text-[13px] text-gray-600 ">Board</label>
                        <select
                            name="board"
                            id="board"
                            className="text-[15px] border-2 border-[#e9e9e9] p-4 rounded-2xl"
                        >
                            <option>Choose a board</option>
                            <option value="1">Board 1</option>
                            <option value="2">Board 2</option>
                            <option value="3">Board 3</option>
                        </select>
                    </div>
                    {/* CREATE FORM iTEM */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="tags" className="text-[13px] text-gray-600 ">Tagged topics</label>
                        <input
                            className="text-[15px] border-2 border-[#e9e9e9] p-4 rounded-2xl"
                            type="text"
                            placeholder="Add tags"
                            name="tags"
                            id="tags"
                        />
                        <small className="text-[#a6a6a6] text-[13px]">
                            Don&apos;t worry, people people won&apos;t see your tags
                        </small>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreatePageWrapper