export function SearchInput({value, onChange}){
return (
<InputGroup>
    <InputLeftElement pointerEvents="none">
    <MdSearch color="gray" />
    </InputLeftElement>
    <Input
    placeholder="Search locations or anime..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    />
</InputGroup>
);
}
