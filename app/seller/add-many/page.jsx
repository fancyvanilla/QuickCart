'use client'
import axios from 'axios'
import React from 'react'
import { useAuth } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast'
const AddManyProducts = () => {
const [jsonInput, setJsonInput] = React.useState('')
const { getToken } = useAuth();

const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        const data = JSON.parse(jsonInput)
        if (!Array.isArray(data) || data.length === 0) {
            console.log('Invalid input:', data)
            throw new Error('Input must be an array of products')
        }
        const token = await getToken()
        //assuming data is correct tbut neds fixing
        const response=await axios.post('/api/product/add-many', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
        if (response.data.success) {
            toast.success('Products added successfully!')
            setJsonInput('')
        } else {
            toast.error('Failed to add products')
        }
    } catch (err) {
        console.error(err)
        toast.error('Something went wrong')
    }
}

return (
    <div className='flex-1 min-h-screen flex flex-col p-4'>
        <h2 className="text-2xl font-bold mb-4">Add Multiple Products</h2>
        <form onSubmit={handleSubmit} className="bg-white rounded max-w-2xl">
            <label className="block mb-2 font-medium">
                Paste JSON:
                <textarea
                    className="w-full border rounded p-2 mt-1"
                    rows={8}
                    value={jsonInput}
                    onChange={e => setJsonInput(e.target.value)}
                    placeholder='[{ "name": "Product 1", "price": 10 }, ...]'
                />
            </label>
            <button
                type="submit"
                className="mt-3 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 cursor"
            >
                Submit
            </button>
        </form>
    </div>
)
}

export default AddManyProducts