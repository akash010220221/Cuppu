export default function Select({ options,reference, onChange }) {
    return (
        <select ref={reference} className="border p-2 w-full rounded-md cursor-pointer" onChange={onChange}>
            
            {options.map(opt => (
                <option className="font-mono" value={opt} key={opt}>{opt}</option>
            ))}
        </select>
    )
}