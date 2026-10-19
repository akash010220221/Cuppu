

export default function Input ({ type, placeholder, onClick, reference, customProps }) {
    return (
        <div>
            <input className="border p-2 w-full rounded-md" type={type} placeholder={placeholder}  onClick={onClick} ref={reference} {...customProps}/>
        </div>
    )
}