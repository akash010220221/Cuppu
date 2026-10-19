import { useState } from "react";

export const usePasswordValidation = () => {
    const [password, setPassword] = useState("");

    const validation = {
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        length: password.length >= 8,
    }

    return { password, setPassword, validation };
}