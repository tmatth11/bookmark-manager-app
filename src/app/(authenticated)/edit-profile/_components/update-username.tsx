"use client";

import { updateUsername } from "@/actions/profile-actions";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Profile, UpdateUsernameState } from "@/types";
import { useActionState, useState } from "react";

const initialState: UpdateUsernameState = {};

export default function UpdateUsername({ profile }: { profile: Profile }) {
    const [state, formAction, isPending] = useActionState(updateUsername, initialState);
    const [username, setUsername] = useState(profile.username);

    return (
        <form action={formAction} className="flex flex-col items-center gap-2">
            <h4 className="text-lg font-semibold">Update Username</h4>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        placeholder="Enter username"
                        required
                    />
                </Field>
                {state.error && <p className="form-error">{state.error}</p>}
                <Field>
                    <Button disabled={username === "" || isPending} type="submit">Update Username</Button>
                </Field>
            </FieldGroup>
        </form>
    );
}
