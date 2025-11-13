import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { MdSearch } from "react-icons/md";

export function SearchInput({value, onChange}){
return (
<InputGroup>
    <InputLeftElement pointerEvents="none">
    <MdSearch color="gray" />
    </InputLeftElement>
    <Input
    placeholder="Search locations or anime..."
    value={value}
    onChange={onChange}
    />
</InputGroup>
);
}
