import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

export default function TitleSearch() {
    return (
        <InputGroup className="py-4">
            <InputGroupInput placeholder="Search by title..." />
            <InputGroupAddon>
                <Search />
            </InputGroupAddon>
        </InputGroup>
    );
}
